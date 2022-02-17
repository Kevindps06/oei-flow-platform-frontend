import { Router } from "express";
const router = Router();

// API - Configuration - FinancieraFlow

import financieraFlowRoutes from "./financieraflow/configuration.financieraflow.routes"

router.use("/financieraflow", financieraFlowRoutes);

// API - Configuration - CoordinacionLogisticaFlow

import coordinacionLogisticaFlowRoutes from "./financieraflow/configuration.financieraflow.routes"

router.use("/coordinacionlogisticaflow", coordinacionLogisticaFlowRoutes);

export default router;
