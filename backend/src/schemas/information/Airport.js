const mongoose = require("mongoose");

const schema = mongoose.Schema({
  Code: String,
  IATA: String,
  "Airport Name": String,
  City: String,
  "City 2": String,
  Country: String,
  "Country 2": String,
  Latitude: Number,
  Longitude: Number,
  "Data 1": Number,
  "Data 2": Number,
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_INFORMATION_URI, {
    tls: true,
    tlsCAFile: process.env.MONGODB_TLSCAFILE_PATH,
    replicaSet: "rs0",
    readPreference: "secondaryPreferred",
    retryWrites: false,
  })
  .model("airport", schema, "airports");
