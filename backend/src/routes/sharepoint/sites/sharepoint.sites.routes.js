import { Router } from "express";
const router = Router();

// /api/sharepoint/sites

import * as sharepointSitesController from "../../../controllers/sharepoint/sites/sharepoint.sites.controller";

router.get("/:siteName", sharepointSitesController.getSiteByName);

router.get("/:siteId/lists", sharepointSitesController.getSiteByIdLists);

router.get(
  "/:siteId/lists/:listId",
  sharepointSitesController.getSiteByIdListById
);

router.get(
  "/:siteId/lists/:listId/items",
  sharepointSitesController.getSiteByIdListByIdItems
);

router.get(
  "/:siteId/lists/:listId/items/:itemId",
  sharepointSitesController.getSiteByIdListByIdItemById
);

export default router;
