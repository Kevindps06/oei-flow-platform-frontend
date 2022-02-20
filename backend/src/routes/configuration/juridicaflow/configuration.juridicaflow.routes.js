import { Router } from "express";
const router = Router();

// /api/configuration/juridicaflow

import * as configurationJuridicaFlowController from "../../../controllers/configuration/juridicaflow/configuration.financieraflow.controller";

router.post("/", configurationJuridicaFlowController.save);

router.get("/", configurationJuridicaFlowController.find);

router.put("/", configurationJuridicaFlowController.updateMany);

router.delete("/", configurationJuridicaFlowController.deleteMany);

export default router;
