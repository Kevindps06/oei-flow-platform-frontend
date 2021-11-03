const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const nodemailer = require("nodemailer");
const utils = require("./utils/utils");

router.get("/request", async (req, res) => {
  const authResponse = await auth.getToken(auth.tokenRequest);

  try {
    const response = await axios.default.get(
      "https://graph.microsoft.com/beta/search/query",
      {
        headers: {
          Authorization: "Bearer " + authResponse.accessToken,
          Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    res.status(500).json(err);
  }

  res.json(response.data);
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

  res.json(response.data);
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
  res.json(response.data);
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
  res.json(response.data);
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
  res.json(response.data);
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
  res.json(response.data);
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
      .status(200)
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

      res.status(200).json({ userInfo: response2.data.value[0] });
    } else {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
});

router.post("/forms/financiera/invoice", async (req, res) => {
  let formsFinancieraInvoice = {
    ID: req.body.Id,
    "Tipo de persona": req.body.TipoPersona,
    "Tipo de relacion": req.body.TipoRelacion,
    "Tipo de soporte contable": req.body.TipoSoporteContable,
    Convenio: req.body.Convenio,
  };

  if (req.body.TipoPersona === "Natural") {
    formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
      "Numero de cedula de ciudadania": req.body.Identificador,
    });
  } else {
    formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
      "NIT (Con digito de verificacion y previamente registrado) Ej. 890507890-4":
        req.body.Identificador,
    });
  }

  if (req.body.TipoPersona === "Natural") {
    switch (req.body.TipoSoporteContable) {
      case "Cuenta de cobro":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          "Cuenta de cobro": req.body["0"],
          "Factura equivalente": req.body["1"],
          "Seguridad social": req.body["2"],
          "Informe de actividades": req.body["3"],
        });
        break;
      case "Anticipo":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          "Formato de solicitud de avances": req.body["0"],
          Cotizaciones: req.body["1"],
          "Solicitudes de comision": req.body["2"],
        });
        break;
      case "Dieta":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          "Formato de solicitud de viajes": req.body["0"],
        });
        break;
    }
  } else {
    switch (req.body.TipoSoporteContable) {
      case "Cuenta de cobro":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          "Cuenta de cobro o factura": req.body["0"],
          "Factura equivalente": req.body["1"],
          Parafiscales: req.body["2"],
          "Informe de actividades": req.body["3"],
        });
        break;
      case "Anticipo":
        formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
          "Formato de solicitud de avances": req.body["0"],
          "Camara de comercio": req.body["1"],
          Cotizaciones: req.body["2"],
          "Solicitudes de comision": req.body["3"],
        });
        break;
    }
  }

  formsFinancieraInvoice = Object.assign(formsFinancieraInvoice, {
    "Informacion adicional": req.body.InformacionAdicional,
    Keys: Object.keys(formsFinancieraInvoice),
  });

  const response = await axios.default.post(
    `https://prod-15.brazilsouth.logic.azure.com:443/workflows/471cd993ba91453e93291e330c7cd3f1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=V-oDrteENSvLDPqKbeK9ZWNjjBkS3_d0m5vOxTe_S1c`,
    [formsFinancieraInvoice]
  );

  res.status(200).send();
});

module.exports = router;
