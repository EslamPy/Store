import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for products
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProductById(productId);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product', error });
    }
  });

  // API routes for categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching categories', error });
    }
  });

  // API routes for filtering & searching
  app.get('/api/products/category/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const products = await storage.getProductsByCategory(slug);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products by category', error });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
      }
      
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error searching products', error });
    }
  });

  // API routes for featured & discounted products
  app.get('/api/products/featured', async (req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching featured products', error });
    }
  });

  app.get('/api/products/discounted', async (req, res) => {
    try {
      const discountedProducts = await storage.getDiscountedProducts();
      res.json(discountedProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching discounted products', error });
    }
  });

  // API route for similar products
  app.get('/api/products/:id/similar', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 4;
      
      const similarProducts = await storage.getSimilarProducts(productId, limit);
      res.json(similarProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching similar products', error });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
