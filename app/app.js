const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();

app.use(express.json());

app.use("/api", express.static("public"));

app.use("/api", apiRouter);

app.all(/.*/, (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    err = { status: 400, msg: "Bad request" };
  }

  console.error(err);
  res.status(err.status || 500).send({
    msg: err.msg || "Internal server error",
  });
});

module.exports = app;
