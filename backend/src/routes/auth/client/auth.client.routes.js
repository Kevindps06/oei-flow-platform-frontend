import { Router } from "express";
const router = Router();

// /api/auth/client

import * as authClientController from "../../../controllers/auth/client/auth.client.controller";

router.post("/", authClientController.save);

router.get("/", authClientController.find);

router.put("/", authClientController.updateMany);

router.delete("/", authClientController.deleteMany);

export default router;
