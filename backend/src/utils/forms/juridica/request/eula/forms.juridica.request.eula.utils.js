export const formsJuridicaRequestEulaObjectWithoutUndefined = (
  _id,
  Id,
  VerificationCode
) => {
  const obj = {};

  if (_id) {
    obj._id = _id;
  }

  if (Id) {
    obj._id = Id;
  }

  if (VerificationCode) {
    obj.VerificationCode = VerificationCode;
  }

  return obj;
};
