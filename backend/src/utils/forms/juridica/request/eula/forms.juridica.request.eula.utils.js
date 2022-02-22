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
    obj.Id = Id;
  }

  if (VerificationCode) {
    obj.VerificationCode = VerificationCode;
  }

  return obj;
};
