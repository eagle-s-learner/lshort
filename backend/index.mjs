import express from 'express';
import dotenv from 'dotenv';
import urlRoute from './routes/url.mjs';
import connectMongoDB from './connectMongo.mjs';
import cors from 'cors';
import path from 'path';

dotenv.config();

const port = process.env.PORT || 8003;

const app = express();

app.use(cors());

app.use(express.json());


connectMongoDB(`mongodb+srv://satyam9242:${process.env.PASSWORD}@cluster0.cindy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => console.log("DB connected"))
.catch((error) => console.log(error))

// console.log(dotenv.config().parsed)
// console.log(process.env);

const _dirname = path.resolve();

app.use('/api', urlRoute);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (req, res) => {
    res.sendFile(_dirname, 'frontend', 'dist', 'index.html');
});

app.listen(port, () => {
    console.log(`Server runnging on PORT: ${port}`);
})