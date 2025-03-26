import { Router } from "express";
import { websiteCtrl } from "../controllers/websiteControllers";

const websiteRouter = Router()

websiteRouter.get('/websites', websiteCtrl.websites);

export default websiteRouter;   