const { Router } = require("express");
const multer = require("multer");

const uploadConfig = require("../configs/upload")
const FoodsController = require("../controllers/FoodsController");
const FoodAvatarController = require("../controllers/FoodAvatarController");

const foodsController = new FoodsController();
const foodAvatarController = new FoodAvatarController();
const foodsRoutes = Router();

const upload = multer(uploadConfig.MULTER);

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

foodsRoutes.use(ensureAuthenticated)

foodsRoutes.post("/", upload.single("avatarFood"), foodsController.create);
foodsRoutes.get("/:id", foodsController.show);
foodsRoutes.get("/", foodsController.index);
foodsRoutes.delete("/:id", foodsController.delete);
foodsRoutes.put("/:id", foodsController.update);
foodsRoutes.patch("/avatar/:id", upload.single("avatarFood"), foodAvatarController.update)

module.exports = foodsRoutes;