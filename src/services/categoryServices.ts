import Category from "../models/category";

export const getCategories = async () => {
    const categories = await Category.findAll();
    return categories;
}