const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const nodemailer = require("nodemailer");
const utils = require("./utils/utils");
const FinancieraFlow = require("./schemas/configuration/FinancieraFlow");
const CoordinacionLogisticaFlow = require("./schemas/configuration/CoordinacionLogisticaFlow");

// FinancieraFlow

router.post("/configuration/financieraflow", async (req, res) => {
  try {
    const financieraFlow = new FinancieraFlow(req.body);

    await financieraFlow.save();

    res.status(201).json(financieraFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/configuration/financieraflow", async (req, res) => {
  try {
    const financieraFlow = await FinancieraFlow.find(
      utils.financieraFlowObjectWithoutUndefined(
        req.query._id,
        req.query.persona,
        req.query.relacion,
        req.query.gestion,
        req.query.legalizacion,
        req.query.steps
      )
    );

    res.status(200).json(financieraFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/configuration/financieraflow", async (req, res) => {
  try {
    const financieraFlow = await FinancieraFlow.updateMany(
      utils.financieraFlowObjectWithoutUndefined(
        req.query._id,
        req.query.persona,
        req.query.relacion,
        req.query.gestion,
        req.query.legalizacion,
        req.query.steps
      ),
      req.body
    );

    res.status(200).json(financieraFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/configuration/financieraflow", async (req, res) => {
  try {
    const financieraFlow = await FinancieraFlow.deleteMany(
      utils.financieraFlowObjectWithoutUndefined(
        req.query._id,
        req.query.persona,
        req.query.relacion,
        req.query.gestion,
        req.query.legalizacion,
        req.query.steps
      )
    );

    res.status(200).json(financieraFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CoordinacionLogisticaFlow

router.post("/configuration/coordinacionlogisticaflow", async (req, res) => {
  try {
    const coordinacionLogisticaFlow = new CoordinacionLogisticaFlow(req.body);

    await coordinacionLogisticaFlow.save();

    res.status(201).json(coordinacionLogisticaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/configuration/coordinacionlogisticaflow", async (req, res) => {
  try {
    const coordinacionLogisticaFlow = await CoordinacionLogisticaFlow.find(
      utils.coordinacionLogisticaFlowObjectWithoutUndefined(
        req.query._id,
        req.query.steps
      )
    );

    res.status(200).json(coordinacionLogisticaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/configuration/coordinacionlogisticaflow", async (req, res) => {
  try {
    const coordinacionLogisticaFlow =
      await CoordinacionLogisticaFlow.updateMany(
        utils.coordinacionLogisticaFlowObjectWithoutUndefined(
          req.query._id,
          req.query.steps
        ),
        req.body
      );

    res.status(200).json(coordinacionLogisticaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/configuration/coordinacionlogisticaflow", async (req, res) => {
  try {
    const coordinacionLogisticaFlow =
      await CoordinacionLogisticaFlow.deleteMany(
        utils.coordinacionLogisticaFlowObjectWithoutUndefined(
          req.query._id,
          req.query.steps
        )
      );

    res.status(200).json(coordinacionLogisticaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/request", async (req, res) => {
  var response;
  try {
    response = await utils.uploadFileToSharePointWorkflowOEI(
      `/${req.body.filename}`,
      req.body.bytes
    );

    res.status(response.status).json(response.data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/convenios", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);

  let query = `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items?$select=id&$expand=fields($select=Aliado,Numero,Mostrar)`;

  if (!req.query.showAll) {
    query = query.concat("&filter=fields/Mostrar eq 1");
  }

  const response = await axios.default.get(query, {
    headers: {
      Authorization: "Bearer " + authResponse.accessToken,
      Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
    },
  });

  res.status(response.status).json(response.data);
});

router.get("/sites/:siteName", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/oei1.sharepoint.com:/sites/${req.params.siteName}`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
});

router.get("/sites/:siteId/lists", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );
  res.status(response.status).json(response.data);
});

router.get("/sites/:siteId/lists/:listId/items/:itemId", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists/${req.params.listId}/items/${req.params.itemId}`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );
  res.status(response.status).json(response.data);
});

router.get("/sites/:siteId/lists/:listId/:operation", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists/${req.params.listId}/${req.params.operation}`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
});

router.get("/workflow/validateUser", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONTRATISTASPROVEEDORES_LIST_ID}/items?$select=id,fields&$expand=fields&$filter=fields/Tipo_x0020_de_x0020_persona eq '${req.query.tipoDePersona}' and fields/Tipo_x0020_de_x0020_relacion eq '${req.query.tipoDeRelacion}' and fields/CC_x002f_NIT eq '${req.query.identification}' and fields/Emaildecontacto eq '${req.query.email}'`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      },
    }
  );

  if (response.data.value.length > 0) {
    /*let transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: "soportecontable@contratista.oei.org.co",
        pass: "Oei2018*",
      },
    });

    transporter
      .sendMail({
        from: "soportecontable@contratista.oei.org.co",
        to: "kevindps@jjk.com.co",
        subject: "Hello ✔",
        text: `Hello world? ${generatedCode}`,
      })
      .catch((err) => {
        res.status(404).json(err);
      });*/

    var generatedCode = utils.makeRandomString(4);

    res
      .status(response.status)
      .json({ userInfo: response.data, generatedCode: generatedCode });
  } else {
    res.status(404).send();
  }
});

router.get("/platform/validateUser", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${process.env.WORKFLOW_OEI_SITE_ID}/lists/${process.env.WORKFLOW_OEI_SITE_USERINFORMATION_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/EMail eq '${req.query.email}'`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      },
    }
  );

  if (response.data.value.length > 0) {
    const authResponse2 = await auth.getToken(auth.tokenRequest);
    const response2 = await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.WORKFLOW_OEI_SITE_ID}/lists/${process.env.WORKFLOW_OEI_SITE_PLATFORMUSERS_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/UserLookupId eq '${response.data.value[0].id}' and fields/Password eq '${req.query.password}'`,
      {
        headers: {
          Authorization: "Bearer " + authResponse2.accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
      }
    );

    if (response2.data.value.length > 0) {
      convenios = [];
      for (
        let i = 0;
        response2.data.value[0].fields.Convenios.length > i;
        i++
      ) {
        if (response2.data.value[0].fields.Convenios[i] !== undefined) {
          const authResponse3 = await auth.getToken(auth.tokenRequest);
          const response3 = await axios.default.get(
            `https://graph.microsoft.com/v1.0/sites/${process.env.WORKFLOW_OEI_SITE_ID}/lists/${process.env.WORKFLOW_OEI_SITE_CONVENIOS_LIST_ID}/items/${response2.data.value[0].fields.Convenios[i].LookupId}?$select=id&$expand=fields`,
            {
              headers: {
                Authorization: "Bearer " + authResponse3.accessToken,
                Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
              },
            }
          );

          convenios.push(response3.data);
        }
      }
      response2.data.value[0].fields.Convenios = convenios;

      res.status(response2.status).json({ userInfo: response2.data.value[0] });
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
});

router.post("/forms/financiera/registration", async (req, res) => {
  let formsFinancieraRegistration = {
    ID: req.body.Id,
    "Tipo de persona": req.body.TipoPersona,
    "Tipo de relacion": req.body.TipoRelacion,
    "Tipo de soporte contable": req.body.TipoSoporteContable,
    Email: req.body.Email,
    Convenio: req.body.Convenio,
    Nombre: req.body.Nombre,
  };

  if (req.body.TipoPersona === "Natural") {
    formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
      "Numero de cedula de ciudadania": req.body.Identificator,
      RUT: req.body["RutFiles"],
      Cedula: req.body["CedulaFiles"],
      "Certificacion bancaria": req.body["CertificacionBancariaFiles"],
    });
  } else {
    formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
      "NIT (Con digito de verificacion y previamente registrado) Ej. 890507890-4":
        req.body.Identificator,
      RUT: req.body["RutFiles"],
      "Cedula representante legal": req.body["CedulaFiles"],
      "Certificacion bancaria": req.body["CertificacionBancariaFiles"],
    });
  }

  formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
    "Informacion adicional": req.body.InformacionAdicional,
    Keys: Object.keys(formsFinancieraRegistration),
  });

  const response = await axios.default.post(
    `https://prod-15.brazilsouth.logic.azure.com:443/workflows/471cd993ba91453e93291e330c7cd3f1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V-oDrteENSvLDPqKbeK9ZWNjjBkS3_d0m5vOxTe_S1c`,
    [formsFinancieraRegistration]
  );

  res.status(response.status).json(response.data);
});

router.post("/forms/financiera/invoice", async (req, res) => {
  res.status(201).send();

  let configuration = [];

  /*let steps = (
    await axios.default.get(
      `http://35.171.49.111/api/configuration/financieraflow`,
      {
        params: {
          persona: req.body.TipoPersona,
          relacion: req.body.TipoRelacion,
          gestion: req.body.TipoGestion,
          legalizacion: req.body.TipoLegalizacion,
        },
      }
    )
  ).data[0].steps;*/

  let steps = (
    await FinancieraFlow.find(
      utils.financieraFlowObjectWithoutUndefined(
        req.query._id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.steps
      )
    )
  )[0].steps;

  const authResponseConvenio = await auth.getToken(auth.tokenRequest);
  const convenio = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items`,
      {
        headers: {
          Authorization: "Bearer " + authResponseConvenio.accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
        params: {
          $select: "id",
          $expand: "fields",
          $filter: `fields/Numero eq '${req.body.Convenio}'`,
        },
      }
    )
  ).data.value[0].fields;

  for (let i = 0; steps.length > i; i++) {
    if (
      steps[i].doWhen &&
      steps[i].doWhen.length > 0 &&
      steps[i].doWhen.findIndex((x) => x.convenio === req.body.Convenio) === -1
    ) {
      continue;
    }

    const exception = steps[i].exceptions?.find(
      (x) => x.convenio === req.body.Convenio
    );

    const authResponseEncargado = await auth.getToken(auth.tokenRequest);
    const encargado = (
      await axios.default.get(
        `https://graph.microsoft.com/v1.0/sites/${
          process.env.FINANCIERA_OEI_SITE_ID
        }/lists/${
          process.env.FINANCIERA_OEI_SITE_USERINFORMATION_LIST_ID
        }/items/${
          convenio[steps[i].key][exception ? exception.encargado : 0].LookupId
        }`,
        {
          headers: {
            Authorization: "Bearer " + authResponseEncargado.accessToken,
            Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
          },
          params: {
            $select: "id",
            $expand: "fields",
          },
        }
      )
    ).data.fields;

    steps[i].encargado = encargado;

    configuration.push(steps[i]);
  }

  const gestionPath = `/Gestion/${req.body.TipoPersona}/${req.body.TipoRelacion}/${req.body.TipoGestion}/${req.body.Id}`;

  let formsFinancieraInvoice =
    utils.formsFinancieraInvoiceObjectWithoutUndefined(
      req.body.Id,
      req.body.TipoPersona,
      req.body.TipoRelacion,
      req.body.Identificator,
      req.body.Email,
      req.body.TipoGestion,
      req.body.TipoLegalizacion,
      req.body.Convenio,
      req.body.InformacionAdicional,
      configuration,
      gestionPath
    );

  if (req.body.TipoPersona === "Natural") {
    switch (req.body.TipoGestion) {
      case "Cuenta de cobro":
        var cuentaCobroFilesPromises = [];
        for (let i = 0; req.body.CuentaCobroFiles.length > i; i++) {
          cuentaCobroFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Cuenta de cobro/${i}. ${req.body.CuentaCobroFiles[i].Name}`,
              req.body.CuentaCobroFiles[i].Bytes
            )
          );
        }

        var facturaEquivalenteFilesPromises = [];
        for (let i = 0; req.body.FacturaEquivalenteFiles.length > i; i++) {
          facturaEquivalenteFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Factura equivalente/${i}. ${req.body.FacturaEquivalenteFiles[i].Name}`,
              req.body.FacturaEquivalenteFiles[i].Bytes
            )
          );
        }

        var seguridadSocialFilesPromises = [];
        for (let i = 0; req.body.SeguridadSocialFiles.length > i; i++) {
          seguridadSocialFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Seguridad Social/${i}. ${req.body.SeguridadSocialFiles[i].Name}`,
              req.body.SeguridadSocialFiles[i].Bytes
            )
          );
        }

        var informeActividadesFilesPromises = [];
        for (let i = 0; req.body.InformeActividadesFiles.length > i; i++) {
          informeActividadesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Informe de actividades/${i}. ${req.body.InformeActividadesFiles[i].Name}`,
              req.body.InformeActividadesFiles[i].Bytes
            )
          );
        }

        var promiseResponses = await Promise.all([
          ...cuentaCobroFilesPromises,
          ...facturaEquivalenteFilesPromises,
          ...seguridadSocialFilesPromises,
          ...informeActividadesFilesPromises,
        ]);

        CuentaCobroSharePointFiles = [];
        FacturaEquivalenteSharePointFiles = [];
        SeguridadSocialSharePointFiles = [];
        InformeActividadesSharePointFiles = [];

        var promiseResponsesOffSet = 0;
        for (
          let i = promiseResponsesOffSet;
          cuentaCobroFilesPromises.length > i;
          i++
        ) {
          CuentaCobroSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + cuentaCobroFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length > i;
          i++
        ) {
          FacturaEquivalenteSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + seguridadSocialFilesPromises.length > i;
          i++
        ) {
          SeguridadSocialSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + seguridadSocialFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + informeActividadesFilesPromises.length > i;
          i++
        ) {
          InformeActividadesSharePointFiles.push(promiseResponses[i].data);
        }

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro",
              Files: CuentaCobroSharePointFiles,
            },
            {
              Name: "Factura equivalente",
              Files: FacturaEquivalenteSharePointFiles,
            },
            {
              Name: "Seguridad social",
              Files: SeguridadSocialSharePointFiles,
            },
            {
              Name: "Informe de actividades",
              Files: InformeActividadesSharePointFiles,
            },
          ],
        });
        break;
      case "Anticipo":
        var formatoSolicitudAvancesFilesPromises = [];
        for (let i = 0; req.body.FormatoSolicitudAvancesFiles.length > i; i++) {
          formatoSolicitudAvancesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Formato de solicitud de avances/${i}. ${req.body.FormatoSolicitudAvancesFiles[i].Name}`,
              req.body.FormatoSolicitudAvancesFiles[i].Bytes
            )
          );
        }

        var cotizacionesFilesPromises = [];
        for (let i = 0; req.body.CotizacionesFiles.length > i; i++) {
          cotizacionesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Cotizaciones/${i}. ${req.body.CotizacionesFiles[i].Name}`,
              req.body.CotizacionesFiles[i].Bytes
            )
          );
        }

        var solicitudesComisionFilesPromises = [];
        for (let i = 0; req.body.SolicitudesComisionFiles.length > i; i++) {
          solicitudesComisionFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Solicitudes de comision/${i}. ${req.body.SolicitudesComisionFiles[i].Name}`,
              req.body.SolicitudesComisionFiles[i].Bytes
            )
          );
        }

        var promiseResponses = await Promise.all([
          ...formatoSolicitudAvancesFilesPromises,
          ...cotizacionesFilesPromises,
          ...solicitudesComisionFilesPromises,
        ]);

        FormatoSolicitudAvancesSharePointFiles = [];
        CotizacionesSharePointFiles = [];
        SolicitudesComisionSharePointFiles = [];

        var promiseResponsesOffSet = 0;
        for (
          let i = promiseResponsesOffSet;
          formatoSolicitudAvancesFilesPromises.length > i;
          i++
        ) {
          FormatoSolicitudAvancesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + formatoSolicitudAvancesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + cotizacionesFilesPromises.length > i;
          i++
        ) {
          CotizacionesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + cotizacionesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + solicitudesComisionFilesPromises.length > i;
          i++
        ) {
          SolicitudesComisionSharePointFiles.push(promiseResponses[i].data);
        }

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de avances",
              Files: FormatoSolicitudAvancesSharePointFiles,
            },
            {
              Name: "Cotizaciones",
              Files: CotizacionesSharePointFiles,
            },
            {
              Name: "Solicitudes de comision",
              Files: SolicitudesComisionSharePointFiles,
            },
          ],
        });
        break;
      case "Dieta":
        var formatoSolicitudViajesFilesPromises = [];
        for (let i = 0; req.body.FormatoSolicitudViajes.length > i; i++) {
          formatoSolicitudViajesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Dieta/${i}. ${req.body.FormatoSolicitudViajes[i].Name}`,
              req.body.FormatoSolicitudViajes[i].Bytes
            )
          );
        }

        var promiseResponses = await Promise.all(
          formatoSolicitudViajesFilesPromises
        );

        FormatoSolicitudViajesSharePointFiles = [];

        var promiseResponsesOffSet = 0;
        for (
          let i = promiseResponsesOffSet;
          formatoSolicitudViajesFilesPromises.length > i;
          i++
        ) {
          FormatoSolicitudViajesSharePointFiles.push(promiseResponses[i].data);
        }

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de viajes",
              Files: FormatoSolicitudViajesSharePointFiles,
            },
          ],
        });
        break;
    }
  } else {
    switch (req.body.TipoSoporteContable) {
      case "Cuenta de cobro":
        var cuentaCobroFilesPromises = [];
        for (let i = 0; req.body.CuentaCobroFiles.length > i; i++) {
          cuentaCobroFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Cuenta de cobro o factura/${i}. ${req.body.CuentaCobroFiles[i].Name}`,
              req.body.CuentaCobroFiles[i].Bytes
            )
          );
        }

        var facturaEquivalenteFilesPromises = [];
        for (let i = 0; req.body.FacturaEquivalenteFiles.length > i; i++) {
          facturaEquivalenteFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Factura equivalente/${i}. ${req.body.FacturaEquivalenteFiles[i].Name}`,
              req.body.FacturaEquivalenteFiles[i].Bytes
            )
          );
        }

        var certificadoParafiscalesFilesPromises = [];
        for (let i = 0; req.body.CertificadoParafiscalesFiles.length > i; i++) {
          certificadoParafiscalesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Certificado de parafiscales/${i}. ${req.body.CertificadoParafiscalesFiles[i].Name}`,
              req.body.CertificadoParafiscalesFiles[i].Bytes
            )
          );
        }

        var informeActividadesFilesPromises = [];
        for (let i = 0; req.body.InformeActividadesFiles.length > i; i++) {
          informeActividadesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Informe de actividades/${i}. ${req.body.InformeActividadesFiles[i].Name}`,
              req.body.InformeActividadesFiles[i].Bytes
            )
          );
        }

        var promiseResponses = await Promise.all([
          ...cuentaCobroFilesPromises,
          ...facturaEquivalenteFilesPromises,
          ...certificadoParafiscalesFilesPromises,
          ...informeActividadesFilesPromises,
        ]);

        CuentaCobroSharePointFiles = [];
        FacturaEquivalenteSharePointFiles = [];
        CertificadoParafiscalesSharePointFiles = [];
        InformeActividadesSharePointFiles = [];

        var promiseResponsesOffSet = 0;
        for (
          let i = promiseResponsesOffSet;
          cuentaCobroFilesPromises.length > i;
          i++
        ) {
          CuentaCobroSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + cuentaCobroFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length > i;
          i++
        ) {
          FacturaEquivalenteSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + certificadoParafiscalesFilesPromises.length >
          i;
          i++
        ) {
          CertificadoParafiscalesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + certificadoParafiscalesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + informeActividadesFilesPromises.length > i;
          i++
        ) {
          InformeActividadesSharePointFiles.push(promiseResponses[i].data);
        }

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro",
              Files: CuentaCobroSharePointFiles,
            },
            {
              Name: "Factura equivalente",
              Files: FacturaEquivalenteSharePointFiles,
            },
            {
              Name: "Certificado de parafiscales",
              Files: CertificadoParafiscalesSharePointFiles,
            },
            {
              Name: "Informe de actividades",
              Files: InformeActividadesSharePointFiles,
            },
          ],
        });
        break;
      case "Anticipo":
        var camaraComercioFilesPromises = [];
        for (let i = 0; req.body.CamaraComercioFiles.length > i; i++) {
          camaraComercioFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Camara de comercio/${i}. ${req.body.CamaraComercioFiles[i].Name}`,
              req.body.CamaraComercioFiles[i].Bytes
            )
          );
        }

        var formatoSolicitudAvancesFilesPromises = [];
        for (let i = 0; req.body.FormatoSolicitudAvancesFiles.length > i; i++) {
          formatoSolicitudAvancesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Formato de solicitud de avances/${i}. ${req.body.FormatoSolicitudAvancesFiles[i].Name}`,
              req.body.FormatoSolicitudAvancesFiles[i].Bytes
            )
          );
        }

        var cotizacionesFilesPromises = [];
        for (let i = 0; req.body.CotizacionesFiles.length > i; i++) {
          cotizacionesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Cotizaciones/${i}. ${req.body.CotizacionesFiles[i].Name}`,
              req.body.CotizacionesFiles[i].Bytes
            )
          );
        }

        var solicitudesComisionFilesPromises = [];
        for (let i = 0; req.body.SolicitudesComisionFiles.length > i; i++) {
          solicitudesComisionFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/Solicitudes de comision/${i}. ${req.body.SolicitudesComisionFiles[i].Name}`,
              req.body.SolicitudesComisionFiles[i].Bytes
            )
          );
        }

        var promiseResponses = await Promise.all([
          ...camaraComercioFilesPromises,
          ...formatoSolicitudAvancesFilesPromises,
          ...cotizacionesFilesPromises,
          ...solicitudesComisionFilesPromises,
        ]);

        CamaraComercioSharePointFiles = [];
        FormatoSolicitudAvancesSharePointFiles = [];
        CotizacionesSharePointFiles = [];
        SolicitudesComisionSharePointFiles = [];

        var promiseResponsesOffSet = 0;
        for (
          let i = promiseResponsesOffSet;
          camaraComercioFilesPromises.length > i;
          i++
        ) {
          CamaraComercioSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + camaraComercioFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + formatoSolicitudAvancesFilesPromises.length >
          i;
          i++
        ) {
          FormatoSolicitudAvancesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + formatoSolicitudAvancesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + cotizacionesFilesPromises.length > i;
          i++
        ) {
          CotizacionesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + cotizacionesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + solicitudesComisionFilesPromises.length > i;
          i++
        ) {
          SolicitudesComisionSharePointFiles.push(promiseResponses[i].data);
        }

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Camara de comercio",
              Files: CamaraComercioSharePointFiles,
            },
            {
              Name: "Formato de solicitud de avances",
              Files: FormatoSolicitudAvancesSharePointFiles,
            },
            {
              Name: "Cotizaciones",
              Files: CotizacionesSharePointFiles,
            },
            {
              Name: "Solicitudes de comision",
              Files: SolicitudesComisionSharePointFiles,
            },
          ],
        });
        break;
    }
  }

  formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
    Keys: Object.keys(formsFinancieraInvoice),
  });

  while (true) {
    try {
      await axios.default.post(
        `https://prod-15.brazilsouth.logic.azure.com:443/workflows/471cd993ba91453e93291e330c7cd3f1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V-oDrteENSvLDPqKbeK9ZWNjjBkS3_d0m5vOxTe_S1c`,
        [formsFinancieraInvoice]
      );

      break;
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/forms/coordinacionlogistica", async (req, res) => {
  res.status(201).send();

  let configuration = [];

  /*let steps = (
    await axios.default.get(
      `http://35.171.49.111/api/configuration/coordinacionlogisticaflow`,
      {
        params: {},
      }
    )
  ).data[0].steps;*/

  let steps = (
    await CoordinacionLogisticaFlow.find(
      utils.coordinacionLogisticaFlowObjectWithoutUndefined(
        req.query._id,
        req.query.steps
      )
    )
  )[0].steps;

  const authResponseConvenio = await auth.getToken(auth.tokenRequest);
  const convenio = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items`,
      {
        headers: {
          Authorization: "Bearer " + authResponseConvenio.accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
        params: {
          $select: "id",
          $expand: "fields",
          $filter: `fields/Numero eq '${req.body.Convenio}'`,
        },
      }
    )
  ).data.value[0].fields;

  for (let i = 0; steps.length > i; i++) {
    if (
      steps[i].doWhen &&
      steps[i].doWhen.length > 0 &&
      steps[i].doWhen.findIndex((x) => x.convenio === req.body.Convenio) === -1
    ) {
      continue;
    }

    const exception = steps[i].exceptions?.find(
      (x) => x.convenio === req.body.Convenio
    );

    const authResponseEncargado = await auth.getToken(auth.tokenRequest);
    const encargado = (
      await axios.default.get(
        `https://graph.microsoft.com/v1.0/sites/${
          process.env.FINANCIERA_OEI_SITE_ID
        }/lists/${
          process.env.FINANCIERA_OEI_SITE_USERINFORMATION_LIST_ID
        }/items/${
          convenio[steps[i].key][exception ? exception.encargado : 0].LookupId
        }`,
        {
          headers: {
            Authorization: "Bearer " + authResponseEncargado.accessToken,
            Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
          },
          params: {
            $select: "id",
            $expand: "fields",
          },
        }
      )
    ).data.fields;

    steps[i].encargado = encargado;

    configuration.push(steps[i]);
  }

  const coordinacionLogisticaPath = `/Coordinacion Logistica/${req.body.Id}`;

  let formsCoordinacionLogistica =
    utils.formsCoordinacionLogisticaObjectWithoutUndefined(
      req.body.Id,
      req.body.Nombre,
      req.body.Convenio,
      req.body.Ida,
      req.body.Vuelta,
      req.body.Identificator,
      req.body.EquipajeAdicional,
      req.body.Email,
      req.body.InformacionAdicional,
      configuration,
      coordinacionLogisticaPath
    );

  var pasaporteFilesPromises = [];
  for (let i = 0; req.body.PasaporteFiles.length > i; i++) {
    pasaporteFilesPromises.push(
      utils.uploadFileToSharePointWorkflowOEI(
        `${coordinacionLogisticaPath}/Pasaporte/${i}. ${req.body.PasaporteFiles[i].Name}`,
        req.body.PasaporteFiles[i].Bytes
      )
    );
  }

  var promiseResponses = await Promise.all([...pasaporteFilesPromises]);

  PasaporteSharePointFiles = [];

  var promiseResponsesOffSet = 0;
  for (let i = promiseResponsesOffSet; pasaporteFilesPromises.length > i; i++) {
    PasaporteSharePointFiles.push(promiseResponses[i].data);
  }

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    SharePointFiles: [
      {
        Name: "Pasaporte",
        Files: PasaporteSharePointFiles,
      },
    ],
  });

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    Keys: Object.keys(formsCoordinacionLogistica),
  });

  while (true) {
    try {
      await axios.default.post(
        `https://prod-10.brazilsouth.logic.azure.com:443/workflows/d9284b8deff34c34b78c7309cbeb0f45/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xt5QdZEYOiWUAmAfu-ykUU1oMDBm2bKT9yUBS0k63sw`,
        [formsCoordinacionLogistica]
      );

      break;
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
