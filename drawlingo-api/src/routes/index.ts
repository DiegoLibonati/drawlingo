import { Router } from "express";

import healthRoutes from "@/routes/v1/health.route";

const router = Router();

router.use("/health", healthRoutes);

export default router;
