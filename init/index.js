if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
console.log(mapToken);
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

main()
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDatabase = async () => {
  await Listing.deleteMany({});
  initData.data = await Promise.all(
    initData.data.map(async (obj) => {
      const response = await geocodingClient
        .forwardGeocode({
          query: obj.location,
          limit: 1,
        })
        .send();

      const geometry = response.body.features[0]?.geometry;

      return {
        ...obj,
        owner: "686cf771b7d257190333944e",
        geometry,
      };
    })
  );

  await Listing.insertMany(initData.data);


  console.log("data initialized");
};

initDatabase();
