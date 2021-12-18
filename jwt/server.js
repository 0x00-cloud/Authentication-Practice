const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");

require("dotenv").config();
require("./helpers/init_mongodb");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authRoute = require("./routes/auth.route");
const PORT = process.env.PORT || 3000;

const { verfiyAccessToken } = require("./helpers/jwt_helper");

app.get("/", verfiyAccessToken, (req, res) => {
  console.log(req.headers["authorization"]);
  res.send("all ok!");
});

app.use("/auth", authRoute);

app.use(async (req, res, next) => {
  //   const error = new Error("not Found");
  //   error.status = 404;
  //   next(error);
  // Instead of hardcoding the error automate it
  next(createError.NotFound("This route does't exit"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
app.listen(PORT, () => {
  console.log(`server runnin on port ${PORT}`);
});
