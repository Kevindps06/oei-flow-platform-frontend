import { Router } from "express";
const router = Router();

// /api/sharepoint/sites

import sharepointSitesRoutes from "./sites/sharepoint.sites.routes";

router.use("/sites", sharepointSitesRoutes);

export default router