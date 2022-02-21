import { Router } from "express";
const router = Router();

// /api/workflow/juridica/inflateFlowSteps

import * as workflowJuridicaController from "../../../controllers/workflow/juridica/juridica.workflow.controller";

router.get("/inflateFlowSteps", workflowJuridicaController.inflateFlowSteps);

export default router;
