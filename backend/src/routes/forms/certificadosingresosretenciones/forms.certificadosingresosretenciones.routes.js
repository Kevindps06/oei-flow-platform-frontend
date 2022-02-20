import { Router } from "express";
const router = Router();

// api/forms/certificadosingresosretenciones

import * as certificadosIngresosRetencionesController from "../../../controllers/forms/certificadosingresosretenciones/forms.certificadosingresosretenciones.controller";

router.get(
  "/",
  certificadosIngresosRetencionesController.getCertificadoIngresosRetencionesByYearAndIdentificator
);

// api/forms/certificadosingresosretenciones/years

import certificadosIngresosRetencionesYearsRoutes from "./years/forms.certificadosingresosretenciones.years.routes";

router.use("/years", certificadosIngresosRetencionesYearsRoutes);

export default router;
