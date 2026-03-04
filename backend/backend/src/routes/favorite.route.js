import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addFavorite, getFavorite, removeFavorite } from "../controllers/favorite.controller.js";

const router=Router();

router.post("/:propertyId",authMiddleware,addFavorite)
router.delete("/:propertyId",authMiddleware,removeFavorite)
router.get("/",authMiddleware,getFavorite)


export default router 