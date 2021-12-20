const express = require("express");

const createHttpErrors = require("http-errors");
const morgan = require("morgan");

const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const app = express();
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;

// assets
app.use(express.static("public"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//load routes
app.use("/", require("./routes/index.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));
app.use((req, res, next) => {
  return next(createHttpErrors.NotFound());
});
// Error handling
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render("error_40x", { error });
});

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log(`DB connected`);
    app.listen(PORT, () => {
      console.log(`server is up and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
