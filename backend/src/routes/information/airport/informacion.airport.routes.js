import { Router } from "express";
const router = Router();

// API - Information - Airport

import * as airportController from "../../../controllers/information/airport/information.airport.controller";

router.post("/", airportController.save);

router.get("/", airportController.find);

router.put("/", airportController.updateMany);

router.delete("/", airportController.deleteMany);

export default router;
