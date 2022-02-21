import { Router } from "express";
const router = Router();

// /api/forms/juridica/request/flow

import * as formsJuridicaRequestFlowController from "../../../../../controllers/forms/juridica/request/flow/forms.juridica.request.flow.controller";

router.post("/", formsJuridicaRequestFlowController.post);

export default router;
