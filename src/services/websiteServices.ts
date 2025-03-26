import Website from "../models/website";

export const getWebsites = async () => {
    const websites = await Website.findAll();
    return websites;
}