import express from "express";
import productController from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

import {
    createProductValidator
} from "../validators/product.validator.js";

const router = express.Router();

// ===== PRODUCTS =====

router.get(
    "/",
    productController.index
);

// ===== INVENTORY =====

router.get(
    "/inventory",
    productController.inventory
);

// ===== CREATE =====

router.get(
    "/create",
    productController.createPage
);

router.post(
    "/create",
    upload.single("image"),
    createProductValidator,
    productController.create
);

// ===== BUY PRODUCT =====

router.post(
    "/buy/:id",
    productController.buyProduct
);

// ===== EDIT =====

router.get(
    "/:id/edit",
    productController.editPage
);

router.post(
    "/:id/edit",
    upload.single("image"),
    createProductValidator,
    productController.update
);

// ===== DELETE =====

router.post(
    "/:id/delete",
    productController.delete
);

// ===== SHOW PRODUCT =====

router.get(
    "/:id",
    productController.show
);

export default router;