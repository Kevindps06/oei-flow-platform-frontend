import { getConvenioFromSharePoint } from "../../../../utils/utils"
import axios from "axios"

export const post = async (req, res) => {
  res.status(200).send();

  let formsFinancieraRegistration = {
    ID: req.body.Id,
    "Tipo de persona": req.body.TipoPersona,
    "Tipo de relacion": req.body.TipoRelacion,
    "Tipo de soporte contable": req.body.TipoSoporteContable,
    Email: req.body.Email,
    Convenio: req.body.Convenio,
    Nombre: req.body.Nombre,
  };

  if (req.body.TipoPersona === "Natural") {
    formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
      "Numero de cedula de ciudadania": req.body.Identificator,
      RUT: req.body.RutFiles,
      Cedula: req.body.CedulaFiles,
      "Certificacion bancaria": req.body.CertificacionBancariaFiles,
    });
  } else {
    formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
      "NIT (Con digito de verificacion y previamente registrado) Ej. 890507890-4":
        req.body.Identificator,
      RUT: req.body.RutFiles,
      "Cedula representante legal": req.body.CedulaFiles,
      "Certificacion bancaria": req.body.CertificacionBancariaFiles,
    });
  }

  formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
    "Informacion adicional": req.body.InformacionAdicional,
  });

  formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
    Keys: Object.keys(formsFinancieraRegistration),
    ConvenioInformation: await getConvenioFromSharePoint(
      req.body.Convenio
    ),
  });

  await axios.default.post(
    `https://prod-20.brazilsouth.logic.azure.com:443/workflows/d86f74b4e4374001a78424d69cc15240/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4gnntmoLVSwLIKE6lvawvpgJ_Z3Xq9u5hTj0Iof4qQI`,
    [formsFinancieraRegistration]
  );
};
