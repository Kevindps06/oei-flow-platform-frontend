import mongoose from "mongoose";

const schema = mongoose.Schema({
  Id: String,
  VerificationCode: String,
  Creation: Number,
  Expiration: Number
});

export default mongoose
  .createConnection(process.env.MONGODB_FORMS_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("JuridicaRequestEula", schema, "JuridicaRequestEula");
