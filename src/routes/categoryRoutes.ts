import { Router } from "express";
import { CategoryCtrl } from "../controllers/categoryControllers";

const categoryRouter = Router()

categoryRouter.get('/categories', CategoryCtrl.categories); 

export default categoryRouter;