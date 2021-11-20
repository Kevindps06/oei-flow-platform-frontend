const axios = require("axios");
const auth = require("../apis/microsoft/auth");
const FinancieraFlow = require("../schemas/configuration/FinancieraFlow");
const CoordinacionLogisticaFlow = require("../schemas/configuration/CoordinacionLogisticaFlow");

async function getConvenioFromSharePoint(convenioNumber) {
  let convenioFromSharePoint;

  let retries = 0;
  do {
    try {
      convenioFromSharePoint = (
        await axios.default.get(
          `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items`,
          {
            headers: {
              Authorization:
                "Bearer " +
                (
                  await auth.getToken(auth.tokenRequest)
                ).accessToken,
              Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
            },
            params: {
              $select: "id",
              $expand: "fields",
              $filter: `fields/Numero eq '${convenioNumber}'`,
            },
          }
        )
      ).data.value[0].fields;
    } catch (err) {
      console.log(`Try: ${retries} - Error:`, err);
    }

    retries++;
  } while (!convenioFromSharePoint && retries < 5);

  delete convenioFromSharePoint["@odata.etag"];

  return convenioFromSharePoint;
}

async function getUserFromSharePoint(lookupId) {
  let user;

  let retries = 0;
  do {
    try {
      user = (
        await axios.default.get(
          `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_USERINFORMATION_LIST_ID}/items/${lookupId}`,
          {
            headers: {
              Authorization:
                "Bearer " +
                (
                  await auth.getToken(auth.tokenRequest)
                ).accessToken,
              Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
            },
            params: {
              $select: "id",
              $expand: "fields",
            },
          }
        )
      ).data.fields;
    } catch (err) {
      console.log(`Try: ${retries} - Error:`, err);
    }

    retries++;
  } while (!user && retries < 5);

  delete user["@odata.etag"];

  return user;
}

async function inflateFlowSteps(flowSteps, convenio) {
  let inflateFlowSteps = [];

  for (let i = 0; flowSteps.length > i; i++) {
    if (
      flowSteps[i].doWhen &&
      !flowSteps[i].doWhen.find((doWhen) => doWhen.convenio == convenio.Numero)
    ) {
      continue;
    }

    const exception = flowSteps[i].exceptions?.find(
      (exception) => exception.convenio == convenio.Numero
    );

    const encargado = await getUserFromSharePoint(
      convenio[flowSteps[i].key][exception ? exception.encargado : 0].LookupId
    );

    flowSteps[i].encargado = encargado;

    inflateFlowSteps.push(flowSteps[i]);
  }

  return inflateFlowSteps;
}

async function getFinancieraFlowStepsWithEncargados(
  _id,
  TipoPersona,
  TipoRelacion,
  TipoGestion,
  TipoLegalizacion,
  steps,
  convenio
) {
  // For localhost testing only
  /*let stepsFromConfiguration = (
    await axios.default.get(
      `https://oeiprojectflow.org/api/configuration/financieraflow`,
      {
        params: financieraFlowObjectWithoutUndefined(
          _id,
          TipoPersona,
          TipoRelacion,
          TipoGestion,
          TipoLegalizacion,
          steps
        ),
      }
    )
  ).data[0].steps;*/

  // Production direct with database
  let stepsFromConfiguration = (
    await FinancieraFlow.find(
      financieraFlowObjectWithoutUndefined(
        _id,
        TipoPersona,
        TipoRelacion,
        TipoGestion,
        TipoLegalizacion,
        steps
      )
    )
  )[0].steps;

  return await inflateFlowSteps(stepsFromConfiguration, convenio);
}

async function getCoordinacionLogisticaFlowStepsWithEncargados(
  _id,
  steps,
  convenio
) {
  // For localhost testing only
  /*let stepsFromConfiguration = (
    await axios.default.get(
      `https://oeiprojectflow.org/api/configuration/coordinacionlogisticaflow`,
      {
        params: coordinacionLogisticaFlowObjectWithoutUndefined(_id, steps),
      }
    )
  ).data[0].steps;*/

  // Production direct with database
  let stepsFromConfiguration = (
    await CoordinacionLogisticaFlow.find(
      coordinacionLogisticaFlowObjectWithoutUndefined(_id, steps)
    )
  )[0].steps;

  return await inflateFlowSteps(stepsFromConfiguration, convenio);
}

function makeRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function uploadFileToSharePoint(path, base64) {
  const authResponse = await auth.getToken(auth.tokenRequest);

  var response = await axios.default.post(
    `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/drive/root:${path}:/createUploadSession`,
    {},
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );

  const data = Buffer.from(base64, "base64");
  const dataLength = data.length;
  const chunkSize = 327680; // 320 KiB
  const chunks = Math.ceil(dataLength / chunkSize, dataLength) - 1;

  var uploadResponse;

  var chunk = 0;
  while (chunks >= chunk) {
    const chunkOffset = chunk * chunkSize;
    const chunkData = data.slice(chunkOffset, chunkOffset + chunkSize);
    const chunkDataLength = chunkData.length;
    const chunkEndRange = chunkOffset + chunkDataLength - 1;

    try {
      uploadResponse = await axios.default.put(
        response.data.uploadUrl,
        chunkData,
        {
          headers: {
            "Content-Length": chunkDataLength,
            "Content-Range": `bytes ${chunkOffset}-${chunkEndRange}/${dataLength}`,
          },
        }
      );
    } catch (err) {
      if (err.code === "ETIMEDOUT") {
        continue;
      }

      throw err;
    }

    chunk++;
  }

  delete uploadResponse.data["@odata.context"];
  delete uploadResponse.data["@content.downloadUrl"];

  return uploadResponse.data;
}

