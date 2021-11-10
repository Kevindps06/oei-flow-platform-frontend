const fs = require("fs");
const axios = require("axios");
const auth = require("../apis/microsoft/auth");

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

async function uploadFileToSharePointWorkflowOEI(path, base64) {
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
    console.log(`${chunk}/${chunks}`);
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

  return uploadResponse;
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

function coordinacionLogisticaFlowObjectWithoutUndefined(
  _id,
  steps
) {
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
  Id,
  TipoPersona,
  TipoRelacion,
  Identificator,
  Email,
  TipoGestion,
  TipoLegalizacion,
  Convenio,
  InformacionAdicional,
  Configuration,
  GestionPath
) {
  var obj = {};

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

  if (Configuration) {
    obj.Configuration = Configuration;
  }

  if (GestionPath) {
    obj.GestionPath = GestionPath;
  }

  return obj;
}

function formsCoordinacionLogisticaObjectWithoutUndefined(
  Id,
  Nombre,
  Convenio,
  Ida,
  Vuelta,
  Identificator,
  EquipajeAdicional,
  Email,
  Telefono,
  InformacionAdicional,
  Configuration,
  CoordinacionLogisticaPath
) {
  var obj = {};

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

  if (Vuelta) {
    obj.Vuelta = Vuelta;
  }

  if (Identificator) {
    obj.Identificator = Identificator;
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

  if (Configuration) {
    obj.Configuration = Configuration;
  }

  if (CoordinacionLogisticaPath) {
    obj.CoordinacionLogisticaPath = CoordinacionLogisticaPath;
  }

  return obj;
}

module.exports = {
  uploadFileToSharePointWorkflowOEI: uploadFileToSharePointWorkflowOEI,
  makeRandomString: makeRandomString,
  financieraFlowObjectWithoutUndefined: financieraFlowObjectWithoutUndefined,
  coordinacionLogisticaFlowObjectWithoutUndefined:
    coordinacionLogisticaFlowObjectWithoutUndefined,
  formsFinancieraInvoiceObjectWithoutUndefined:
    formsFinancieraInvoiceObjectWithoutUndefined,
  formsCoordinacionLogisticaObjectWithoutUndefined:
    formsCoordinacionLogisticaObjectWithoutUndefined,
};
