import { Router } from "express";
const router = Router();

// /api/information/airport

import airportRoutes from "./airport/informacion.airport.routes"

router.use("/airport", airportRoutes);

export default router