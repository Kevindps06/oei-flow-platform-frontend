const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const nodemailer = require("nodemailer");
const utils = require("./utils/utils");
const fs = require("fs");
const path = require("path");
const os = require("os");
const FinancieraFlow = require("./schemas/configuration/FinancieraFlow");
const CoordinacionLogisticaFlow = require("./schemas/configuration/CoordinacionLogisticaFlow");
const FinancieraInvoice = require("./schemas/forms/FinancieraInvoice");
const CoordinacionLogistica = require("./schemas/forms/CoordinacionLogistica");

router.post("/request", async (req, res) => {
  res.status(200).send(req.body.length);
});

// Upload file to server

router.post("/uploadfile", (req, res) => {
  try {
    let tmpPath = fs.mkdtempSync(path.join(os.tmpdir(), "webApp-"));

    fs.writeFileSync(path.join(tmpPath, req.query.name), req.body);

    res.status(201).json(tmpPath);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Configuration - FinancieraFlow

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

// Configuration - CoordinacionLogisticaFlow

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

// Forms - FinancieraInvoice

router.post("/forms/financiera/invoices", async (req, res) => {
  try {
    const financieraInvoice = new FinancieraInvoice(req.body);

    await financieraInvoice.save();

    res.status(201).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/forms/financiera/invoices", async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.find(
      utils.formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      )
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/forms/financiera/invoices", async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.updateMany(
      utils.formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      ),
      req.body
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/forms/financiera/invoices", async (req, res) => {
  try {
    const financieraInvoice = await FinancieraInvoice.deleteMany(
      utils.formsFinancieraInvoiceObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.TipoPersona,
        req.query.TipoRelacion,
        req.query.Identificator,
        req.query.Email,
        req.query.TipoGestion,
        req.query.TipoLegalizacion,
        req.query.Convenio,
        req.query.InformacionAdicional,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.GestionPath,
        req.query.SharePointFiles,
        req.query.Keys
      )
    );

    res.status(200).json(financieraInvoice);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Forms - CoordinacionesLogisticas

router.post("/forms/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = new CoordinacionLogistica(req.body);

    await coordinacionLogistica.save();

    res.status(201).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/forms/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.find(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.Nombre,
        req.query.Convenio,
        req.query.Ida,
        req.query.HorarioIda,
        req.query.Vuelta,
        req.query.HorarioVuelta,
        req.query.Identificator,
        req.query.FechaNacimiento,
        req.query.EquipajeAdicional,
        req.query.Email,
        req.query.Telefono,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.CoordinacionLogisticaPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.Quotations,
        req.query.SelectedQuotation
      )
    );

    res.status(200).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/forms/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.updateMany(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.Nombre,
        req.query.Convenio,
        req.query.Ida,
        req.query.HorarioIda,
        req.query.Vuelta,
        req.query.HorarioVuelta,
        req.query.Identificator,
        req.query.FechaNacimiento,
        req.query.EquipajeAdicional,
        req.query.Email,
        req.query.Telefono,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.CoordinacionLogisticaPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.Quotations,
        req.query.SelectedQuotation
      ),
      req.body
    );

    res.status(200).json(coordinacionLogistica);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/forms/coordinacioneslogisticas", async (req, res) => {
  try {
    const coordinacionLogistica = await CoordinacionLogistica.deleteMany(
      utils.formsCoordinacionLogisticaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.Nombre,
        req.query.Convenio,
        req.query.Ida,
        req.query.HorarioIda,
        req.query.Vuelta,
        req.query.HorarioVuelta,
        req.query.Identificator,
        req.query.FechaNacimiento,
        req.query.EquipajeAdicional,
        req.query.Email,
        req.query.Telefono,
        req.query.InformacionAdicional,
        req.query.Requestor,
        req.query.ConvenioInformation,
        req.query.Configuration,
        req.query.CoordinacionLogisticaPath,
        req.query.SharePointFiles,
        req.query.Keys,
        req.query.Quotations,
        req.query.SelectedQuotation
      )
    );

    res.status(200).json(coordinacionLogistica);
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
    `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONTRATISTASPROVEEDORES_LIST_ID}/items`,
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
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
  );

  if (
    response.data.value.length > 0 &&
    response.data.value[0].fields.Estado === "Verificado"
  ) {
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
      .json({ userInfo: response.data.value[0], generatedCode: generatedCode });
  } else {
    res.status(404).send();
  }
});

