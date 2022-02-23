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

    console.log(juridicaRequest[0].Minuta);

    switch (juridicaRequest[0].Minuta) {
      case undefined:
        res.status(406).send();
        break;
      case false:
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
