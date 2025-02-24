import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Product extends Model {
  public id!: number;
  public website_id!: number;
  public category_id!: number;
  public name!: string;
  public actual_price!: number;
  public discounted_price!: number;
  public quantity!: string;
  public out_of_stock!: boolean;
  public img_url!: string;
  public last_scraped!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    website_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'websites',
        key: 'id',
      },
    },

    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    actual_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    discounted_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    out_of_stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    img_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    last_scraped: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true, // Set to true if you want createdAt and updatedAt fields
  }
);

export default Product;