async function uploadFilesToSharePointWorkflow(path, files) {
  let filesPromises = [];

  for (let file in files) {
    filesPromises.push(
      uploadFileToSharePoint(
        `${path}/${file}. ${files[file].Name}`,
        files[file].Bytes
      )
    );
  }

  return await Promise.all(filesPromises);
}

function financieraFlowObjectWithoutUndefined(
  _id,
  persona,
  relacion,
  gestion,
  legalizacion,
  steps
) {
  var obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (persona) {
    obj.persona = persona;
  }

  if (relacion) {
    obj.relacion = relacion;
  }

  if (gestion) {
    obj.gestion = gestion;
  }

  if (legalizacion) {
    obj.legalizacion = legalizacion;
  }

  if (steps) {
    obj.steps = steps;
  }

  return obj;
}

function coordinacionLogisticaFlowObjectWithoutUndefined(_id, steps) {
  var obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (steps) {
    obj.steps = steps;
  }

  return obj;
}

function formsFinancieraInvoiceObjectWithoutUndefined(
  _id,
  Id,
  TipoPersona,
  TipoRelacion,
  Identificator,
  Email,
  TipoGestion,
  TipoLegalizacion,
  Convenio,
  InformacionAdicional,
  ConvenioInformation,
  Configuration,
  GestionPath,
  SharePointFiles,
  Keys
) {
  var obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (Id) {
    obj.Id = Id;
  }

  if (TipoPersona) {
    obj.TipoPersona = TipoPersona;
  }

  if (TipoRelacion) {
    obj.TipoRelacion = TipoRelacion;
  }

  if (Identificator) {
    obj.Identificator = Identificator;
  }

  if (Email) {
    obj.Email = Email;
  }

  if (TipoGestion) {
    obj.TipoGestion = TipoGestion;
  }

  if (TipoLegalizacion) {
    obj.TipoLegalizacion = TipoLegalizacion;
  }

  if (Convenio) {
    obj.Convenio = Convenio;
  }

  obj.InformacionAdicional = InformacionAdicional;

  if (ConvenioInformation) {
    obj.ConvenioInformation = ConvenioInformation;
  }

  if (Configuration) {
    obj.Configuration = Configuration;
  }

  if (GestionPath) {
    obj.GestionPath = GestionPath;
  }

  if (SharePointFiles) {
    obj.SharePointFiles = SharePointFiles;
  }

  if (Keys) {
    obj.Keys = Keys;
  }

  return obj;
}

function formsCoordinacionLogisticaObjectWithoutUndefined(
  _id,
  Id,
  Nombre,
  Convenio,
  Ida,
  HorarioIda,
  Vuelta,
  HorarioVuelta,
  Identificator,
  FechaNacimiento,
  EquipajeAdicional,
  Email,
  Telefono,
  InformacionAdicional,
  Requestor,
  ConvenioInformation,
  Configuration,
  CoordinacionLogisticaPath,
  SharePointFiles,
  Keys,
  Quotations,
  SelectedQuotation
) {
  var obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (Id) {
    obj.Id = Id;
  }

  if (Nombre) {
    obj.Nombre = Nombre;
  }

  if (Convenio) {
    obj.Convenio = Convenio;
  }

  if (Ida) {
    obj.Ida = Ida;
  }

  if (HorarioIda) {
    obj.HorarioIda = HorarioIda;
  }

  if (Vuelta) {
    obj.Vuelta = Vuelta;
  }

  if (HorarioVuelta) {
    obj.HorarioVuelta = HorarioVuelta;
  }

  if (Identificator) {
    obj.Identificator = Identificator;
  }

  if (FechaNacimiento) {
    obj.FechaNacimiento = FechaNacimiento;
  }

  if (EquipajeAdicional) {
    obj.EquipajeAdicional = EquipajeAdicional;
  }

  if (Email) {
    obj.Email = Email;
  }

  if (Telefono) {
    obj.Telefono = Telefono;
  }

  obj.InformacionAdicional = InformacionAdicional;

  if (Requestor) {
    obj.Requestor = Requestor;
  }

  if (ConvenioInformation) {
    obj.ConvenioInformation = ConvenioInformation;
  }

  if (Configuration) {
    obj.Configuration = Configuration;
  }

  if (CoordinacionLogisticaPath) {
    obj.CoordinacionLogisticaPath = CoordinacionLogisticaPath;
  }

  if (SharePointFiles) {
    obj.SharePointFiles = SharePointFiles;
  }

  if (Keys) {
    obj.Keys = Keys;
  }

  if (Quotations) {
    obj.Quotations = Quotations;
  }

  if (SelectedQuotation) {
    obj.SelectedQuotation = SelectedQuotation;
  }

  return obj;
}

module.exports = {
  uploadFileToSharePoint: uploadFileToSharePoint,
  uploadFilesToSharePointWorkflow: uploadFilesToSharePointWorkflow,
  makeRandomString: makeRandomString,
  financieraFlowObjectWithoutUndefined: financieraFlowObjectWithoutUndefined,
  coordinacionLogisticaFlowObjectWithoutUndefined:
    coordinacionLogisticaFlowObjectWithoutUndefined,
  formsFinancieraInvoiceObjectWithoutUndefined:
    formsFinancieraInvoiceObjectWithoutUndefined,
  formsCoordinacionLogisticaObjectWithoutUndefined:
    formsCoordinacionLogisticaObjectWithoutUndefined,
  getConvenioFromSharePoint: getConvenioFromSharePoint,
  getFinancieraFlowStepsWithEncargados: getFinancieraFlowStepsWithEncargados,
  getCoordinacionLogisticaFlowStepsWithEncargados:
    getCoordinacionLogisticaFlowStepsWithEncargados,
  getUserFromSharePoint: getUserFromSharePoint,
};
