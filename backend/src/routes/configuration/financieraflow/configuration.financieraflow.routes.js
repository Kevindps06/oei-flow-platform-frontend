import { Router } from "express";
const router = Router();

// API - Configuration - FinancieraFlow

import * as configurationFinancieraFlowController from "../../../controllers/configuration/financieraflow/configuration.financieraflow.controller";

router.post("/", configurationFinancieraFlowController.save);

router.get("/", configurationFinancieraFlowController.find);

router.put("/", configurationFinancieraFlowController.updateMany);

router.delete("/", configurationFinancieraFlowController.deleteMany);

export default router