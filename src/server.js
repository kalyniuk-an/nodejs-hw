import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());

app.use(notesRoutes);
// app.get('/notes', (req, res) => {
//   res.status(200).json({ "message": "Retrieved all notes" });
// });

// app.get('/notes/:noteId', (req, res) => {
//   const { noteId } = req.params;
//   res.status(200).json({ "message": `Retrieved note with ID: ${noteId}` });
// });

// app.get('/test-error', (req, res) => {
//   throw new Error('Something went wrong');
// });

app.use(notFoundHandler);

app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
