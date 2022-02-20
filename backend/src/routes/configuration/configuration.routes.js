import { Router } from "express";
const router = Router();

// /api/configuration/financieraflow

import financieraFlowRoutes from "./financieraflow/configuration.financieraflow.routes"

router.use("/financieraflow", financieraFlowRoutes);

// /api/configuration/juridicaflow

import juridicaFlowRoutes from "./juridicaflow/configuration.juridicaflow.routes"

router.use("/juridicaflow", juridicaFlowRoutes);

// /api/configuration/coordinacionlogisticaflow

import coordinacionLogisticaFlowRoutes from "./financieraflow/configuration.financieraflow.routes"

router.use("/coordinacionlogisticaflow", coordinacionLogisticaFlowRoutes);

export default router;
