import AuthClient from "../../../schemas/auth/client/auth.client.schema";
import { authClientObjectWithoutUndefined } from "../../../utils/utils";

export const save = async (req, res) => {
  try {
    const authClient = new AuthClient(req.body);

    await authClient.save();

    res.status(201).json(authClient);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const authClient = await AuthClient.find(
      authClientObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      )
    );

    res.status(200).json(authClient);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const authClient = await AuthClient.updateMany(
      authClientObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      ),
      req.body
    );

    res.status(200).json(authClient);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const authClient = await AuthClient.deleteMany(
      authClientObjectWithoutUndefined(
        req.query._id,
        req.query.tipo,
        req.query.steps
      )
    );

    res.status(200).json(authClient);
  } catch (err) {
    res.status(500).json(err);
  }
};
