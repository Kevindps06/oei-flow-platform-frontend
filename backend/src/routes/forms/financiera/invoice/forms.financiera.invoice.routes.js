import { Router } from "express";
const router = Router();

// /api/forms/financiera/invoice

import * as formsFinancieraInvoiceController from "../../../../controllers/forms/financiera/invoice/forms.financiera.invoice.controller";

router.post("/", formsFinancieraInvoiceController.save);

router.get("/", formsFinancieraInvoiceController.find);

router.put("/", formsFinancieraInvoiceController.updateMany);

router.delete("/", formsFinancieraInvoiceController.deleteMany);

// /api/forms/financiera/invoice/flow

import formsFinancieraInvoiceFlowRoutes from "./flow/forms.financiera.invoice.flow.routes"

router.use("/flow", formsFinancieraInvoiceFlowRoutes);

export default router