import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';

import wellsRoutes from './routes/wells.js';
import samplesRoutes from './routes/samples.js';
import alertsRoutes from './routes/alerts.js';
import usersRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/wells', wellsRoutes);
app.use('/samples', samplesRoutes);
app.use('/alerts', alertsRoutes);
app.use('/users', usersRoutes);


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
