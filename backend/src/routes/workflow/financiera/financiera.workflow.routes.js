import { Router } from "express";
const router = Router();

// /api/workflow/financiera/inflateFlowSteps

import * as workflowFinancieraController from "../../../controllers/workflow/financiera/financiera.workflow.controller"

router.post("/inflateFlowSteps", workflowFinancieraController.inflateFlowSteps);

export default router;