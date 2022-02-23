import { Router } from "express";
const router = Router();

// /api/forms/juridica/request/minuta

import * as formsJuridicaRequestMinutaController from "../../../../../controllers/forms/juridica/request/minuta/forms.juridica.request.minuta.controller"

// /api/forms/juridica/request/minuta/availability

router.get("/availability", formsJuridicaRequestMinutaController.availability);

// /api/forms/juridica/request/minuta/verifyencargado

router.get(
  "/verifyencargado",
  formsJuridicaRequestMinutaController.verifyEncargado
);

export default router;
