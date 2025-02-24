import Category from './category';
import Product from './product';
import Website from './website';

Website.hasMany(Product, { foreignKey: 'website_id' });
Product.belongsTo(Website, { foreignKey: 'website_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });