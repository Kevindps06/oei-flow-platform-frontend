const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  _id: ObjectId,
  test: String,
});

module.exports = mongoose
  .createConnection(process.env.MONGODB_CONFIGURATIONS_URI)
  .model("FinancieraFlow", schema);