router.get("/platform/validateUser", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);
  const response = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_USERINFORMATION_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/EMail eq '${req.query.email}'`,
      {
        headers: {
          Authorization: "Bearer " + authResponse.accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
        },
      }
    )
  ).data.value[0];

  delete response["@odata.etag"];
  delete response["fields@odata.context"];
  delete response.fields["@odata.etag"];

  if (response) {
    const authResponse2 = await auth.getToken(auth.tokenRequest);
    const response2 = await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_PLATFORMUSERS_LIST_ID}/items?$select=id&$expand=fields&$filter=fields/UserLookupId eq '${response.id}' and fields/Password eq '${req.query.password}'`,
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
            `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items/${response2.data.value[0].fields.Convenios[i].LookupId}?$select=id&$expand=fields`,
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

      res.status(response2.status).json({
        userInfo: response,
        plaftformInfo: response2.data.value[0],
      });
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
      RUT: req.body.RutFiles,
      Cedula: req.body.CedulaFiles,
      "Certificacion bancaria": req.body.CertificacionBancariaFiles,
    });
  } else {
    formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
      "NIT (Con digito de verificacion y previamente registrado) Ej. 890507890-4":
        req.body.Identificator,
      RUT: req.body.RutFiles,
      "Cedula representante legal": req.body.CedulaFiles,
      "Certificacion bancaria": req.body.CertificacionBancariaFiles,
    });
  }

  formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
    "Informacion adicional": req.body.InformacionAdicional,
  });

  formsFinancieraRegistration = Object.assign(formsFinancieraRegistration, {
    Keys: Object.keys(formsFinancieraRegistration),
    ConvenioInformation: await utils.getConvenioFromSharePoint(
      req.body.Convenio
    ),
  });

  const response = await axios.default.post(
    `https://prod-20.brazilsouth.logic.azure.com:443/workflows/d86f74b4e4374001a78424d69cc15240/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4gnntmoLVSwLIKE6lvawvpgJ_Z3Xq9u5hTj0Iof4qQI`,
    [formsFinancieraRegistration]
  );

  res.status(response.status).json(response.data);
});

