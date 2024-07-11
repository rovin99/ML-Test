import express, { Express } from 'express';
import cors from 'cors';
import { AppDataSource } from "./config/data-source";
import rateLimit from 'express-rate-limit';
import v1Routes from './routes/v1';

const app = express();

app.use(cors());


app.use(express.json());
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100
});
app.use('/api/v1', apiLimiter,v1Routes);


AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}).catch((err) => {
    console.error("Error during Data Source initialization:", err);
});



