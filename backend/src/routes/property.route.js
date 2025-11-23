import { Router } from 'express'
import { createProperty, deleteProperty, filtersProperty, getMyProperty, getOneProperty, getProperty, updateProperty } from '../controllers/property.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router=Router();

router.post("/",authMiddleware,createProperty)
router.get("/",getProperty)
router.get("/me",authMiddleware,getMyProperty)
router.get("/filter",filtersProperty);
router.get("/:propertyId",getOneProperty)
router.put("/:propertyId",authMiddleware,updateProperty)
router.delete("/:propertyId",authMiddleware,deleteProperty)
export default router;