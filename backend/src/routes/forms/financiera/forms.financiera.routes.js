import { Router } from "express";
const router = Router();

// api/forms/financiera/invoices

import invoiceRoutes from "./invoice/forms.financiera.invoice.routes";

router.use("/invoices", invoiceRoutes);

export default router