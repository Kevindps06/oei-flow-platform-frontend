import express from "express";
import bytes from "bytes";
import path from "path";
import cors from "cors";
import routes from "./routes/routes";

const app = express();

//app.use(morgan("tiny"));

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

app.use("/api", routes);

app.set("views", path.join(__dirname, "views"));

app.use(express.static(app.get("views")));

app.get("/*", (req, res) => {
  res.set("X-UA-Compatible", "IE=Edge");
  res.status(200).sendFile(path.join(app.get("views"), "index.html"));
});

export default app;
