import formsJuridicaRequestEulaSchema from "../../../../../schemas/forms/juridica/request/eula/forms.juridica.request.eula.schema";
import {
  generateRandomString,
  formsJuridicaRequestEulaObjectWithoutUndefined,
} from "../../../../../utils/utils";

export const requestVerificationCode = async (req, res) => {
  try {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);

    const juridicaRequestEula = new formsJuridicaRequestEulaSchema({
      Id: req.body.Id,
      VerificationCode: generateRandomString(4),
      Creation: Math.floor(currentDate.getTime() / 1000.0),
      Expiration: Math.floor(expirationDate.getTime() / 1000.0),
      Used: false,
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
        req.query.VerificationCode,
        req.query.Creation,
        req.query.Expiration,
        req.query.Used
      )
    );

    if (juridicaRequestEula.length > 0) {
      if (!juridicaRequestEula[0].Used) {
        await formsJuridicaRequestEulaSchema.updateMany(
          formsJuridicaRequestEulaObjectWithoutUndefined(
            req.query._id,
            req.query.Id,
            req.query.VerificationCode,
            req.query.Creation,
            req.query.Expiration,
            req.query.Used
          ),
          {
            Used: true,
          }
        );

        if (
          juridicaRequestEula[0].Expiration >=
          Math.floor(new Date().getTime() / 1000.0)
        ) {
          res.status(200).send();
        } else {
          res.status(408).send();
        }
      } else {
        res.status(403).send();
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
        req.query.Expiration,
        req.query.Used
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
        req.query.Expiration,
        req.query.Used
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
        req.query.Expiration,
        req.query.Used
      )
    );

    res.status(200).json(juridicaRequestEula);
  } catch (err) {
    res.status(500).json(err);
  }
};
