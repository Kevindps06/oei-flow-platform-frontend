import fs from "fs";
import path from "path";

export const getCertificadoIngresosRetencionesYears = (req, res) => {
  const fileNames = fs.readdirSync(path.join(__dirname, "files"));

  res.status(200).json(fileNames);
};

export const getCertificadoIngresosRetencionesByYearAndIdentificator = (
  req,
  res
) => {
  const fileNames = fs.readdirSync(
    path.join(__dirname, "files", req.query.year)
  );

  const fileName = fileNames.find(
    (fileName) =>
      fileName.replace(new RegExp(",", "g"), "") ===
      `${req.query.identificator}.pdf`
  );

  if (!fileName) {
    res.status(404).send();

    return;
  }

  res
    .status(200)
    .sendFile(path.join(__dirname, "files", req.query.year, fileName));
};
