import formsJuridicaRequestSchema from "../../../../schemas/forms/juridica/request/forms.juridica.request.schema";
import { formsJuridicaRequestObjectWithoutUndefined } from "../../../../utils/utils";

export const save = async (req, res) => {
  try {
    const juridicaRequest = new formsJuridicaRequestSchema(req.body);

    await juridicaRequest.save();

    res.status(201).json(juridicaRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
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

    res.status(200).json(juridicaRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const juridicaRequest = await formsJuridicaRequestSchema.updateMany(
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
      ),
      req.body
    );

    res.status(200).json(juridicaRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const juridicaRequest = await formsJuridicaRequestSchema.deleteMany(
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

    res.status(200).json(juridicaRequest);
  } catch (err) {
    res.status(500).json(err);
  }
};
