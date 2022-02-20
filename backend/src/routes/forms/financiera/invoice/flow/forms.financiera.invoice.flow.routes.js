import { Router } from "express";
const router = Router();

// /api/forms/financiera/invoice/flow

import * as formsFinancieraInvoiceFlowController from "../../../../../controllers/forms/financiera/invoice/flow/forms.financiera.invoice.flow.controller"

router.post("/", formsFinancieraInvoiceFlowController.post);

export default router