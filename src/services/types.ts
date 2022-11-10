import mongoose from 'mongoose';

export type TUser = {
  email: string,
  password: string,
  name: string,
};

export type TMovie = {
  country: string,
  director: string,
  duration: number,
  year: string,
  description: string,
  image: string,
  trailerLink: string,
  thumbnail: string,
  owner: mongoose.ObjectId,
  movieId: mongoose.ObjectId,
  nameRU: string,
  nameEN: string,
};
