import formsJuridicaRequestEulaSchema from "../../../../../schemas/forms/juridica/request/eula/forms.juridica.request.eula.schema";
import { formsJuridicaRequestEulaObjectWithoutUndefined } from "../../../../../utils/forms/juridica/request/eula/forms.juridica.request.eula.utils";
import { generateRandomString } from "../../../../../utils/utils";

export const requestVerificationCode = async (req, res) => {
  try {
    const currentDate = new Date();

    console.log("Creation", Math.floor(currentDate.getTime() / 1000));
    console.log(
      "Expiration",
      Math.floor(
        currentDate.setMinutes(currentDate.getMinutes() + 5).getTime() / 1000
      )
    );

    const juridicaRequestEula = new formsJuridicaRequestEulaSchema({
      Id: req.body.Id,
      VerificationCode: generateRandomString(4),
      Creation: Math.floor(currentDate.getTime() / 1000),
      Expiration: Math.floor(
        currentDate.setMinutes(currentDate.getMinutes() + 5).getTime() / 1000
      ),
    });

    await juridicaRequestEula.save();

    res.status(201).send();
  } catch (err) {
    console.log(err);

    res.status(500).json({ "Test Json": ["Test", "Test"] });
  }
};

export const verifyVerificationCode = async (req, res) => {
  try {
    const juridicaRequestEula = await formsJuridicaRequestEulaSchema.find(
      formsJuridicaRequestEulaObjectWithoutUndefined(
        req.query._id,
        req.query.Id,
        req.query.VerificationCode,
        req.query.Creation,
        req.query.Expiration
      )
    );

    if (juridicaRequestEula.length > 0) {
      if (
        juridicaRequestEula[0].Expiration >=
        Math.floor(new Date().getTime() / 1000.0)
      ) {
        res.status(200).send();
      } else {
        res.status(408).send();
      }
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
        req.query.VerificationCode,
        req.query.Creation,
        req.query.Expiration
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
        req.query.VerificationCode,
        req.query.Creation,
        req.query.Expiration
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
        req.query.VerificationCode,
        req.query.Creation,
        req.query.Expiration
      )
    );

    res.status(200).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};
