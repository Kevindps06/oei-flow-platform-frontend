const airportSchema = require("../../../schemas/information/Airport");

export const save = async (req, res) => {
  try {
    const airport = new airportSchema(req.body);

    await airport.save();

    res.status(201).json(airport);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const find = async (req, res) => {
  try {
    const airport = await airportSchema.find(
      utils.informationAirportObjectWithoutUndefined(
        req.query._id,
        req.query.Code,
        req.query.IATA,
        req.query["Airport Name"],
        req.query.City,
        req.query["City 2"],
        req.query.Country,
        req.query["Country 2"],
        req.query.Latitude,
        req.query.Longitude,
        req.query["Data 1"],
        req.query["Data 2"]
      )
    );

    res.status(200).json(airport);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateMany = async (req, res) => {
  try {
    const airport = await airportSchema.updateMany(
      utils.informationAirportObjectWithoutUndefined(
        req.query._id,
        req.query.Code,
        req.query.IATA,
        req.query["Airport Name"],
        req.query.City,
        req.query["City 2"],
        req.query.Country,
        req.query["Country 2"],
        req.query.Latitude,
        req.query.Longitude,
        req.query["Data 1"],
        req.query["Data 2"]
      ),
      req.body
    );

    res.status(200).json(airport);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteMany = async (req, res) => {
  try {
    const airport = await Airport.deleteMany(
      utils.informationAirportObjectWithoutUndefined(
        req.query._id,
        req.query.Code,
        req.query.IATA,
        req.query["Airport Name"],
        req.query.City,
        req.query["City 2"],
        req.query.Country,
        req.query["Country 2"],
        req.query.Latitude,
        req.query.Longitude,
        req.query["Data 1"],
        req.query["Data 2"]
      )
    );

    res.status(200).json(airport);
  } catch (err) {
    res.status(500).json(err);
  }
};
