import { Router } from "express";
const router = Router();

// /api/workflow/financiera/inflateFlowSteps

import * as workflowFinancieraController from "../../../controllers/workflow/financiera/financiera.workflow.controller"

router.get("/inflateFlowSteps", workflowFinancieraController.inflateFlowSteps);

export default router;