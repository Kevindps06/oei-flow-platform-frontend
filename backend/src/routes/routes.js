import {
  getConvenioFromSharePointById,
  inflateFlowStepsFinancieraOEI,
} from "../utils/utils";

import { Router } from "express";
const router = Router();

// /api/forms

import formsRoutes from "./forms/forms.routes";

router.use("/forms", formsRoutes);

// /api/files

import filesRoutes from "./files/files.routes";

router.use("/files", filesRoutes);

// /api/configuration

import configurationRoutes from "./configuration/configuration.routes";

router.use("/configuration", configurationRoutes);

// /api/information

import informationRoutes from "./information/information.routes";

router.use("/information", informationRoutes);

// /api/auth

import authRoutes from "./information/information.routes";

router.use("/auth", authRoutes);

// /api/convenios

import conveniosRoutes from "./convenios/convenios.routes";

router.use("/convenios", conveniosRoutes);

// /api/sharepoint

import sharepointRoutes from "./sharepoint/sharepoint.routes";

router.use("/sharepoint", sharepointRoutes);

// /api/workflow

import workflowRoutes from "./workflow/workflow.routes"

router.use("/workflow", workflowRoutes);

// Future!!

/* Deprecated delete in future release */
router.post("/workflow/inflateFlowSteps", async (req, res) => {
  let response = req.body;

  const convenio = await getConvenioFromSharePointById(
    req.body[0].ConvenioInformation.id
  );

  response[0].ConvenioInformation = convenio;

  response[0].Configuration = await inflateFlowStepsFinancieraOEI(
    req.body[0].Configuration,
    convenio
  );

  res.status(200).json(response);
});

/* Deprecated delete in future release */
router.post("/workflow/validateConvenio", async (req, res) => {
  let response = req.body;

  const convenio = await getConvenioFromSharePointById(
    req.body[0].ConvenioInformation.id
  );

  response[0].ConvenioInformation = convenio;

  response[0].Configuration = await inflateFlowStepsFinancieraOEI(
    req.body[0].Configuration,
    convenio
  );

  res.status(200).json(response);
});

export default router;
