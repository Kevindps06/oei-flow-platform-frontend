import formsFinancieraInvoiceSchema from "../../../../../schemas/forms/financiera/invoice/forms.financiera.invoice.schema"
import {
  getConvenioFromSharePoint,
  getFinancieraFlowStepsWithEncargados,
  formsFinancieraInvoiceObjectWithoutUndefined,
  uploadFilesToSharePointWorkflow,
} from "../../../../../utils/utils";

export const post = async (req, res) => {
  res.status(200).send();

  const convenio = await getConvenioFromSharePoint(req.body.Convenio);

  const configuration = await getFinancieraFlowStepsWithEncargados(
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
    formsFinancieraInvoiceObjectWithoutUndefined(
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
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cuenta de cobro o factura`,
                req.body.CuentaCobroFiles
              ),
            },
            {
              Name: "Factura equivalente",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Factura equivalente`,
                req.body.FacturaEquivalenteFiles
              ),
            },
            {
              Name: "Seguridad social",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Seguridad Social`,
                req.body.SeguridadSocialFiles
              ),
            },
            {
              Name: "Informe de actividades",
              Files: await uploadFilesToSharePointWorkflow(
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
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de solicitud de avances`,
                req.body.FormatoSolicitudAvancesFiles
              ),
            },
            {
              Name: "Cotizaciones",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cotizaciones`,
                req.body.CotizacionesFiles
              ),
            },
            {
              Name: "Solicitudes de comision",
              Files: await uploadFilesToSharePointWorkflow(
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
              Files: await uploadFilesToSharePointWorkflow(
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
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion de viajes`,
                    req.body.FormatoLegalizacionViajesFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Soportes facturas`,
                    req.body.SoportesFacturasFiles
                  ),
                },
                {
                  Name: "Pasabordos tiquetes aereos",
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Pasabordos tiquetes aereos`,
                    req.body.PasabordosTiquetesAereosFiles
                  ),
                },
                {
                  Name: "Informe de actividades",
                  Files: await uploadFilesToSharePointWorkflow(
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
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion`,
                    req.body.FormatoLegalizacionFiles
                  ),
                },
                {
                  Name: "Cuenta de cobro o factura",
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Cuenta de cobro o factura`,
                    req.body.CuentaCobroFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await uploadFilesToSharePointWorkflow(
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
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cuenta de cobro o factura`,
                req.body.CuentaCobroFiles
              ),
            },
            {
              Name: "Factura equivalente",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Factura equivalente`,
                req.body.FacturaEquivalenteFiles
              ),
            },
            {
              Name: "Certificado de parafiscales",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Certificado de parafiscales`,
                req.body.CertificadoParafiscalesFiles
              ),
            },
            {
              Name: "Informe de actividades",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Informe de actividades`,
                req.body.InformeActividadesFiles
              ),
            },
            {
              Name: "Poliza de anticipo y cumpliento",
              Files: await uploadFilesToSharePointWorkflow(
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
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Camara de comercio`,
                req.body.CamaraComercioFiles
              ),
            },
            {
              Name: "Formato de solicitud de avances",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Formato de solicitud de avances`,
                req.body.FormatoSolicitudAvancesFiles
              ),
            },
            {
              Name: "Cotizaciones",
              Files: await uploadFilesToSharePointWorkflow(
                `${gestionPath}/Cotizaciones`,
                req.body.CotizacionesFiles
              ),
            },
            {
              Name: "Solicitudes de comision",
              Files: await uploadFilesToSharePointWorkflow(
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
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Formato de legalizacion`,
                    req.body.FormatoLegalizacionFiles
                  ),
                },
                {
                  Name: "Cuenta de cobro o factura",
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Cuenta de cobro o factura`,
                    req.body.CuentaCobroFiles
                  ),
                },
                {
                  Name: "Soportes facturas",
                  Files: await uploadFilesToSharePointWorkflow(
                    `${gestionPath}/Soportes facturas`,
                    req.body.SoportesFacturasFiles
                  ),
                },
                {
                  Name: "Certificado de parafiscales",
                  Files: await uploadFilesToSharePointWorkflow(
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

  /* Save to database */
  const financieraInvoice = new formsFinancieraInvoiceSchema(
    formsFinancieraInvoice
  );
  financieraInvoice.save();

  let retries = 0;
  do {
    try {
      /* Send to MS FLOW */
      await axios.default.post(
        `https://prod-10.brazilsouth.logic.azure.com:443/workflows/224c1c2ba11641eca0c380112b3f45f7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ixU2jDh0rBt2Ynx9nyOE_b4N0rP0p-q7b9shJ2qKeII`,
        [formsFinancieraInvoice]
      );

      break;
    } catch (err) {
      console.log(`Try ${retries} - Error:`, err);
    }

    retries++;
  } while (retries < 5);
};
