import axios from "axios";
import { getToken, tokenRequest } from "../apis/microsoft/auth";
import fs from "fs";
import path from "path";
import configurationFinancieraFlowSchema from "../schemas/configuration/financieraflow/configuration.financieraflow.schema";
import configurationJuridicaFlowSchema from "../schemas/configuration/juridicaflow/configuration.juridicaflow.schema";
import configurationCoordinacionLogisticaFlowSchema from "../schemas/configuration/coordinacionlogisticaflow/configuration.coordinacionlogisticaflow.schema";

export const getConvenioFromSharePoint = async (convenioNumber) => {
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
                "Bearer " + (await getToken(tokenRequest)).accessToken,
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

  return getConvenioFromSharePointById(convenioFromSharePoint.id);
};

export const getConvenioFromSharePointById = async (convenioId) => {
  let convenioFromSharePoint;

  let retries = 0;
  do {
    try {
      convenioFromSharePoint = (
        await axios.default.get(
          `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items/${convenioId}`,
          {
            headers: {
              Authorization:
                "Bearer " + (await getToken(tokenRequest)).accessToken,
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
  } while (!convenioFromSharePoint && retries < 5);

  delete convenioFromSharePoint["@odata.etag"];

  return convenioFromSharePoint;
};

export const getUserFromSharePointFinancieraOEI = async (lookupId) => {
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
                "Bearer " + (await getToken(tokenRequest)).accessToken,
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
};

/* Esta funcion asigna la informacion completa del usuario encargado en cada paso de la configuracion del flujo */
export const inflateFlowStepsFinancieraOEI = async (flowSteps, convenio) => {
  const inflatedFlowSteps = [];

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

    const encargado = await getUserFromSharePointFinancieraOEI(
      convenio[flowSteps[i].key][exception ? exception.encargado : 0].LookupId
    );

    flowSteps[i].encargado = encargado;

    inflatedFlowSteps.push(flowSteps[i]);
  }

  return inflatedFlowSteps;
};

export const getFinancieraFlowStepsWithEncargados = async (
  _id,
  TipoPersona,
  TipoRelacion,
  TipoGestion,
  TipoLegalizacion,
  steps,
  convenio
) => {
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
  const stepsFromConfiguration = (
    await configurationFinancieraFlowSchema.find(
      configurationFinancieraFlowObjectWithoutUndefined(
        _id,
        TipoPersona,
        TipoRelacion,
        TipoGestion,
        TipoLegalizacion,
        steps
      )
    )
  )[0].steps;

  return await inflateFlowStepsFinancieraOEI(stepsFromConfiguration, convenio);
};

export const getUserFromSharePointJuridicaOEI = async (lookupId) => {
  let user;

  let retries = 0;
  do {
    try {
      user = (
        await axios.default.get(
          `https://graph.microsoft.com/v1.0/sites/${process.env.JURIDICA_OEI_SITE_ID}/lists/${process.env.JURIDICA_OEI_SITE_USERINFORMATION_LIST_ID}/items/${lookupId}`,
          {
            headers: {
              Authorization:
                "Bearer " + (await getToken(tokenRequest)).accessToken,
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
};

/* Esta funcion asigna la informacion completa del usuario encargado en cada paso de la configuracion del flujo */
export const inflateFlowStepsJuridicaOEI = async (flowSteps, convenio) => {
  const inflatedFlowSteps = [];

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

    const encargado = await getUserFromSharePointJuridicaOEI(
      convenio[flowSteps[i].key][exception ? exception.encargado : 0].LookupId
    );

    flowSteps[i].encargado = encargado;

    inflatedFlowSteps.push(flowSteps[i]);
  }

  return inflatedFlowSteps;
};

export const getConfigurationJuridicaFlowStepsWithEncargados = async (
  _id,
  TipoCompraContratacion,
  steps,
  convenio
) => {
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
  const stepsFromConfiguration = (
    await configurationJuridicaFlowSchema.find(
      configurationJuridicaFlowObjectWithoutUndefined(
        _id,
        TipoCompraContratacion,
        steps
      )
    )
  )[0].steps;

  return await inflateFlowStepsJuridicaOEI(stepsFromConfiguration, convenio);
};

export const getCoordinacionLogisticaFlowStepsWithEncargados = async (
  _id,
  steps,
  convenio
) => {
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
  const stepsFromConfiguration = (
    await configurationCoordinacionLogisticaFlowSchema.find(
      configurationCoordinacionLogisticaFlowObjectWithoutUndefined(_id, steps)
    )
  )[0].steps;

  return await inflateFlowSteps(stepsFromConfiguration, convenio);
};

export const makeRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export const uploadFileToSharePointFinanciera = async (path, buffer) => {
  var response = await axios.default.post(
    `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/drive/root:${path}:/createUploadSession`,
    {},
    {
      headers: {
        Authorization: "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  const data = buffer;
  const dataLength = data.length === 0 ? 1 : data.length;

  //const chunkSize = 327680; // 320 KiB * 1
  //const chunkSize = 655360; // 640 KiB * 2
  //const chunkSize = 983040; // 960 KiB * 3
  //const chunkSize = 1310720; // 1.25 MiB * 4
  //const chunkSize = 1638400; // 1.56 MiB * 5
  //const chunkSize = 1966080; // 1.87 MiB * 6
  //const chunkSize = 2293760; // 2.18 MiB * 7
  const chunkSize = 2621440; // 2.5 MiB * 8
  //const chunkSize = 2949120; // 2.81 MiB * 9
  //const chunkSize = 327680; // 3.12 MiB * 10
  //const chunkSize = 3604480; // 3.43 MiB * 11
  //const chunkSize = 3932160; // 3.75 MiB * 12
  //const chunkSize = 4259840; // 4.06 MiB * 13
  //const chunkSize = 4587520; // 4.37 MiB * 14
  //const chunkSize = 4915200; // 4.68 MiB * 15
  //const chunkSize = 5242880; // 5 MiB * 16
  const chunks = Math.ceil(dataLength / chunkSize, dataLength) - 1;

  let uploadResponse;

  let chunk = 0;
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
      continue;
    }

    chunk++;
  }

  delete uploadResponse.data["@odata.context"];
  delete uploadResponse.data["@content.downloadUrl"];

  return uploadResponse.data;
};

export const uploadFilesToSharePointFinanciera = async (filesPath, files) => {
  if (!files) {
    return [];
  }

  let filesUploadResponses = [];

  for (let i = 0; files.length > i; i++) {
    if (files[i].ServerPath) {
      const tmpFilePath = path.join(files[i].ServerPath, files[i].Name);

      filesUploadResponses.push(
        await uploadFileToSharePointFinanciera(
          `${filesPath}/${i}. ${files[i].Name}`,
          fs.readFileSync(tmpFilePath)
        )
      );

      fs.rm(path.dirname(tmpFilePath), { recursive: true }, (err) => {
        if (err) {
          console.log(`File delete error: ${err}`);
        }
      });
    } else {
      filesUploadResponses.push(
        await uploadFileToSharePointFinanciera(
          `${filesPath}/${i}. ${files[i].Name}`,
          Buffer.from(files[i].Bytes, "base64")
        )
      );
    }
  }

  return filesUploadResponses;
};

export const uploadFileToSharePointJuridica = async (path, buffer) => {
  var response = await axios.default.post(
    `https://graph.microsoft.com/v1.0/sites/${process.env.JURIDICA_OEI_SITE_ID}/drive/root:${path}:/createUploadSession`,
    {},
    {
      headers: {
        Authorization: "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  const data = buffer;
  const dataLength = data.length === 0 ? 1 : data.length;

  //const chunkSize = 327680; // 320 KiB * 1
  //const chunkSize = 655360; // 640 KiB * 2
  //const chunkSize = 983040; // 960 KiB * 3
  //const chunkSize = 1310720; // 1.25 MiB * 4
  //const chunkSize = 1638400; // 1.56 MiB * 5
  //const chunkSize = 1966080; // 1.87 MiB * 6
  //const chunkSize = 2293760; // 2.18 MiB * 7
  const chunkSize = 2621440; // 2.5 MiB * 8
  //const chunkSize = 2949120; // 2.81 MiB * 9
  //const chunkSize = 327680; // 3.12 MiB * 10
  //const chunkSize = 3604480; // 3.43 MiB * 11
  //const chunkSize = 3932160; // 3.75 MiB * 12
  //const chunkSize = 4259840; // 4.06 MiB * 13
  //const chunkSize = 4587520; // 4.37 MiB * 14
  //const chunkSize = 4915200; // 4.68 MiB * 15
  //const chunkSize = 5242880; // 5 MiB * 16
  const chunks = Math.ceil(dataLength / chunkSize, dataLength) - 1;

  let uploadResponse;

  let chunk = 0;
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
      continue;
    }

    chunk++;
  }

  delete uploadResponse.data["@odata.context"];
  delete uploadResponse.data["@content.downloadUrl"];

  return uploadResponse.data;
};

export const uploadFilesToSharePointJuridica = async (filesPath, files) => {
  if (!files) {
    return [];
  }

  let filesUploadResponses = [];

  for (let i = 0; files.length > i; i++) {
    if (files[i].ServerPath) {
      const tmpFilePath = path.join(files[i].ServerPath, files[i].Name);

      filesUploadResponses.push(
        await uploadFileToSharePointJuridica(
          `${filesPath}/${i}. ${files[i].Name}`,
          fs.readFileSync(tmpFilePath)
        )
      );

      fs.rm(path.dirname(tmpFilePath), { recursive: true }, (err) => {
        if (err) {
          console.log(`File delete error: ${err}`);
        }
      });
    } else {
      filesUploadResponses.push(
        await uploadFileToSharePointJuridica(
          `${filesPath}/${i}. ${files[i].Name}`,
          Buffer.from(files[i].Bytes, "base64")
        )
      );
    }
  }

  return filesUploadResponses;
};

export const configurationFinancieraFlowObjectWithoutUndefined = (
  _id,
  persona,
  relacion,
  gestion,
  legalizacion,
  steps
) => {
  const obj = {};

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
};

export const configurationCoordinacionLogisticaFlowObjectWithoutUndefined = (
  _id,
  steps
) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (steps) {
    obj.steps = steps;
  }

  return obj;
};

export const configurationJuridicaFlowObjectWithoutUndefined = (
  _id,
  tipo,
  steps
) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (tipo) {
    obj.tipo = tipo;
  }

  if (steps) {
    obj.steps = steps;
  }

  return obj;
};

export const authClientObjectWithoutUndefined = (_id, secret) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (secret) {
    obj.secret = secret;
  }

  return obj;
};

export const formsFinancieraInvoiceObjectWithoutUndefined = (
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
  Requestor,
  ConvenioInformation,
  Configuration,
  GestionPath,
  SharePointFiles,
  Keys
) => {
  const obj = {};

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

  if (InformacionAdicional) {
    obj.InformacionAdicional = InformacionAdicional;
  }

  if (Requestor) {
    obj.Requestor = Requestor;
  }

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
};

export const formsJuridicaRequestObjectWithoutUndefined = (
  _id,
  Id,
  TipoPeticion,
  TipoCompraContratacion,
  TipoAdquisicion,
  TipoAdquisicionOtro,
  ConvenioResponsable,
  JustificacionContratacion,
  ObjetivoContratacion,
  EspecificacionesTecnicasMinimas,
  PerfilRequerido,
  FactoresEvaluacion,
  Objeto,
  ObligacionesEspecificas,
  ProductosEntregables,
  PresupuestoEstimado,
  FormaPago,
  Plazo,
  ManejoDatos,
  CategoriaInteresado,
  CategoriaDatos,
  InformacionAdicional,
  Requestor,
  ConvenioInformation,
  Configuration,
  GestionPath,
  SharePointFiles,
  Keys
) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (Id) {
    obj.Id = Id;
  }

  if (TipoPeticion) {
    obj.TipoPeticion = TipoPeticion;
  }

  if (TipoCompraContratacion) {
    obj.TipoCompraContratacion = TipoCompraContratacion;
  }

  if (TipoAdquisicion) {
    obj.TipoAdquisicion = TipoAdquisicion;
  }

  if (TipoAdquisicionOtro) {
    obj.TipoAdquisicionOtro = TipoAdquisicionOtro;
  }

  if (ConvenioResponsable) {
    obj.ConvenioResponsable = ConvenioResponsable;
  }

  if (JustificacionContratacion) {
    obj.JustificacionContratacion = JustificacionContratacion;
  }

  if (ObjetivoContratacion) {
    obj.ObjetivoContratacion = ObjetivoContratacion;
  }

  if (EspecificacionesTecnicasMinimas) {
    obj.EspecificacionesTecnicasMinimas = EspecificacionesTecnicasMinimas;
  }

  if (PerfilRequerido) {
    obj.PerfilRequerido = PerfilRequerido;
  }

  if (FactoresEvaluacion) {
    obj.FactoresEvaluacion = FactoresEvaluacion;
  }

  if (Objeto) {
    obj.Objeto = Objeto;
  }

  if (ObligacionesEspecificas) {
    obj.ObligacionesEspecificas = ObligacionesEspecificas;
  }

  if (ProductosEntregables) {
    obj.ProductosEntregables = ProductosEntregables;
  }

  if (PresupuestoEstimado) {
    obj.PresupuestoEstimado = PresupuestoEstimado;
  }

  if (FormaPago) {
    obj.FormaPago = FormaPago;
  }

  if (Plazo) {
    obj.Plazo = Plazo;
  }

  if (ManejoDatos) {
    obj.ManejoDatos = ManejoDatos;
  }

  if (CategoriaInteresado) {
    obj.CategoriaInteresado = CategoriaInteresado;
  }

  if (CategoriaDatos) {
    obj.CategoriaDatos = CategoriaDatos;
  }

  if (InformacionAdicional) {
    obj.InformacionAdicional = InformacionAdicional;
  }

  if (Requestor) {
    obj.Requestor = Requestor;
  }

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
};

export const formsCoordinacionLogisticaObjectWithoutUndefined = (
  _id,
  Id,
  Nombre,
  Convenio,
  Tramos,
  IdentificatorType,
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
  TicketNumber,
  Quotations,
  SelectedQuotation
) => {
  const obj = {};

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

  if (Tramos) {
    obj.Tramos = [];

    for (let tramo of Tramos) {
      obj.Tramos.push({
        index: tramo.index,
        origen: tramo.origen,
        destino: tramo.destino,
        fechaIda: new Date(tramo.fechaIda).toLocaleDateString("es-CO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        horaIda: tramo.horaIda,
        fechaVuelta: tramo.fechaVuelta
          ? new Date(tramo.fechaVuelta).toLocaleDateString("es-CO", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : undefined,
        horaVuelta: tramo.horaVuelta,
      });
    }
  }

  if (IdentificatorType) {
    obj.IdentificatorType = IdentificatorType;
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

  if (InformacionAdicional) {
    obj.InformacionAdicional = InformacionAdicional;
  }

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

  if (TicketNumber) {
    obj.TicketNumber = TicketNumber;
  }

  if (Quotations) {
    obj.Quotations = Quotations;
  }

  if (SelectedQuotation) {
    obj.SelectedQuotation = SelectedQuotation;
  }

  return obj;
};

export const informationAirportObjectWithoutUndefined = (
  _id,
  Code,
  IATA,
  Airport_Name,
  City,
  City_2,
  Country,
  Country_2,
  Latitude,
  Longitude,
  Data_1,
  Data_2
) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (Code) {
    obj.Code = Code;
  }

  if (IATA) {
    obj.IATA = IATA;
  }

  if (Airport_Name) {
    obj["Airport Name"] = Airport_Name;
  }

  if (City) {
    obj.City = City;
  }

  if (City_2) {
    obj["City 2"] = City_2;
  }

  if (Country) {
    obj.Country = Country;
  }

  if (Country_2) {
    obj["Country 2"] = Country_2;
  }

  if (Latitude) {
    obj.Latitude = Latitude;
  }

  if (Longitude) {
    obj.Longitude = Longitude;
  }

  if (Data_1) {
    obj["Data 1"] = Data_1;
  }

  if (Data_2) {
    obj["Data 2"] = Data_2;
  }

  return obj;
};
