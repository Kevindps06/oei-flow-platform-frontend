import { Router } from "express";
const router = Router();

// /api/convenios/financiera

import * as conveniosFinancieraController from "../../../controllers/convenios/financiera/convenios.financiera.controller";

router.get("/", conveniosFinancieraController.get);

export default router;
