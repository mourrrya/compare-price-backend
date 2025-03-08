import express, { Request, Response } from 'express';
import cors from 'cors';
import sequelize from './config/database';
import './models/product';
import './models/variant';
import './models/website';
import "./models/index";
import { router } from './routes/routers';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize database
sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch(err => {
  console.error('Error synchronizing database:', err);
});

app.use("/", router);

// Endpoint to get all products
app.get('/products', async (_req: Request, res: Response) => {
  res.send("Hello World!");
  // try {
  //   const products = await Product.findAll();
  //   res.json(products);
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to fetch products' });
  // }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
