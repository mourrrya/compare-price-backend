import { NextFunction, Request, Response } from "express";
import { getWebsites } from "../services/websiteServices";

 class WebsiteController {
    public async websites(req: Request, res: Response, next: NextFunction) {
        try {   
            const websites = await getWebsites();
            res.status(200).json({ websites });
        } catch (error) {
            next(error);
        }
    }
}

const websiteCtrl = new WebsiteController();

export { websiteCtrl };

