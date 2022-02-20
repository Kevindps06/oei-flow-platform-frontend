import { Router } from "express";
const router = Router();

// api/forms/coordinacionlogistica

import * as formsCoordinacionLogisticaController from "../../../controllers/forms/coordinacionlogistica/forms.coordinacionlogistica.controller";

router.post("/", formsCoordinacionLogisticaController.save);

router.get("/", formsCoordinacionLogisticaController.find);

router.put("/", formsCoordinacionLogisticaController.updateMany);

router.delete("/", formsCoordinacionLogisticaController.deleteMany);

// api/forms/coordinacionlogistica/flow

import formsCoordinacionLogisticaFlowRoutes from "./flow/forms.coordinacionlogistica.flow.routes";

router.use("/flow", formsCoordinacionLogisticaFlowRoutes);

export default router;
