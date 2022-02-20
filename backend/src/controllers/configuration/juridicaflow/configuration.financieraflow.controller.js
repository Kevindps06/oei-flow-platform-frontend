import JuridicaFlow from "../../../schemas/configuration/juridicaflow/configuration.juridicaflow.schema";

export const save = async (req, res) => {
  try {
    const juridicaFlow = new JuridicaFlow(req.body);

    await juridicaFlow.save();

    res.status(201).json(juridicaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const juridicaFlow = await JuridicaFlow.find(
      utils.juridicaFlowObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      )
    );

    res.status(200).json(juridicaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const juridicaFlow = await JuridicaFlow.updateMany(
      utils.juridicaFlowObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      ),
      req.body
    );

    res.status(200).json(juridicaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const juridicaFlow = await JuridicaFlow.deleteMany(
      utils.juridicaFlowObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      )
    );

    res.status(200).json(juridicaFlow);
  } catch (err) {
    res.status(500).json(err);
  }
};
