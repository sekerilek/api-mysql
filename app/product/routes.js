const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads" });
const ProductController = require("./controller");

router.get("/product", ProductController.index);

router.get("/product/:id", ProductController.view);

router.post("/product/", upload.single("image"), ProductController.store);

router.put("/product/:id", upload.single("image"), ProductController.update);

router.delete("/product/:id", ProductController.destroy);

router;
module.exports = router;
