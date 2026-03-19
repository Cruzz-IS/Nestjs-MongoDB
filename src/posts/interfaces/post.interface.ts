import { Document } from 'mongoose';

export interface IPost extends Document {
  readonly title: string;
  readonly content: string;
  readonly author: string; // ID del usuario
}