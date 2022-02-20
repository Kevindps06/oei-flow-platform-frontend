import { Router } from "express";
const router = Router();

// /api/forms/coordinacionlogistica/flow

import * as formsCoordinacionLogisticaFlowController from "../../../../controllers/forms/coordinacionlogistica/flow/forms.coordinacionlogistica.flow.controller";

router.post("/", formsCoordinacionLogisticaFlowController.post);

export default router;
