import express from 'express';
import bodyParser from 'body-parser';
import converterRouter from './routes/converter';

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

const PORT = 3000;

app.get('/ping', (_req, res) => {
  res.send('hi asdf ' + new Date().toLocaleDateString());
});

app.use('/api', converterRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
