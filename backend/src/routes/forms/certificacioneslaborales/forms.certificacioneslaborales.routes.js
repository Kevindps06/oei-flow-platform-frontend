import { Router } from "express";
const router = Router();

// api/forms/certificacioneslaborales

import * as certificacionesLaboralesController from "../../../controllers/forms/certificacioneslaborales/forms.certificacioneslaborales.controller";

router.get(
  "/",
  certificacionesLaboralesController.getCertificacionLaboralByIdentificator
);

export default router;
