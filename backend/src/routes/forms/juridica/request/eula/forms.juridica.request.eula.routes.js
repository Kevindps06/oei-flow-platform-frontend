import { Router } from "express";
const router = Router();

// /api/forms/juridica/request/eula

import * as formsJuridicaRequestEulaController from "../../../../../controllers/forms/juridica/request/eula/forms.juridica.request.eula.controller";

router.post("/", formsJuridicaRequestEulaController.save);

router.get("/", formsJuridicaRequestEulaController.find);

router.put("/", formsJuridicaRequestEulaController.updateMany);

router.delete("/", formsJuridicaRequestEulaController.deleteMany);

// /api/forms/juridica/request/eula/requestverificationcode

router.post(
  "/requestverificationcode",
  formsJuridicaRequestEulaController.requestVerificationCode
);

// /api/forms/juridica/request/eula/verifyverificationcode

router.get(
  "/verifyverificationcode",
  formsJuridicaRequestEulaController.verifyVerificationCode
);

export default router;
