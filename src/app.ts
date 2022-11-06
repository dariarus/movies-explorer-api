import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;

const runApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
  })
}

mongoose.connect('mongodb://localhost:27017/moviesdb', (err) => {
  if (err) {
    console.error('FAILED TO CONNECT TO MONGODB');
    console.error(err);
  } else {
    console.log('CONNECTED TO MONGODB');
  }
  runApp();
});


