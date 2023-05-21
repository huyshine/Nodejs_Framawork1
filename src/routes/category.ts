import express, { Router } from "express";
import { create, get, getAll , remove, updatePatch } from "../controllers/category";

const router: Router = express.Router();


router.get("/categories", getAll);
router.get("/categories/:id", get);
router.post("/categories", create);
router.put("/categories/:id", updatePatch);
router.delete("/categories/:id", remove);

export default router;
