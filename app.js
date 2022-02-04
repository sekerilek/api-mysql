const express = require("express");
const app = express();
const ProductRouter = require("./app/product/routes");
const path = require("path");
const logger = require("morgan");

app.use(logger("dev"));
app.use(express.urlencoded({ extends: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", ProductRouter);
app.use((req, res, next) => {
  res.status(404);
  res.send({
    status: "failed",
    message: req.originalUrl + " Not Found",
  });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server: http://localhost:3000")
);
