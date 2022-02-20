import { Router } from "express";
const router = Router();

// /api/files

import * as filesController from "../../controllers/files/files.controller";

router.post("/", filesController.uploadFile);

export default router