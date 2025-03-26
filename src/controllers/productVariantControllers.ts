import { NextFunction, Request, Response } from "express";
import { getVariants, productVariants } from "../services/productVariantServices";
import Variant from "@/models/variant";
import Product from "@/models/product";

class ProductVariantController {
    async productVariants(_req: Request, res: Response<Product[]>, next: NextFunction) {
        try {
            const variants = await productVariants();
            res.json(variants);
        } catch (error) {
            next(error);
        }
    }
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