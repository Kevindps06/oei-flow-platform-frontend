import {
  getConvenioFromSharePointById,
  inflateFlowStepsJuridicaOEI,
} from "../../../utils/utils";

export const inflateFlowSteps = async (req, res) => {
  let response = req.body;

  const convenio = await getConvenioFromSharePointById(
    req.body[0].ConvenioInformation.id
  );

  response[0].ConvenioInformation = convenio;

  response[0].Configuration = await inflateFlowStepsJuridicaOEI(
    req.body[0].Configuration,
    convenio
  );

  res.status(200).json(response);
};
