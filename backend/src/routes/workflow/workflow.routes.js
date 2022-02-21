import { Router } from "express";
const router = Router();

// api/workflow/financiera

import workflowFinancieraRoutes from "./financiera/financiera.workflow.routes";

router.use("/financiera", workflowFinancieraRoutes);

// api/workflow/juridica

import workflowJuridicaRoutes from "./juridica/juridica.workflow.routes";

router.use("/juridica", workflowJuridicaRoutes);

export default router;
