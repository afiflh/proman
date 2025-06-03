const express = require("express");
const router = express.Router();
const { PurchaseOrderModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.post(
  "/api/v1/purchase-order/store",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.createPurchaseOrder")
  ],
  PurchaseOrderModule.store
);

router.get("/api/v1/purchase-order", [middleware.use('auth')], PurchaseOrderModule.getAll)

router.get("/api/v1/purchase-order/getProjectIdName", [middleware.use('auth')], PurchaseOrderModule.getProjectIdandName)

router.delete("/api/v1/purchase-order/:po_numb/delete", [middleware.use('auth')], PurchaseOrderModule.delete)

router.get("/api/v1/purchase-order/pendingProject", [middleware.use('auth')], PurchaseOrderModule.getPendingProjects)

// router.put(
//   "/api/v1/purchase-order/:po_number/update",
//   [
//     middleware.use("auth"),
//     ...decryptionMiddleware,
//     middleware.use("modeChecker"),
//     middleware.use("validator.updatePurchaseOrder")
//   ],
//   purchaseOrderModule.update
// );
router.put(
  "/api/v1/purchase-order/:po_number/edit",
  [
    middleware.use("auth"),
    ...decryptionMiddleware,
    middleware.use("modeChecker"),
    middleware.use("validator.updatePurchaseOrder")
  ],
  PurchaseOrderModule.update
);

module.exports = router;
