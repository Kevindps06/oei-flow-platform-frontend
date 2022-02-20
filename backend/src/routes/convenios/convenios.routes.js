import { Router } from "express";
const router = Router();

// /api/convenios

import * as conveniosController from "../../controllers/convenios/convenios.controller";

router.get("/", conveniosController.get);

export default router;
