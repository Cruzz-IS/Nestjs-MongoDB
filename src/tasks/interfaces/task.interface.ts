import { Document, ObjectExpressionOperatorReturningObject, ObjectId } from 'mongoose';

export interface ITask extends Document {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}
