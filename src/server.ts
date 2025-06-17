import express from 'express';
import routes from './route';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swagger.json';
import { connectDb } from './mongo';
import 'dotenv/config';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', routes);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});