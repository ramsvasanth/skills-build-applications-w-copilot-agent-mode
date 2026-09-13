import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectToDatabase } from './config.js'
import { Activity, Team, User, Workout } from './models.js'

async function seedDatabase(): Promise<void> {
  await connectToDatabase()

  await Promise.all([
    User.deleteMany({}),
    Activity.deleteMany({}),
    Team.deleteMany({}),
    Workout.deleteMany({}),
  ])

  const passwordHash = await bcrypt.hash('octofit-demo', 10)
  const users = await User.create([
    { name: 'Ada Lovelace', email: 'ada@example.com', passwordHash },
    { name: 'Grace Hopper', email: 'grace@example.com', passwordHash },
    { name: 'Katherine Johnson', email: 'katherine@example.com', passwordHash },
  ])

  await Team.create([
    { name: 'Code Sprinters', memberIds: [users[0]._id, users[1]._id] },
    { name: 'Orbit Crew', memberIds: [users[2]._id] },
  ])

  await Activity.create([
    { userId: users[0]._id, type: 'Running', durationMinutes: 30, points: 300 },
    { userId: users[0]._id, type: 'Strength training', durationMinutes: 45, points: 450 },
    { userId: users[1]._id, type: 'Cycling', durationMinutes: 40, points: 400 },
    { userId: users[2]._id, type: 'Yoga', durationMinutes: 25, points: 200 },
  ])

  await Workout.create([
    {
      title: 'Foundation Flow',
      description: 'A balanced mobility and bodyweight routine for building consistency.',
      difficulty: 'beginner',
      durationMinutes: 20,
    },
    {
      title: 'Cardio Intervals',
      description: 'Short running intervals to improve cardiovascular endurance.',
      difficulty: 'intermediate',
      durationMinutes: 30,
    },
    {
      title: 'Power Circuit',
      description: 'A challenging full-body circuit for experienced athletes.',
      difficulty: 'advanced',
      durationMinutes: 45,
    },
  ])

  const [userCount, activityCount, teamCount, workoutCount] = await Promise.all([
    User.countDocuments(),
    Activity.countDocuments(),
    Team.countDocuments(),
    Workout.countDocuments(),
  ])

  console.log(
    `Seeded octofit_db: ${userCount} users, ${activityCount} activities, ${teamCount} teams, ${workoutCount} workouts`,
  )
}

seedDatabase()
  .catch((error: unknown) => {
    console.error('Unable to seed octofit_db', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
