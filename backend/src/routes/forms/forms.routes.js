import { Router } from "express";
const router = Router();

// api/forms/financiera

import formsFinancieraRoutes from "./financiera/forms.financiera.routes";

router.use("/financiera", formsFinancieraRoutes);

// api/forms/juridica

import formsJuridicaRoutes from "./juridica/forms.juridica.routes";

router.use("/juridica", formsJuridicaRoutes);

// api/forms/certificadosingresosretenciones

import certificadosIngresosRetencionesRoutes from "./certificadosingresosretenciones/forms.certificadosingresosretenciones.routes";

router.use(
  "/certificadosingresosretenciones",
  certificadosIngresosRetencionesRoutes
);

// api/forms/coordinacionlogistica

import formsCoordinacionLogisticaRoutes from "./coordinacionlogistica/forms.coordinacionlogistica.routes"

router.use("/coordinacionlogistica", formsCoordinacionLogisticaRoutes);

export default router;
