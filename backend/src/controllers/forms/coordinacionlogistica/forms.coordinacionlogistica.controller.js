import formsCoordinacionLogisticaSchema from "../../../schemas/forms/coordinacionlogistica/forms.coordinacionlogistica.schema";
import { formsCoordinacionLogisticaObjectWithoutUndefined } from "../../../utils/utils";

export const save = async (req, res) => {
  try {
    const coordinacionLogistica = new formsCoordinacionLogisticaSchema(
      req.body
    );

    await coordinacionLogistica.save();

    res.status(201).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const coordinacionLogistica = await formsCoordinacionLogisticaSchema.find(
      formsCoordinacionLogisticaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.Nombre,
        req.query.Convenio,
        req.query.Tramos,
        req.query.IdentificatorType,
        req.query.Identificator,
        req.query.FechaNacimiento,
        req.query.EquipajeAdicional,
        req.query.Email,
        req.query.Telefono,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.CoordinacionLogisticaPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.TicketNumber,
        req.query.Quotations,
        req.query.SelectedQuotation
      )
    );

    res.status(200).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const coordinacionLogistica =
      await formsCoordinacionLogisticaSchema.updateMany(
        formsCoordinacionLogisticaObjectWithoutUndefined(
          req.query._id,
          req.query.Id,
          req.query.Nombre,
          req.query.Convenio,
          req.query.Tramos,
          req.query.IdentificatorType,
          req.query.Identificator,
          req.query.FechaNacimiento,
          req.query.EquipajeAdicional,
          req.query.Email,
          req.query.Telefono,
          req.query.InformacionAdicional,
          req.query.Requestor,
          req.query.ConvenioInformation,
          req.query.Configuration,
          req.query.CoordinacionLogisticaPath,
          req.query.SharePointFiles,
          req.query.Keys,
          req.query.TicketNumber,
          req.query.Quotations,
          req.query.SelectedQuotation
        ),
        req.body
      );

    res.status(200).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const coordinacionLogistica =
      await formsCoordinacionLogisticaSchema.deleteMany(
        formsCoordinacionLogisticaObjectWithoutUndefined(
          req.query._id,
          req.query.Id,
          req.query.Nombre,
          req.query.Convenio,
          req.query.Tramos,
          req.query.IdentificatorType,
          req.query.Identificator,
          req.query.FechaNacimiento,
          req.query.EquipajeAdicional,
          req.query.Email,
          req.query.Telefono,
          req.query.InformacionAdicional,
          req.query.Requestor,
          req.query.ConvenioInformation,
          req.query.Configuration,
          req.query.CoordinacionLogisticaPath,
          req.query.SharePointFiles,
          req.query.Keys,
          req.query.TicketNumber,
          req.query.Quotations,
          req.query.SelectedQuotation
        )
      );

    res.status(200).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
};