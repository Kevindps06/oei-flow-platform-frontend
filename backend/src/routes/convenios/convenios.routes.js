import { Router } from "express";
const router = Router();

// /api/convenios/financiera

import conveniosFinancieraRoutes from "./financiera/convenios.financiera.routes";

router.use("/financiera", conveniosFinancieraRoutes);

// /api/convenios/juridica

import conveniosJuridicaRoutes from "./juridica/convenios.juridica.routes";

router.use("/juridica", conveniosJuridicaRoutes);

export default router;
