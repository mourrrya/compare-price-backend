import { NextFunction, Request, Response } from "express";
import { getVariants } from "../services/productVariantServices";
import Variant from "@/models/variant";

class ProductVariantController {
    async getAllVariants(_req: Request, res: Response<Variant[]>, next: NextFunction) {
        try {
            const variants = await getVariants();
            res.json(variants);
        } catch (error) {
            next(error);
        }
    }
}

const ProductVariantCtrl = new ProductVariantController();

export { ProductVariantCtrl };