const express = require("express");
const router = express.Router();
const { CustomerModule } = require("../../modules");
const middleware = require("../../middleware");

const { MODE } = require("../../config/env");
const decryptionMiddleware = MODE === "development" ? [] : [middleware.use("decryption")];

router.get(
    "/api/v1/customer",
    [
        middleware.use("auth"),
    ],
    CustomerModule.getAll
)

router.get(
    "/api/v1/customer-project/:cust_id",
    [
        middleware.use("auth")
    ],
    CustomerModule.getCustomerProjects
)

router.post(
    "/api/v1/customer/store",
    [
        middleware.use("auth"),
        ...decryptionMiddleware,
        middleware.use("modeChecker"),
        middleware.use("validator.createCustomer")
    ],
    CustomerModule.store
)

router.put("/api/v1/customer/:cust_id/edit",
    [
        middleware.use("auth"),
        ...decryptionMiddleware,
        middleware.use("modeChecker"),
        middleware.use("validator.updateCustomer")
    ],
    CustomerModule.update
);

router.delete("/api/v1/customer/:cust_id/delete",
    [
        middleware.use("auth"),
    ],
    CustomerModule.delete
);

// router.get('/api/v1/comments/:tasklistId/:mode/get', [middleware.use('auth')], commentsModule.getByTasklist); // deprecated

module.exports = router;