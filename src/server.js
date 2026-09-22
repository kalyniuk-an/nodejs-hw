import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(cors());
app.use(
  pinoHttp({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

app.get('/notes', (reg, res) => {
  res.status(200).json({ "message": "Retrieved all notes" });
});

app.get('/notes/:noteId', (reg, res) => {
  const { noteId } = reg.params;
  res.status(200).json({ "message": `Retrieved note with ID: ${noteId}` });
});

app.get('/test-error', (reg, res) => {
  throw new Error('Somthing went wrong');
});

app.use((reg, res) => {
  res.status(404).json({ message: 'Routo noy found' });
});

app.use((err, reg, res, next) => {
  console.error('Error:', err.message);

  const isProd = process.env.NODE_ENV === "production";
  res.status(500).json({
    message: isProd
      ? 'Internal Server Error'
      : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
