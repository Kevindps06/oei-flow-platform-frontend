const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const utils = require("./utils/utils");
const fs = require("fs");
const path = require("path");
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
    const tmpPath = path.join(__dirname, "..", "tmp");

    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath);
    }

    const tmpFolderPath = fs.mkdtempSync(path.join(tmpPath, "webApp-"));

    fs.writeFileSync(path.join(tmpFolderPath, req.query.name), req.body);

    setTimeout(() => {
      if (!fs.existsSync(tmpFolderPath)) {
        fs.rm(tmpFolderPath, { recursive: true }, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }, 21600000);

    res.status(201).json(tmpFolderPath);
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
        req.query.Requestor,
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
        req.query.Requestor,
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
        req.query.Requestor,
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
  const contratistaProveedorResponse = (
    await axios.default.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONTRATISTASPROVEEDORES_LIST_ID}/items`,
      {
        headers: {
          Authorization:
            "Bearer " + (await auth.getToken(auth.tokenRequest)).accessToken,
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

router.post("/forms/financiera/registration", async (req, res) => {
  res.status(200).send();

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
});

router.post("/forms/financiera/invoice", async (req, res) => {
  res.status(200).send();

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
      req.body.Requestor,
      convenio,
      configuration,
      gestionPath
    );

  if (req.body.TipoPersona === "Natural") {
    switch (req.body.TipoGestion) {
      case "Cuenta de cobro":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro o factura",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cuenta de cobro o factura`,
                req.body.CuentaCobroFiles
              ),
            },
            {
              Name: "Factura equivalente",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Factura equivalente`,
                req.body.FacturaEquivalenteFiles
              ),
            },
            {
              Name: "Seguridad social",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Seguridad Social`,
                req.body.SeguridadSocialFiles
              ),
            },
            {
              Name: "Informe de actividades",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Informe de actividades`,
                req.body.InformeActividadesFiles
              ),
            },
          ],
        });
        break;
      case "Anticipo":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de avances",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de solicitud de avances`,
                req.body.FormatoSolicitudAvancesFiles
              ),
            },
            {
              Name: "Cotizaciones",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cotizaciones`,
                req.body.CotizacionesFiles
              ),
            },
            {
              Name: "Solicitudes de comision",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Solicitudes de comision`,
                req.body.SolicitudesComisionFiles
              ),
            },
          ],
        });
        break;
      case "Dieta":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Formato de solicitud de viajes",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de solicitud de viajes`,
                req.body.FormatoSolicitudViajesFiles
              ),
            },
          ],
        });
        break;
      case "Legalizacion":
        switch (req.body.TipoLegalizacion) {
          case "Desplazamiento":
            formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
              SharePointFiles: [
                {
                  Name: "Formato de legalizacion de viajes",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion de viajes`,
                    req.body.FormatoLegalizacionViajesFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Soportes facturas`,
                    req.body.SoportesFacturasFiles
                  ),
                },
                {
                  Name: "Pasabordos tiquetes aereos",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Pasabordos tiquetes aereos`,
                    req.body.PasabordosTiquetesAereosFiles
                  ),
                },
                {
                  Name: "Informe de actividades",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Informe de actividades`,
                    req.body.InformeActividadesFiles
                  ),
                },
              ],
            });
            break;
          case "Suministro y servicios":
            formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
              SharePointFiles: [
                {
                  Name: "Formato de legalizacion",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion`,
                    req.body.FormatoLegalizacionFiles
                  ),
                },
                {
                  Name: "Cuenta de cobro o factura",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Cuenta de cobro o factura`,
                    req.body.CuentaCobroFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Soportes facturas`,
                    req.body.SoportesFacturasFiles
                  ),
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
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Cuenta de cobro o factura",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cuenta de cobro o factura`,
                req.body.CuentaCobroFiles
              ),
            },
            {
              Name: "Factura equivalente",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Factura equivalente`,
                req.body.FacturaEquivalenteFiles
              ),
            },
            {
              Name: "Certificado de parafiscales",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Certificado de parafiscales`,
                req.body.CertificadoParafiscalesFiles
              ),
            },
            {
              Name: "Informe de actividades",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Informe de actividades`,
                req.body.InformeActividadesFiles
              ),
            },
            {
              Name: "Poliza de anticipo y cumpliento",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Poliza de anticipo y cumpliento`,
                req.body.PolizaAnticipoCumplientoFiles
              ),
            },
          ],
        });
        break;
      case "Anticipo":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          SharePointFiles: [
            {
              Name: "Camara de comercio",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Camara de comercio`,
                req.body.CamaraComercioFiles
              ),
            },
            {
              Name: "Formato de solicitud de avances",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de solicitud de avances`,
                req.body.FormatoSolicitudAvancesFiles
              ),
            },
            {
              Name: "Cotizaciones",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cotizaciones`,
                req.body.CotizacionesFiles
              ),
            },
            {
              Name: "Solicitudes de comision",
              Files: await utils.uploadFilesToSharePointWorkflow(
                `${gestionPath}/Solicitudes de comision`,
                req.body.SolicitudesComisionFiles
              ),
            },
          ],
        });
        break;
      case "Legalizacion":
        switch (req.body.TipoLegalizacion) {
          case "Suministro y servicios":
            formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
              SharePointFiles: [
                {
                  Name: "Formato de legalizacion",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion`,
                    req.body.FormatoLegalizacionFiles
                  ),
                },
                {
                  Name: "Cuenta de cobro o factura",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Cuenta de cobro o factura`,
                    req.body.CuentaCobroFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Soportes facturas`,
                    req.body.SoportesFacturasFiles
                  ),
                },
                {
                  Name: "Certificado de parafiscales",
                  Files: await utils.uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Certificado de parafiscales`,
                    req.body.CertificadoParafiscalesFiles
                  ),
                },
              ],
            });
            break;
        }
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
          `https://prod-10.brazilsouth.logic.azure.com:443/workflows/224c1c2ba11641eca0c380112b3f45f7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ixU2jDh0rBt2Ynx9nyOE_b4N0rP0p-q7b9shJ2qKeII`,
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
});

router.post("/forms/coordinacionlogistica", async (req, res) => {
  res.status(200).send();

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

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    SharePointFiles: [
      {
        Name: "Pasaporte",
        Files: await utils.uploadFilesToSharePointWorkflow(
          `${coordinacionLogisticaPath}/Pasaporte`,
          req.body.PasaporteFiles
        ),
      },
      {
        Name: "Cedula",
        Files: await utils.uploadFilesToSharePointWorkflow(
          `${coordinacionLogisticaPath}/Cedula`,
          req.body.CedulaFiles
        ),
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
});

module.exports = router;
