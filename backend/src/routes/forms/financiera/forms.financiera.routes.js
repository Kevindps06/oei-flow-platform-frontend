import { Router } from "express";
const router = Router();

// api/forms/financiera/registration

import formsFinancieraRegistrationRoutes from "./registration/forms.financiera.registration.routes";

router.use("/registration", formsFinancieraRegistrationRoutes);

// api/forms/financiera/invoice

import formsFinancieraInvoiceRoutes from "./invoice/forms.financiera.invoice.routes";

router.use("/invoice", formsFinancieraInvoiceRoutes);

export default router