import FinancieraFlow from "../../../schemas/configuration/financieraflow/configuration.financieraflow.schema";

export const save = async (req, res) => {
  try {
    const financieraFlow = new FinancieraFlow(req.body);

    await financieraFlow.save();

    res.status(201).json(financieraFlow);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
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
};

export const updateMany = async (req, res) => {
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
};

export const deleteMany = async (req, res) => {
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
};
