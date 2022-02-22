import { Router } from "express";
const router = Router();

import * as workflowFinancieraController from "../../../controllers/workflow/financiera/financiera.workflow.controller";

// /api/workflow/financiera/inflateFlowSteps

router.post("/inflateFlowSteps", workflowFinancieraController.inflateFlowSteps);

// /api/workflow/financiera/validateregistration

router.get(
  "/validateregistration",
  workflowFinancieraController.validateRegistration
);

export default router;
