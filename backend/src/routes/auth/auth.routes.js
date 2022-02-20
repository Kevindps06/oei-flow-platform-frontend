import { Router } from "express";
const router = Router();

// /api/auth/client

import clientRoutes from "./client/auth.client.routes";

router.use("/client", clientRoutes);

export default router