const express = require("express");
const axios = require("axios");
const router = express.Router();
const auth = require("./apis/microsoft/auth");
const nodemailer = require("nodemailer");
const utils = require("./utils/utils");
const fs = require("fs");

router.get("/request", async (req, res) => {
  const data = Uint8Array.from(fs.readFileSync(`${__dirname}/largeFile.rar`));
  const dataLength = data.length;
  const chunkSize = 327680; // 320 KiB
  const chunks = Math.ceil(dataLength / 26, dataLength) - 1;

  responses = [];

  var chunk = 0;
  while (chunks >= chunk) {
    const chunkOffset = chunk * chunkSize;
    const chunkData = data.slice(chunkOffset, chunkOffset + chunkSize);
    const chunkDataLength = chunkData.length;
    const chunkEndRange = chunkOffset + chunkDataLength;

    try {
      responses.push(
        await axios.default.put(
          "https://oei1.sharepoint.com/sites/Workflow_OEI/_api/v2.0/drive/items/01CD2I3QD3ZLGMZUGMYZELOJ2YSHQZGVFW/uploadSession?guid='fcd15fca-d463-42fc-b2ca-6ad9a55fc9c5'&overwrite=True&rename=False&dc=0&tempauth=eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvb2VpMS5zaGFyZXBvaW50LmNvbUA1NDcxMDA4ZC0wZjZmLTQ2ZjUtODIxYy04YTJmN2VkNzBhY2YiLCJpc3MiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAiLCJuYmYiOiIxNjM2MDYzMjE4IiwiZXhwIjoiMTYzNjE0OTYxOCIsImVuZHBvaW50dXJsIjoiVFRrbkVLV1ZxV29lUUJzV0RuZmRxYlMzVFJVZ291cDRzcUxDcGJqbzJXQT0iLCJlbmRwb2ludHVybExlbmd0aCI6IjE5NCIsImlzbG9vcGJhY2siOiJUcnVlIiwiY2lkIjoiWmprM1lXRTROREV0TkRneU5pMHhNVEZrTFRabE9UVXRNVE5pTm1KaVpUa3dORFl6IiwidmVyIjoiaGFzaGVkcHJvb2Z0b2tlbiIsInNpdGVpZCI6IlltSTNNalppTldRdE5XUmxOeTAwWkRjMUxXSmhORFl0WTJFM016aGpZV0UxWVdFNSIsImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiZ2l2ZW5fbmFtZSI6IkFkb2xmbyIsImZhbWlseV9uYW1lIjoiRXNjb2JhciIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwidGlkIjoiNTQ3MTAwOGQtMGY2Zi00NmY1LTgyMWMtOGEyZjdlZDcwYWNmIiwidXBuIjoiYWVzY29iYXJAY29udHJhdGlzdGEub2VpLm9yZy5jbyIsInB1aWQiOiIxMDAzMjAwMTMzNzhEMzg3IiwiY2FjaGVrZXkiOiIwaC5mfG1lbWJlcnNoaXB8MTAwMzIwMDEzMzc4ZDM4N0BsaXZlLmNvbSIsInNjcCI6ImFsbGZpbGVzLnJlYWQgYWxsc2l0ZXMucmVhZCBhbGxzaXRlcy53cml0ZSBhbGxwcm9maWxlcy5yZWFkIiwidHQiOiIyIiwidXNlUGVyc2lzdGVudENvb2tpZSI6bnVsbCwiaXBhZGRyIjoiMjAuMTkwLjE1Ny4zMCJ9.bDU5UUlpZ1lDaUlZZjJoTVRxL25xcDlnc3RvYWd0UHQ1K053ZVFSM3pOTT0",
          chunkData,
          {
            headers: {
              "Content-Length": chunkDataLength,
              "Content-Range": `bytes ${chunkOffset}-${
                chunkEndRange - 1
              }/${dataLength}`,
            },
          }
        )
      );
    } catch (err) {
      res.status(500).json(err);
      return;
    }

    chunk++;
  }

  res.status(200).json(JSON.stringify(responses));
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

  res.status(200).send();
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
