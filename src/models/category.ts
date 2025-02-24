import { Model, DataTypes } from "sequelize";

import sequelize from "../config/database";

export class Category extends Model {
    public id!: number;
    public name!: string;
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Category",
        tableName: "categories",
        timestamps: true, // Set to true if you want createdAt and updatedAt fields
    }
);

(async () => {
    await Category.sync(); // This will create the table if it doesn't exist
    // Check for existing records
    const existingCategories = await Category.findAll();
    if (existingCategories.length === 0) {
        // Insert pre-defined data
        await Category.bulkCreate([
            { name: "vegetable" },
            { name: "fruit" },
        ]);
    }
})();

export default Category;
