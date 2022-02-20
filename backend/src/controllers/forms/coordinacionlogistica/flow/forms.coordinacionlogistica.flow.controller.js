import formsCoordinacionLogisticaSchema from "../../../../schemas/forms/coordinacionlogistica/forms.coordinacionlogistica.schema"
import axios from "axios"
import {
  getConvenioFromSharePoint,
  getCoordinacionLogisticaFlowStepsWithEncargados,
  formsCoordinacionLogisticaObjectWithoutUndefined,
} from "../../../../utils/utils";

export const post = async (req, res) => {
  res.status(200).send();

  const convenio = await getConvenioFromSharePoint(req.body.Convenio);

  const configuration =
    await getCoordinacionLogisticaFlowStepsWithEncargados(
      req.body._id,
      req.body.steps,
      convenio
    );

  const coordinacionLogisticaPath = `/Coordinacion Logistica/${req.body.Id}`;

  let formsCoordinacionLogistica =
    formsCoordinacionLogisticaObjectWithoutUndefined(
      req.body._id,
      req.body.Id,
      req.body.Nombre,
      req.body.Convenio,
      req.body.Tramos,
      req.body.IdentificatorType,
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
        Files: await uploadFilesToSharePointWorkflow(
          `${coordinacionLogisticaPath}/Pasaporte`,
          req.body.PasaporteFiles
        ),
      },
      {
        Name: "Comprobantes",
        Files: await uploadFilesToSharePointWorkflow(
          `${coordinacionLogisticaPath}/Comprobantes`,
          req.body.ComprobantesFiles
        ),
      },
    ],
  });

  formsCoordinacionLogistica = Object.assign(formsCoordinacionLogistica, {
    Keys: Object.keys(formsCoordinacionLogistica),
  });

  /* Save to database */
  const coordinacionLogistica = new formsCoordinacionLogisticaSchema(
    formsCoordinacionLogistica
  );

  await coordinacionLogistica.save();

  let retries = 0;
  do {
    try {
      /* Send to MS FLOW */
      await axios.default.post(
        `https://prod-10.brazilsouth.logic.azure.com:443/workflows/d9284b8deff34c34b78c7309cbeb0f45/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xt5QdZEYOiWUAmAfu-ykUU1oMDBm2bKT9yUBS0k63sw`,
        [formsCoordinacionLogistica]
      );

      break;
    } catch (err) {
      console.log(`Try ${retries} - Error:`, err);
    }

    retries++;
  } while (retries < 5);
};
