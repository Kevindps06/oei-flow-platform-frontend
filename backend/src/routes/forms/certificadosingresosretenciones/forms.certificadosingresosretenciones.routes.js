import { Router } from "express";
const router = Router();

// api/forms/certificadosingresosretenciones

import * as certificadosIngresosRetencionesController from "../../../controllers/forms/certificadosingresosretenciones/forms.certificadosingresosretenciones.controller";

router.get(
  "/",
  certificadosIngresosRetencionesController.getCertificadoIngresosRetencionesByIdentificator
);

export default router;
