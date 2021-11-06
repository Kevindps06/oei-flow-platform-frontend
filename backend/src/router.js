const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const nodemailer = require("nodemailer");
const utils = require("./utils/utils");
const Convenio = require("./schemas/information/Convenio");

router.post("/information/convenios", async (req, res) => {
  try {
    const convenio = new Convenio(req.body);

    await convenio.save();

    res.status(201).json(convenio);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/information/convenios", async (req, res) => {
  try {
    let convenios;

    try {
      /*convenios = await Convenio.find({
        aliado: req.query.aliado,
        numero: req.query.numero,
        administracion: req.query.administracion,
        gerencia: req.query.gerencia,
        direccionAdjunta: req.query.direccionAdjunta,
        asistenciaContable: req.query.asistenciaContable,
        tesoreriaDistribucion: req.query.tesoreriaDistribucion,
        tesoreria: req.query.tesoreria,
        tesoreriaConfirmacion: req.query.tesoreriaConfirmacion,
        direccionFinanciera: req.query.direccionFinanciera,
        enabled: req.query.enabled,
      });*/

      convenios = await Convenio.find({});
    } catch (err) {
      res.status(404).json(err);
      return
    }

    res.status(200).json(convenios);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/information/convenios", async (req, res) => {
  try {
    const convenio = await Convenio.updateMany({
      aliado: req.query.aliado,
      numero: req.query.numero,
      administracion: req.query.administracion,
      gerencia: req.query.gerencia,
      direccionAdjunta: req.query.direccionAdjunta,
      asistenciaContable: req.query.asistenciaContable,
      tesoreriaDistribucion: req.query.tesoreriaDistribucion,
      tesoreria: req.query.tesoreria,
      tesoreriaConfirmacion: req.query.tesoreriaConfirmacion,
      direccionFinanciera: req.query.direccionFinanciera,
      enabled: req.query.enabled,
    }, req.body);

    res.status(200).json(convenio);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/information/convenios", async (req, res) => {
  try {
    const convenio = await Convenio.remove({
      aliado: req.query.aliado,
      numero: req.query.numero,
      administracion: req.query.administracion,
      gerencia: req.query.gerencia,
      direccionAdjunta: req.query.direccionAdjunta,
      asistenciaContable: req.query.asistenciaContable,
      tesoreriaDistribucion: req.query.tesoreriaDistribucion,
      tesoreria: req.query.tesoreria,
      tesoreriaConfirmacion: req.query.tesoreriaConfirmacion,
      direccionFinanciera: req.query.direccionFinanciera,
      enabled: req.query.enabled,
    });

    res.status(200).json(convenio);
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
  let formsFinancieraInvoice = {
    Id: req.body.Id,
    TipoPersona: req.body.TipoPersona,
    TipoRelacion: req.body.TipoRelacion,
    Identificator: req.body.Identificator,
    Email: req.body.Email,
    TipoGestion: req.body.TipoGestion,
    TipoLegalizacion: req.body.TipoLegalizacion,
    Convenio: req.body.Convenio,
    InformacionAdicional: req.body.InformacionAdicional,
  };

  const gestionPath = `/Gestion/${req.body.TipoPersona}/${req.body.TipoRelacion}/${req.body.TipoGestion}`;

  if (req.body.TipoPersona === "Natural") {
    switch (req.body.TipoGestion) {
      case "Cuenta de cobro":
        var cuentaCobroFilesPromises = [];
        for (let i = 0; req.body.CuentaCobroFiles.length > i; i++) {
          cuentaCobroFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Cuenta de cobro/${i}. ${req.body.CuentaCobroFiles[i].Name}`,
              req.body.CuentaCobroFiles[i].Bytes
            )
          );
        }

        var facturaEquivalenteFilesPromises = [];
        for (let i = 0; req.body.FacturaEquivalenteFiles.length > i; i++) {
          facturaEquivalenteFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Factura equivalente/${i}. ${req.body.FacturaEquivalenteFiles[i].Name}`,
              req.body.FacturaEquivalenteFiles[i].Bytes
            )
          );
        }

        var seguridadSocialFilesPromises = [];
        for (let i = 0; req.body.SeguridadSocialFiles.length > i; i++) {
          seguridadSocialFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Seguridad Social/${i}. ${req.body.SeguridadSocialFiles[i].Name}`,
              req.body.SeguridadSocialFiles[i].Bytes
            )
          );
        }

        var informeActividadesFilesPromises = [];
        for (let i = 0; req.body.InformeActividadesFiles.length > i; i++) {
          informeActividadesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Informe de actividades/${i}. ${req.body.InformeActividadesFiles[i].Name}`,
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
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + facturaEquivalenteFilesPromises.length > i;
          i++
        ) {
          FacturaEquivalenteSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + seguridadSocialFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + seguridadSocialFilesPromises.length > i;
          i++
        ) {
          SeguridadSocialSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + informeActividadesFilesPromises.length;
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
              `${gestionPath}/${req.body.Id}/Formato de solicitud de avances/${i}. ${req.body.FormatoSolicitudAvancesFiles[i].Name}`,
              req.body.FormatoSolicitudAvancesFiles[i].Bytes
            )
          );
        }

        var cotizacionesFilesPromises = [];
        for (let i = 0; req.body.CotizacionesFiles.length > i; i++) {
          cotizacionesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Cotizaciones/${i}. ${req.body.CotizacionesFiles[i].Name}`,
              req.body.CotizacionesFiles[i].Bytes
            )
          );
        }

        var solicitudesComisionFilesPromises = [];
        for (let i = 0; req.body.SolicitudesComisionFiles.length > i; i++) {
          solicitudesComisionFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Solicitudes de comision/${i}. ${req.body.SolicitudesComisionFiles[i].Name}`,
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
          promiseResponsesOffSet + cotizacionesFilesPromises.length;
        for (
          let i = promiseResponsesOffSet;
          promiseResponsesOffSet + cotizacionesFilesPromises.length > i;
          i++
        ) {
          CotizacionesSharePointFiles.push(promiseResponses[i].data);
        }

        promiseResponsesOffSet =
          promiseResponsesOffSet + solicitudesComisionFilesPromises.length;
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
              `${gestionPath}/${req.body.Id}/Dieta/${i}. ${req.body.FormatoSolicitudViajes[i].Name}`,
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
              `${gestionPath}/${req.body.Id}/Cuenta de cobro o factura/${i}. ${req.body.CuentaCobroFiles[i].Name}`,
              req.body.CuentaCobroFiles[i].Bytes
            )
          );
        }

        var facturaEquivalenteFilesPromises = [];
        for (let i = 0; req.body.FacturaEquivalenteFiles.length > i; i++) {
          facturaEquivalenteFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Factura equivalente/${i}. ${req.body.FacturaEquivalenteFiles[i].Name}`,
              req.body.FacturaEquivalenteFiles[i].Bytes
            )
          );
        }

        var certificadoParafiscalesFilesPromises = [];
        for (let i = 0; req.body.CertificadoParafiscalesFiles.length > i; i++) {
          certificadoParafiscalesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Certificado de parafiscales/${i}. ${req.body.CertificadoParafiscalesFiles[i].Name}`,
              req.body.CertificadoParafiscalesFiles[i].Bytes
            )
          );
        }

        var informeActividadesFilesPromises = [];
        for (let i = 0; req.body.InformeActividadesFiles.length > i; i++) {
          informeActividadesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Informe de actividades/${i}. ${req.body.InformeActividadesFiles[i].Name}`,
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
              `${gestionPath}/${req.body.Id}/Formato de solicitud de avances/${i}. ${req.body.CamaraComercioFiles[i].Name}`,
              req.body.CamaraComercioFiles[i].Bytes
            )
          );
        }

        var formatoSolicitudAvancesFilesPromises = [];
        for (let i = 0; req.body.FormatoSolicitudAvancesFiles.length > i; i++) {
          formatoSolicitudAvancesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Formato de solicitud de avances/${i}. ${req.body.FormatoSolicitudAvancesFiles[i].Name}`,
              req.body.FormatoSolicitudAvancesFiles[i].Bytes
            )
          );
        }

        var cotizacionesFilesPromises = [];
        for (let i = 0; req.body.CotizacionesFiles.length > i; i++) {
          cotizacionesFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Anticipo/${i}. ${req.body.CotizacionesFiles[i].Name}`,
              req.body.CotizacionesFiles[i].Bytes
            )
          );
        }

        var solicitudesComisionFilesPromises = [];
        for (let i = 0; req.body.SolicitudesComisionFiles.length > i; i++) {
          solicitudesComisionFilesPromises.push(
            utils.uploadFileToSharePointWorkflowOEI(
              `${gestionPath}/${req.body.Id}/Anticipo/${i}. ${req.body.SolicitudesComisionFiles[i].Name}`,
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

  res.status(201).json(formsFinancieraInvoice);
  return;

  await axios.default.post(
    `https://prod-15.brazilsouth.logic.azure.com:443/workflows/471cd993ba91453e93291e330c7cd3f1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V-oDrteENSvLDPqKbeK9ZWNjjBkS3_d0m5vOxTe_S1c`,
    [formsFinancieraInvoice]
  );

  res.status(201).json(formsFinancieraInvoice);
});

module.exports = router;
