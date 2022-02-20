import fs from "fs";
import path from "path";

export const uploadFile = (req, res) => {
  try {
    if (!fs.existsSync(process.env.TEMP_PATH)) {
      fs.mkdirSync(process.env.TEMP_PATH);
    }

    const tmpFolderPath = fs.mkdtempSync(
      path.join(process.env.TEMP_PATH, "webApp-")
    );

    fs.writeFileSync(path.join(tmpFolderPath, req.query.name), req.body);

    setTimeout(() => {
      if (fs.existsSync(tmpFolderPath)) {
        fs.rm(tmpFolderPath, { recursive: true }, (err) => {
          if (err) {
            console.log(`File delete error: ${err}`);
          }
        });
      }
    }, 21600000);

    res.status(201).json(tmpFolderPath);
  } catch (err) {
    res.status(500).json(err);
  }
};
