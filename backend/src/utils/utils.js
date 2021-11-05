const fs = require("fs");
const axios = require("axios");
const auth = require("../apis/microsoft/auth");

function makeRandomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

async function uploadFileToSharePointWorkflowOEI(path, base64) {
  var authResponse;
  while (!authResponse) {
    authResponse = await auth.getToken(auth.tokenRequest);
  }

  var response = await axios.default.post(
    `https://graph.microsoft.com/v1.0/sites/${process.env.WORKFLOW_OEI_SITE_ID}/drive/root:${path}:/createUploadSession`,
    {},
    {
      headers: {
        Authorization: "Bearer " + authResponse.accessToken,
      },
    }
  );

  const data = Buffer.from(base64, "base64");
  const dataLength = data.length;
  const chunkSize = 327680; // 320 KiB
  const chunks = Math.ceil(dataLength / chunkSize, dataLength) - 1;

  var uploadResponse;

  var chunk = 0;
  while (chunks >= chunk) {
    console.log(`${chunk}/${chunks}`);
    const chunkOffset = chunk * chunkSize;
    const chunkData = data.slice(chunkOffset, chunkOffset + chunkSize);
    const chunkDataLength = chunkData.length;
    const chunkEndRange = chunkOffset + chunkDataLength - 1;

    try {
      uploadResponse = await axios.default.put(
        response.data.uploadUrl,
        chunkData,
        {
          headers: {
            "Content-Length": chunkDataLength,
            "Content-Range": `bytes ${chunkOffset}-${chunkEndRange}/${dataLength}`,
          },
        }
      );
    } catch (err) {
      if (err.code === "ETIMEDOUT") {
        continue;
      }

      throw err;
    }

    chunk++;
  }

  return uploadResponse;
}

module.exports = {
  uploadFileToSharePointWorkflowOEI: uploadFileToSharePointWorkflowOEI,
  makeRandomString: makeRandomString,
};
