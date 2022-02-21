import axios from "axios";
import { getToken, tokenRequest } from "../../../apis/microsoft/auth";

export const get = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${process.env.FINANCIERA_OEI_SITE_ID}/lists/${process.env.FINANCIERA_OEI_SITE_CONVENIOS_LIST_ID}/items`,
    {
      headers: {
        Authorization: "Bearer " + (await getToken(tokenRequest)).accessToken,
        Prefer: "HonorNonIndexedQueriesWarningMayFailRandomly",
      },
      params: {
        $select: "id",
        $expand: "fields($select=Aliado,Numero,Mostrar_x0020_Juridica)",
        $filter: "fields/Mostrar_x0020_Juridica eq 1",
      },
    }
  );

  res.status(response.status).json(response.data);
};
