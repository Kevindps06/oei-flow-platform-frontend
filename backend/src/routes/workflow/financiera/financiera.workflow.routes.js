import { Router } from "express";
const router = Router();

// /api/workflow/financiera/inflateFlowSteps

import * as workflowFInancieraController from "../../../controllers/workflow/financiera/financiera.workflow.controller"

router.get("/inflateFlowSteps", workflowFInancieraController);

export default router;