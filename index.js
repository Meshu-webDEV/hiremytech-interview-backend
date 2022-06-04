require("dotenv").config();
console.clear();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const api = require("./api");
const { errorHandler, notFound, databaseStatus } = require("./middlewares");
const connect = require("./lib/database");
const cookieParser = require("cookie-parser");

// Configs
const { CLIENT, WEB_SERVER, META } = require("./lib/configs");
const { default: axios } = require("axios");

const app = express();

// Middlewares
app.set("trust proxy", 1);
app.use(morgan("dev"));
app.use(
  cors({
    origin: [
      `${
        WEB_SERVER.ENV === "production"
          ? CLIENT.URL_ORIGIN
          : "http://localhost:3000"
      }`,
    ],
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  })
);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(
    "Nodejs, Express, and JWT authentication RESTful API boilerplate ✨ - Meshu-webDEV@GitHub"
  );
});

// API route
app.use(`/${META.API_VERSION}`, databaseStatus, api);

app.listen(WEB_SERVER.PORT, async () => {
  console.log(`Running on port: ${WEB_SERVER.PORT}`);

  try {
    //Database
    const client = await connect();
    app.set("database", true);
    app.set("database-client", client);

    // Getting access key
    const { data } = await axios.post(
      `${WEB_SERVER.ORIGIN}/${META.API_VERSION}/users/signin`,
      {
        username: META.API_ADMIN,
        password: META.API_ADMIN_PASSWORD,
      }
    );
    app.set("access-token", data.token);

    console.log("successfully connected to database");
    console.log("successfully acquired access key");
  } catch (error) {
    console.log("Error initial API setup");
    console.log(error);
  }
});

app.use(notFound);
app.use(errorHandler);
