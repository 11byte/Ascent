import { Router } from "express";
import { generateRoadmap, getAllRoadmaps, getRoadmapById, getModuleResources } from "../controllers/roadmap.controller";
import { get } from "http";

const router = Router();

router.post("/generate", generateRoadmap);
router.get("/get/all", getAllRoadmaps);
router.get("/get/:id", getRoadmapById);
router.get("/module-resources", getModuleResources);
export default router;