import { Router } from "express";
const router = Router();

// /api/forms/juridica/request

import * as formsJuridicaRequestController from "../../../../controllers/forms/juridica/request/forms.juridica.request.controller";

router.post("/", formsJuridicaRequestController.save);

router.get("/", formsJuridicaRequestController.find);

router.put("/", formsJuridicaRequestController.updateMany);

router.delete("/", formsJuridicaRequestController.deleteMany);

// /api/forms/juridica/request/flow

import formsJuridicaRequestFlowRoutes from "./flow/forms.juridica.request.flow.routes";

router.use("/flow", formsJuridicaRequestFlowRoutes);

// /api/forms/juridica/request/minuta

import formsJuridicaRequestMinutaRoutes from "./minuta/forms.juridica.request.minuta.routes";

router.use("/minuta", formsJuridicaRequestMinutaRoutes);

// /api/forms/juridica/request/eula

import formsJuridicaRequestEulaRoutes from "./eula/forms.juridica.request.eula.routes";

router.use("/eula", formsJuridicaRequestEulaRoutes);

export default router;