router.post("/forms/financiera/invoice", async (req, res) => {
  const convenio = await utils.getConvenioFromSharePoint(req.body.Convenio);

  const configuration = await utils.getFinancieraFlowStepsWithEncargados(
    req.body._id,
    req.body.TipoPersona,
    req.body.TipoRelacion,
    req.body.TipoGestion,
    req.body.TipoLegalizacion,
    req.body.steps,
    convenio
  );

  const gestionPath = `/Gestion/${req.body.TipoPersona}/${req.body.TipoRelacion}/${req.body.TipoGestion}/${req.body.Id}`;

  let formsFinancieraInvoice =
    utils.formsFinancieraInvoiceObjectWithoutUndefined(
      req.body._id,
      req.body.Id,
      req.body.TipoPersona,
      req.body.TipoRelacion,
      req.body.Identificator,
      req.body.Email,
      req.body.TipoGestion,
      req.body.TipoLegalizacion,
      req.body.Convenio,
      req.body.InformacionAdicional,
      convenio,
      configuration,
      gestionPath
    );

  if (req.body.TipoPersona === "Natural") {
    switch (req.body.TipoGestion) {
      case "Cuenta de cobro":
        var uploadFilesPromises = [];

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Cuenta de cobro o factura`,
            req.body.CuentaCobroFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Factura equivalente`,
            req.body.FacturaEquivalenteFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Seguridad Social`,
            req.body.SeguridadSocialFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Informe de actividades`,
            req.body.InformeActividadesFiles
          )
        );

        var promisesResponses = await Promise.all(uploadFilesPromises);

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro o factura",
              Files: promisesResponses[0],
            },
            {
              Name: "Factura equivalente",
              Files: promisesResponses[1],
            },
            {
              Name: "Seguridad social",
              Files: promisesResponses[2],
            },
            {
              Name: "Informe de actividades",
              Files: promisesResponses[3],
            },
          ],
        });
        break;
      case "Anticipo":
        var uploadFilesPromises = [];

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Formato de solicitud de avances`,
            req.body.FormatoSolicitudAvancesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Cotizaciones`,
            req.body.CotizacionesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Solicitudes de comision`,
            req.body.SolicitudesComisionFiles
          )
        );

        var promisesResponses = await Promise.all(uploadFilesPromises);

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de avances",
              Files: promisesResponses[0],
            },
            {
              Name: "Cotizaciones",
              Files: promisesResponses[1],
            },
            {
              Name: "Solicitudes de comision",
              Files: promisesResponses[2],
            },
          ],
        });
        break;
      case "Dieta":
        var uploadFilesPromises = [];

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Formato de solicitud de viajes`,
            req.body.FormatoSolicitudViajesFiles
          )
        );

        var promisesResponses = await Promise.all(uploadFilesPromises);

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de viajes",
              Files: promisesResponses[0],
            },
          ],
        });
        break;
      case "Legalizacion":
        switch (req.body.TipoLegalizacion) {
          case "Desplazamiento":
            var uploadFilesPromises = [];

            uploadFilesPromises.push(
              utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de legalizacion de viajes`,
                req.body.FormatoLegalizacionViajesFiles
              )
            );

            uploadFilesPromises.push(
              utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Soportes facturas`,
                req.body.SoportesFacturasFiles
              )
            );

            uploadFilesPromises.push(
              utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Pasabordos tiquetes aereos`,
                req.body.PasabordosTiquetesAereosFiles
              )
            );

            uploadFilesPromises.push(
              utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Informe de actividades`,
                req.body.InformeActividadesFiles
              )
            );

            var promisesResponses = await Promise.all(uploadFilesPromises);

            formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
              SharePointFiles: [
                {
                  Name: "Formato de legalizacion de viajes",
                  Files: promisesResponses[0],
                },
                {
                  Name: "Soportes facturas",
                  Files: promisesResponses[1],
                },
                {
                  Name: "Pasabordos tiquetes aereos",
                  Files: promisesResponses[2],
                },
                {
                  Name: "Informe de actividades",
                  Files: promisesResponses[3],
                },
              ],
            });
            break;
        }
        break;
    }
  } else {
    switch (req.body.TipoGestion) {
      case "Cuenta de cobro":
        var uploadFilesPromises = [];

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Cuenta de cobro o factura`,
            req.body.CuentaCobroFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Factura equivalente`,
            req.body.FacturaEquivalenteFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Certificado de parafiscales`,
            req.body.CertificadoParafiscalesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Informe de actividades`,
            req.body.InformeActividadesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Poliza de anticipo y cumpliento`,
            req.body.PolizaAnticipoCumplientoFiles
          )
        );

        var promisesResponses = await Promise.all(uploadFilesPromises);

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro o factura",
              Files: promisesResponses[0],
            },
            {
              Name: "Factura equivalente",
              Files: promisesResponses[1],
            },
            {
              Name: "Certificado de parafiscales",
              Files: promisesResponses[2],
            },
            {
              Name: "Informe de actividades",
              Files: promisesResponses[3],
            },
            {
              Name: "Poliza de anticipo y cumpliento",
              Files: promisesResponses[4],
            },
          ],
        });
        break;
      case "Anticipo":
        var uploadFilesPromises = [];

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Camara de comercio`,
            req.body.CamaraComercioFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Formato de solicitud de avances`,
            req.body.FormatoSolicitudAvancesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Cotizaciones`,
            req.body.CotizacionesFiles
          )
        );

        uploadFilesPromises.push(
          utils.uploadFilesToSharePointWorkflow(
            `${gestionPath}/Solicitudes de comision`,
            req.body.SolicitudesComisionFiles
          )
        );

        var promisesResponses = await Promise.all(uploadFilesPromises);

        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Camara de comercio",
              Files: promisesResponses[0],
            },
            {
              Name: "Formato de solicitud de avances",
              Files: promisesResponses[1],
            },
            {
              Name: "Cotizaciones",
              Files: promisesResponses[2],
            },
            {
              Name: "Solicitudes de comision",
              Files: promisesResponses[3],
            },
          ],
        });
        break;
    }
  }

  formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
    Keys: Object.keys(formsFinancieraInvoice),
  });

  let retries = 0;
  do {
    try {
      let promises = [];

      /* Save to database */
      // For localhost testing only
      /*promises.push(
        axios.default.post(
          `https://oeiprojectflow.org/api/forms/financiera/invoices`,
          formsFinancieraInvoice
        )
      );*/

      // Production direct with database
      /*const financieraInvoice = new FinancieraInvoice(
        formsFinancieraInvoice
      );
      promises.push(financieraInvoice.save());*/

      /* Send to MS FLOW */
      promises.push(
        axios.default.post(
          `https://prod-15.brazilsouth.logic.azure.com:443/workflows/471cd993ba91453e93291e330c7cd3f1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V-oDrteENSvLDPqKbeK9ZWNjjBkS3_d0m5vOxTe_S1c`,
          [formsFinancieraInvoice]
        )
      );

      /* Wait all async actions finish */
      await Promise.all(promises);

      break;
    } catch (err) {
      console.log(`Try ${retries} - Error:`, err);
    }

    retries++;
  } while (retries < 5);

  res.status(201).send();
});

