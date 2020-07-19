const express = require("express");
const cors = require("cors");
require("./models");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const routes = require("./routes");

const app = express();

app.use(express.json());

const corsConfig = {
  origin: [`http://localhost:3000`],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsConfig));

// Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: require("./models").mongooseConnection,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 48,
    },
  })
);
app.use(express.json());

// Routes

app.use("/api/v1/users", routes.user);
app.use("/api/v1/auth", routes.auth);
app.use("/api/v1/repos", routes.repos);

const PORT = process.env.PORT || 3650;
app.listen(PORT, () => console.log(`Server listening @ Port ${PORT}`));
