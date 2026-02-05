require("dotenv").config({
  path: `${__dirname}/.env.${process.env.NODE_ENV || "development"}`
});

const app = require("./app/app");

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

