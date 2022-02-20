import { getToken, tokenRequest } from "../../../apis/microsoft/auth"

export const getSiteByName = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/oei1.sharepoint.com:/sites/${req.params.siteName}`,
    {
      headers: {
        Authorization:
          "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
};

export const getSiteByIdLists = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists`,
    {
      headers: {
        Authorization:
          "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
};

export const getSiteByIdListById = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists/${req.params.listId}`,
    {
      headers: {
        Authorization:
          "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
};

export const getSiteByIdListByIdItems = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists/${req.params.listId}/items`,
    {
      headers: {
        Authorization:
          "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
      params: {
        $expand: "fields",
      },
    }
  );

  res.status(response.status).json(response.data);
};

export const getSiteByIdListByIdItemById = async (req, res) => {
  const response = await axios.default.get(
    `https://graph.microsoft.com/v1.0/sites/${req.params.siteId}/lists/${req.params.listId}/items/${req.params.itemId}`,
    {
      headers: {
        Authorization:
          "Bearer " + (await getToken(tokenRequest)).accessToken,
      },
    }
  );

  res.status(response.status).json(response.data);
};
