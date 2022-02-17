import fs from "fs";
import path from "path";

export const getCertificacionLaboralByIdentificator = (req, res) => {
  const fileNames = fs.readdirSync(path.join(__dirname, "files"));

  const fileName = fileNames.find(
    (fileName) =>
      fileName.replace(new RegExp(",", "g"), "") ===
      `${req.query.identificator}.pdf`
  );

  if (!fileName) {
    res.status(404).send();

    return;
  }

  res.status(200).sendFile(path.join(__dirname, "files", fileName));
};
