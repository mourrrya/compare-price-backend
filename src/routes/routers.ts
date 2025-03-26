import { Router } from "express";
import productVariantRouter from "./productVariantRoutes";
import categoryRouter from "./categoryRoutes";
import websiteRouter from "./websiteRoutes";

const router = Router();

router.use("/api", productVariantRouter);
router.use("/api", categoryRouter);
router.use("/api", websiteRouter);

export { router };
