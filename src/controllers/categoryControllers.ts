import { NextFunction, Request, Response } from "express";
import { getCategories } from "../services/categoryServices";

class CategoryController {
    public async categories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await getCategories();
            res.status(200).json({ categories });
        } catch (error) {
            next(error);
        }
    }
}

const CategoryCtrl = new CategoryController();

export { CategoryCtrl };

