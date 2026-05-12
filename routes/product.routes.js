import express from "express";
import productController from "../controllers/product.controller.js";
import upload from "../middleware/upload.js";

import {createProductValidator} from "../validators/product.validator.js";


const router = express.Router();

router.get("/", productController.index);

router.get("/:id/edit", productController.editPage);

router.post("/:id/edit",upload.single("image"), createProductValidator,  productController.update);

router.get("/create", productController.createPage);

router.post("/create", upload.single("image"),createProductValidator, productController.create);

router.get("/:id", productController.show);

router.post("/:id/delete", productController.delete);

export default router;