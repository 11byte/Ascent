import { Router } from "express";
import { prisma } from "../utils/prisma.js";
const router = Router();
router.get("/students", async (_req, res) => {
    try {
        const interactions = await prisma.blogInteraction.findMany();
        const domainStats = interactions.reduce((acc, curr) => {
            if (!acc[curr.blogTitle])
                acc[curr.blogTitle] = 0;
            if (curr.interested)
                acc[curr.blogTitle] += 1;
            return acc;
        }, {});
        res.json({
            totalInteractions: interactions.length,
            blogInterestStats: domainStats,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Dashboard fetch failed" });
    }
});
export default router;
