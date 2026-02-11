import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('screenshots'));

// Ensure directories exist
const dirs = ['data', 'screenshots', 'logs'];
dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Brand Mention Generator API is running' });
});

// Import route handlers (will create these next)
import portalRoutes from './routes/portals';
import searchRoutes from './routes/search';
import resultsRoutes from './routes/results';

app.use('/api/portals', portalRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/results', resultsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Brand Mention Generator API running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});

export default app;
