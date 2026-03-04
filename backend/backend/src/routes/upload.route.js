import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";




const router= Router();


router.post("/",authMiddleware,uploadImage)
export default router;