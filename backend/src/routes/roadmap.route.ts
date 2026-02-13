import { Router } from "express";
import { generateRoadmap } from "../controllers/roadmap.controller";

const router = Router();

router.post("/generate", generateRoadmap);

export default router;