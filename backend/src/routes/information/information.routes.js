import { Router } from "express";
const router = Router();

// API - Information - Airport

import airportRoutes from "./airport/informacion.airport.routes"

router.use("/airport", airportRoutes);

export default router