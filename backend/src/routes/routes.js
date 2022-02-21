import axios from "axios";
import { getToken, tokenRequest } from "../apis/microsoft/auth";
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

router.get("/workflow/validateUser", async (req, res) => {
  const contratistaProveedorResponse = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONTRATISTASPROVEEDORES_LIST_ID}/items`,
      {
        headers: {
          Authorization: "Bearer " + (await getToken(tokenRequest)).accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
        params: {
          $select: "id",
          $expand: "fields",
          $filter: `fields/Tipo_x0020_de_x0020_persona eq '${req.query.tipoPersona}' and fields/Tipo_x0020_de_x0020_relacion eq '${req.query.tipoRelacion}' and fields/CC_x002f_NIT eq '${req.query.identificator}'`,
          $orderby: "fields/Created desc",
          $top: 1,
        },
      }
    )
  ).data.value[0];

  if (contratistaProveedorResponse) {
    delete contratistaProveedorResponse["@odata.etag"];
    delete contratistaProveedorResponse["fields@odata.context"];
    delete contratistaProveedorResponse.fields["@odata.etag"];

    res.status(200).json({
      userInfo: contratistaProveedorResponse,
    });
  } else {
    res.status(404).send();
  }
});

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

router.get("/platform/validateUser", async (req, res) => {
  const userInformationResponse = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_USERINFORMATION_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/EMail eq '${req.query.email}'`,
      {
        headers: {
          Authorization:
            "Bearer " + (await auth.getToken(auth.tokenRequest)).accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
      }
    )
  ).data.value[0];

  delete userInformationResponse["@odata.etag"];
  delete userInformationResponse["fields@odata.context"];
  delete userInformationResponse.fields["@odata.etag"];

  const platformUserInformationResponse = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_PLATFORMUSERS_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/UserLookupId eq '${userInformationResponse.id}' and fields/Password eq '${req.query.password}'`,
      {
        headers: {
          Authorization:
            "Bearer " + (await auth.getToken(auth.tokenRequest)).accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
      }
    )
  ).data.value[0];

  delete platformUserInformationResponse["@odata.etag"];
  delete platformUserInformationResponse["fields@odata.context"];
  delete platformUserInformationResponse.fields["@odata.etag"];

  convenios = [];

  for (
    let i = 0;
    platformUserInformationResponse.fields.Convenios.length > i;
    i++
  ) {
    if (platformUserInformationResponse.fields.Convenios[i]) {
      const convenioInformationResponse = (
        await axios.default.get(
          `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items/${platformUserInformationResponse.fields.Convenios[i].LookupId}?$select=id&$expand=fields`,
          {
            headers: {
              Authorization:
                "Bearer " +
                (
                  await auth.getToken(auth.tokenRequest)
                ).accessToken,
              Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
            },
          }
        )
      ).data;

      delete convenioInformationResponse["@odata.context"];
      delete convenioInformationResponse["fields@odata.context"];
      delete convenioInformationResponse.fields["@odata.etag"];

      convenios.push(convenioInformationResponse);
    }
  }

  platformUserInformationResponse.fields.Convenios = convenios;

  res.status(200).json({
    userInfo: userInformationResponse,
    plaftformInfo: platformUserInformationResponse,
  });
});

export default router;
