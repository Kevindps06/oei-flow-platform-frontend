import { Router } from "express";
const router = Router();

// api/forms/juridica/request

import formsJuridicaRequestRoutes from "./request/forms.juridica.request.routes";

router.use("/request", formsJuridicaRequestRoutes);

export default router;