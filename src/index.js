import 'dotenv/config';
import express from 'express';
import { logger } from './middlewares/logger.js';
import { notFound, errorHandler } from './middlewares/error.js';
import menuRouter from './routes/menu.routes.js';

const app = express();

app.use(express.json());
app.use(logger);
app.use('/menu', menuRouter);
app.use(notFound);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server berjalan di http://localhost:${port}`));
}

export { app };
export default app;
