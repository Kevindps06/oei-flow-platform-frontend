import formsJuridicaRequestEulaSchema from "../../../../../schemas/forms/juridica/request/eula/forms.juridica.request.eula.schema";
import { formsJuridicaRequestEulaObjectWithoutUndefined } from "../../../../../utils/forms/juridica/request/eula/forms.juridica.request.eula.utils";
import { generateRandomString } from "../../../../../utils/utils";

export const requestVerificationCode = async (req, res) => {
  try {
    const verificationCode = generateRandomString(4);

    const juridicaRequestEula = new formsJuridicaRequestEulaSchema({
      Id: req.body.Id,
      VerificationCode: verificationCode,
    });

    await juridicaRequestEula.save();

    res.status(201).send();
  } catch (err) {
    res.status(500).json(err);
  }
};

export const verifyVerificationCode = async (req, res) => {
  try {
    const juridicaRequestEula = await formsJuridicaRequestEulaSchema.find(
      formsJuridicaRequestEulaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.VerificationCode
      )
    );

    console.log(juridicaRequestEula);

    if (juridicaRequestEula.length > 0) {
      res.status(200).send();
    } else {
      res.status(404).send();
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const save = async (req, res) => {
  try {
    const juridicaRequestEula = new formsJuridicaRequestEulaSchema(req.body);

    await juridicaRequestEula.save();

    res.status(201).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const juridicaRequestEula = await formsJuridicaRequestEulaSchema.find(
      formsJuridicaRequestEulaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.VerificationCode
      )
    );

    res.status(200).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const juridicaRequestEula = await formsJuridicaRequestEulaSchema.updateMany(
      formsJuridicaRequestEulaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.VerificationCode
      ),
      req.body
    );

    res.status(200).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const juridicaRequestEula = await formsJuridicaRequestEulaSchema.deleteMany(
      formsJuridicaRequestEulaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.VerificationCode
      )
    );

    res.status(200).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};
