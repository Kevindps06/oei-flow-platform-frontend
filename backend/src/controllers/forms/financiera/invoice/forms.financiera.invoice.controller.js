import FinancieraInvoice from "../../../../schemas/forms/financiera/invoice/forms.financiera.invoice.schema"
import { formsFinancieraInvoiceObjectWithoutUndefined } from "../../../../utils/utils"

export const save = async (req, res) => {
    try {
    const financieraInvoice = new FinancieraInvoice(req.body);

    await financieraInvoice.save();

    res.status(201).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.find(
      formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      )
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.updateMany(
      formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      ),
      req.body
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.deleteMany(
      formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      )
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
};