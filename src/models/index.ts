import Category from './category';
import Product from './product';
import Variant from './variant';
import Website from './website';

Website.hasMany(Variant, { foreignKey: 'website_id' });
Variant.belongsTo(Website, { foreignKey: 'website_id' });

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

Category.hasMany(Variant, { foreignKey: 'category_id' });
Variant.belongsTo(Category, { foreignKey: 'category_id' });

Product.hasMany(Variant, { foreignKey: 'product_id' });
Variant.belongsTo(Product, { foreignKey: 'product_id' });
