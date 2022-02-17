import { Router } from "express";
const router = Router();

// API - Configuration - CoordinacionLogisticaFlow

import * as configurationCoordinacionLogisticaFlowController from "../../../controllers/configuration/coordinacionlogisticaflow/configuration.coordinacionlogisticaflow.controller";

router.post("/", configurationCoordinacionLogisticaFlowController.save);

router.get("/", configurationCoordinacionLogisticaFlowController.find);

router.put("/", configurationCoordinacionLogisticaFlowController.updateMany);

router.delete("/", configurationCoordinacionLogisticaFlowController.deleteMany);

export default router;
