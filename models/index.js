const mongoose = require("mongoose");
require("dotenv").config();

const connectionString =
  process.env.MONGODB_URI || "mongodb://localhost:27017/credentials";

connectionParameters = {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(connectionString, connectionParameters)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log(`Error connecting to Mongo: ${err}`));

function closeConnection() {
  mongoose.connection.close();
}

module.exports = {
  mongooseConnection: mongoose.connection,
  _closeConnection: closeConnection,
  User: require("./User"),
};
