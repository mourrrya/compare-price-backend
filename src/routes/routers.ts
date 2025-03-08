import { Router } from "express";
import productVariantRouter from "./productVariantRoutes";

const router = Router();

router.use("/", productVariantRouter);

export { router };
