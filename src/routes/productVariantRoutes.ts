import { Router } from "express";
import { ProductVariantCtrl } from "../controllers/productVariantControllers";

const productVariantRouter = Router()

productVariantRouter.get('/product-variants', ProductVariantCtrl.productVariants); 

productVariantRouter.get('/variants', ProductVariantCtrl.getAllVariants); 

export default productVariantRouter;
