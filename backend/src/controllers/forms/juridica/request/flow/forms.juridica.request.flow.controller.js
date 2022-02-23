import formsJuridicaRequestSchema from "../../../../../schemas/forms/juridica/request/forms.juridica.request.schema";
import axios from "axios";
import {
  getConvenioFromSharePoint,
  getConfigurationJuridicaFlowStepsWithEncargados,
  formsJuridicaRequestObjectWithoutUndefined,
  uploadFilesToSharePointJuridica,
} from "../../../../../utils/utils"

export const post = async (req, res) => {
  res.status(200).send();

  const convenio = await getConvenioFromSharePoint(
    req.body.ConvenioResponsable
  );

  const configuration = await getConfigurationJuridicaFlowStepsWithEncargados(
    req.body._id,
    req.body.TipoCompraContratacion,
    req.body.steps,
    convenio
  );

  const gestionPath = `/Gestion/${req.body.TipoPeticion}/${req.body.TipoCompraContratacion}/${req.body.Id}`;

  let formsJuridicaRequest = formsJuridicaRequestObjectWithoutUndefined(
    req.body._id,
    req.body.Id,
    req.body.TipoPeticion,
    req.body.TipoCompraContratacion,
    req.body.TipoAdquisicion,
    req.body.TipoAdquisicionOtro,
    req.body.ConvenioResponsable,
    req.body.JustificacionContratacion,
    req.body.ObjetivoContratacion,
    req.body.EspecificacionesTecnicasMinimas,
    req.body.PerfilRequerido,
    req.body.FactoresEvaluacion,
    req.body.Objeto,
    req.body.ObligacionesEspecificas,
    req.body.ProductosEntregables,
    req.body.PresupuestoEstimado,
    req.body.FormaPago,
    req.body.Plazo,
    req.body.ManejoDatos,
    req.body.CategoriaInteresado,
    req.body.CategoriaDatos,
    req.body.InformacionAdicional,
    req.body.Requestor,
    convenio,
    configuration,
    gestionPath
  );

  formsJuridicaRequest = Object.assign(formsJuridicaRequest, {
    SharePointFiles: [
      {
        Name: "Files",
        Files: await uploadFilesToSharePointJuridica(
          `${gestionPath}/Files`,
          req.body.Files
        ),
      },
    ],
  });

  formsJuridicaRequest = Object.assign(formsJuridicaRequest, {
    Keys: Object.keys(formsJuridicaRequest),
  });

  /* Save to database */
  const juridicaRequest = new formsJuridicaRequestSchema(formsJuridicaRequest);
  juridicaRequest.save();

  let retries = 0;
  do {
    try {
      /* Send to MS FLOW */
      await axios.default.post(
        `https://prod-15.brazilsouth.logic.azure.com:443/workflows/1eaae5b7ca154223a3d773958eda4272/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=uUJBhDuLWr2Dsp5Iahal-XJUtPJJzYJQAfuiVOo2_-4`,
        [formsJuridicaRequest]
      );

      break;
    } catch (err) {
      console.log(`Try ${retries} - Error:`, err);
    }

    retries++;
  } while (retries < 5);
};
