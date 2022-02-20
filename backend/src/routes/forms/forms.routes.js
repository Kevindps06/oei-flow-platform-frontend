import { Router } from "express";
const router = Router();

// api/forms/financiera

import financieraRoutes from "./financiera/forms.financiera.routes";

router.use("/financiera", financieraRoutes);

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
