import { Router } from "express";
const router = Router();

import * as formsFinancieraInvoiceController from "../../../../controllers/forms/financiera/forms.financiera.invoice.controller"

// Forms - Financiera - Invoice

router.post("/", formsFinancieraInvoiceController.save());

router.get("/", formsFinancieraInvoiceController.find());

router.put("/", formsFinancieraInvoiceController.updateMany());

router.delete("/", formsFinancieraInvoiceController.deleteMany());

export default router