router.post("/forms/coordinacionlogistica", async (req, res) => {
  const convenio = await utils.getConvenioFromSharePoint(req.body.Convenio);

  const configuration =
    await utils.getCoordinacionLogisticaFlowStepsWithEncargados(
      req.body._id,
      req.body.steps,
      convenio
    );

  const coordinacionLogisticaPath = `/Coordinacion Logistica/${req.body.Id}`;

  let formsCoordinacionLogistica =
    utils.formsCoordinacionLogisticaObjectWithoutUndefined(
      req.body._id,
      req.body.Id,
      req.body.Nombre,
      req.body.Convenio,
      new Date(req.body.Ida).toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      req.body.HorarioIda,
      req.body.Vuelta
        ? new Date(req.body.Vuelta).toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : undefined,
      req.body.HorarioVuelta,
      req.body.Identificator,
      new Date(req.body.FechaNacimiento).toLocaleDateString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      req.body.EquipajeAdicional,
      req.body.Email,
      req.body.Telefono,
      req.body.InformacionAdicional,
      req.body.Requestor,
      convenio,
      configuration,
      coordinacionLogisticaPath
    );

  var uploadFilesPromises = [];

  uploadFilesPromises.push(
    utils.uploadFilesToSharePointWorkflow(
      `${coordinacionLogisticaPath}/Pasaporte`,
      req.body.PasaporteFiles
    )
  );

  uploadFilesPromises.push(
    utils.uploadFilesToSharePointWorkflow(
      `${coordinacionLogisticaPath}/Cedula`,
      req.body.CedulaFiles
    )
  );

  var promisesResponses = await Promise.all(uploadFilesPromises);

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    SharePointFiles: [
      {
        Name: "Pasaporte",
        Files: promisesResponses[0],
      },
      {
        Name: "Cedula",
        Files: promisesResponses[1],
      },
    ],
  });

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    Keys: Object.keys(formsCoordinacionLogistica),
  });

  let retries = 0;
  do {
    try {
      let promises = [];

      /* Save to database */
      // For localhost testing only
      promises.push(
        axios.default.post(
          `https://oeiprojectflow.org/api/forms/coordinacioneslogisticas`,
          formsCoordinacionLogistica
        )
      );

      // Production direct with database
      /*const coordinacionLogistica = new CoordinacionLogistica(
        formsCoordinacionLogistica
      );
      promises.push(coordinacionLogistica.save());*/

      /* Send to MS FLOW */
      promises.push(
        axios.default.post(
          `https://prod-10.brazilsouth.logic.azure.com:443/workflows/d9284b8deff34c34b78c7309cbeb0f45/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xt5QdZEYOiWUAmAfu-ykUU1oMDBm2bKT9yUBS0k63sw`,
          [formsCoordinacionLogistica]
        )
      );

      /* Wait all async actions finish */
      await Promise.all(promises);

      break;
    } catch (err) {
      console.log(`Try ${retries} - Error:`, err);
    }

    retries++;
  } while (retries < 5);

  res.status(201).send();
});

module.exports = router;
