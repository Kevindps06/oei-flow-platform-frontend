export const formsJuridicaRequestEulaObjectWithoutUndefined = (
  _id,
  Id,
  VerificationCode,
  Creation,
  Expiration,
  Used
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

  if (Creation) {
    obj.Creation = Creation;
  }

  if (Expiration) {
    obj.Expiration = Expiration;
  }

  if (Used) {
    obj.Used = Used;
  }

  return obj;
};
