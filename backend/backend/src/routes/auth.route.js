import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { check } from '../controllers/check.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';


const router=Router()

router.post("/register",register)
router.post("/login",login)
router.get("/check",authMiddleware,check)

export default router;