import express, { Router } from "express";
import { create, get, getAll, remove, updatePatch } from "../controllers/product";
import { authorization } from "../middlewares/authorization";
import { authenticate } from "../middlewares/authenticate";

const router: Router = express.Router();
router.get('/products', getAll);
router.get("/products/:id", get);
router.post("/products" , authenticate, authorization , create );
// router.patch("/products/:id",  restore)
router.put("/products/:id", authenticate, authorization ,  updatePatch)
router.delete("/products/:id", authenticate, authorization ,  remove)

export default router;