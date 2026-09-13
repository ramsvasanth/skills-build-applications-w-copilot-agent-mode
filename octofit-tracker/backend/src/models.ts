import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
)

const activitySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0, default: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

const teamSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

const workoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
)

export const User = mongoose.model('User', userSchema)
export const Activity = mongoose.model('Activity', activitySchema)
export const Team = mongoose.model('Team', teamSchema)
export const Workout = mongoose.model('Workout', workoutSchema)
