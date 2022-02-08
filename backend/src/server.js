require("dotenv").config();

const express = require("express");
const bytes = require("bytes");
const path = require("path");
const cors = require("cors");
const router = require("./router");
const jwt = require("jsonwebtoken");

const app = express();

app.set("views", path.join(__dirname, "../dist"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.raw({ limit: bytes(1024 * 1024 * 1024) }));

app.use(express.json({ limit: bytes(1024 * 1024 * 128) }));

app.use(
  express.urlencoded({ limit: bytes(1024 * 1024 * 128), extended: true })
);

//app.use(morgan("tiny"));

const verifyToken = (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ error: "Acceso denegado" });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "token no es válido" });
  }
};

app.use("/api", router);

app.use(express.static(app.get("views")));

app.get("/*", (req, res) => {
  res.setHeader("X-UA-Compatible", "IE=Edge");
  res.status(200).sendFile(path.join(app.get("views"), "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}...`);
});
