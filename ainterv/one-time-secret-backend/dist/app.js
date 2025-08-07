import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import secretRoutes from './routes/secretRoutes.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/health', (_, res) => res.send('OK'));
app.use('/api/secrets', secretRoutes);
export default app;
//# sourceMappingURL=app.js.map