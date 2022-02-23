import formsJuridicaRequestSchema from "../../../../../schemas/forms/juridica/request/forms.juridica.request.schema";
import { formsJuridicaRequestObjectWithoutUndefined } from "../../../../../utils/utils";

export const availability = async (req, res) => {
  try {
    const juridicaRequest = await formsJuridicaRequestSchema.find(
      formsJuridicaRequestObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPeticion,
        req.query.TipoCompraContratacion,
        req.query.TipoAdquisicion,
        req.query.TipoAdquisicionOtro,
        req.query.ConvenioResponsable,
        req.query.JustificacionContratacion,
        req.query.ObjetivoContratacion,
        req.query.EspecificacionesTecnicasMinimas,
        req.query.PerfilRequerido,
        req.query.FactoresEvaluacion,
        req.query.Objeto,
        req.query.ObligacionesEspecificas,
        req.query.ProductosEntregables,
        req.query.PresupuestoEstimado,
        req.query.FormaPago,
        req.query.Plazo,
        req.query.ManejoDatos,
        req.query.CategoriaInteresado,
        req.query.CategoriaDatos,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.Eula,
        req.query.Minuta
      )
    );

    switch (JSON.stringify(juridicaRequest[0].Minuta)) {
      case undefined:
      case "{}":
        res.status(406).send();
        break;
      case "false":
        res.status(200).send();
        break;
      default:
        res.status(423).send();
        break;
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const verifyEncargado = async (req, res) => {
  try {
    const juridicaRequest = await formsJuridicaRequestSchema.find(
      formsJuridicaRequestObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPeticion,
        req.query.TipoCompraContratacion,
        req.query.TipoAdquisicion,
        req.query.TipoAdquisicionOtro,
        req.query.ConvenioResponsable,
        req.query.JustificacionContratacion,
        req.query.ObjetivoContratacion,
        req.query.EspecificacionesTecnicasMinimas,
        req.query.PerfilRequerido,
        req.query.FactoresEvaluacion,
        req.query.Objeto,
        req.query.ObligacionesEspecificas,
        req.query.ProductosEntregables,
        req.query.PresupuestoEstimado,
        req.query.FormaPago,
        req.query.Plazo,
        req.query.ManejoDatos,
        req.query.CategoriaInteresado,
        req.query.CategoriaDatos,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.Eula,
        req.query.Minuta
      )
    );

    if (juridicaRequest[0].Configuration.find(configuration => configuration.minuta === true).encargado.EMail === req.query.encargado) {
      res.status(200).send()
    } else {
      res.status(403).send()
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
