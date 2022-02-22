import {
  getConvenioFromSharePointById,
  inflateFlowStepsFinancieraOEI,
} from "../../../utils/utils";
import axios from "axios";
import { getToken, tokenRequest } from "../../../apis/microsoft/auth";

export const inflateFlowSteps = async (req, res) => {
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
};

export const validateRegistration = async (req, res) => {
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
  ).data.value[0].fields;

  if (contratistaProveedorResponse) {
    delete contratistaProveedorResponse["@odata.etag"];

    res.status(200).json(contratistaProveedorResponse);
  } else {
    res.status(404).send();
  }
};
