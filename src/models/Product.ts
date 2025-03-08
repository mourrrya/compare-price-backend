import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { fruitsWithoutDiffForms } from "../fruitList";
import { vegetablesWithoutDiffForms } from "../vegetableList";

class Product extends Model {
    public id!: number;
    public first_name!: string;
    public category_id!: number;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'categories',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
    }
);

(async () => {
    await Product.sync();
    const existingProducts = await Product.findAll();
    if (existingProducts.length === 0) {
        const data = [...fruitsWithoutDiffForms, ...vegetablesWithoutDiffForms];
        await Product.bulkCreate(data);
    }
})();

export default Product;