import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { 
    type: String, 
    unique: true, // Crea un índice unico
    required: true, 
    lowercase: true, 
    trim: true 
  },
    password: { type: String, required: true, select: false }, // 'select: false' por seguridad
    role: { type: String, default: 'user' },
    age: { type: Number },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true },
);
