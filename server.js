const express = require("express");

const dotenv = require("dotenv");

dotenv.config({
  path: "./config/env/config.env",
});

const routers = require("./routers/index.js");

const app = express();

const PORT = process.env.PORT;
//MangoDB Connection
const connectDatabase = require("./helpers/database/connectDatabase");
connectDatabase();
//CustomErrorHandler
const customErrorHandler=require("./middlewares/errors/customErrorHandler");
app.use("/api", routers);

app.get("/", (req, res) => {
  res.send("Hello World updated");
});

app.use(customErrorHandler);

app.listen(PORT, () => {
  console.log(`Hello World PORT ${PORT}`);
});
