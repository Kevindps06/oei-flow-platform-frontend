import { Router } from "express";
const router = Router();

// api/forms/certificadosingresosretenciones/years

import * as certificadosIngresosRetencionesController from "../../../../controllers/forms/certificadosingresosretenciones/forms.certificadosingresosretenciones.controller";

router.get(
  "/",
  certificadosIngresosRetencionesController.getCertificadoIngresosRetencionesYears
);

export default router;
