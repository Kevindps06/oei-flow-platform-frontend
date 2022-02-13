import { Router } from "express";
const router = Router();

// Forms - Financiera - Invoice

import invoiceRoutes from "./invoice/forms.financiera.invoice.routes";

router.use("/invoices", invoiceRoutes);

export default router