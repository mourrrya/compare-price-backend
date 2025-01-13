import express, { Request, Response } from 'express';
import cors from 'cors';
import sequelize from './config/database';
import Product from './models/Product';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'FastCommerce Rate Comparison' });
});

// Endpoint to get all products
app.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
