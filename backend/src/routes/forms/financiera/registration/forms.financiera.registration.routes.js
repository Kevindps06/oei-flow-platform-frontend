import { Router } from "express";
const router = Router();

// /api/forms/financiera/registration

import * as formsFinancieraRegistrationController from "../../../../controllers/forms/financiera/registration/forms.financiera.registration.controller";

router.post("/", formsFinancieraRegistrationController.post);

export default router