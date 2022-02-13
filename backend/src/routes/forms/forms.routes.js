import { Router } from "express";
const router = Router();

// Forms - Financiera

import financieraRoutes from "./financiera/forms.financiera.routes";

router.use("/financiera", financieraRoutes);

// Forms - CoordinacionesLogisticas

router.post("/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = new CoordinacionLogistica(req.body);

    await coordinacionLogistica.save();

    res.status(201).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.find(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
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
});

router.put("/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.updateMany(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
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
});

router.delete("/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.deleteMany(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
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
});

export default router;
