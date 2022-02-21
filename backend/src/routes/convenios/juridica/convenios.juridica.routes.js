import { Router } from "express";
const router = Router();

// /api/convenios/juridica

import * as conveniosJuridicaController from "../../../controllers/convenios/juridica/convenios.juridica.controller";

router.get("/", conveniosJuridicaController.get);

export default router;
