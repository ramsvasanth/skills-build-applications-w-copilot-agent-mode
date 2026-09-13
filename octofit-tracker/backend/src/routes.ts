import { Router } from 'express'
import { Activity, Team, User, Workout } from './models.js'

export const apiRouter = Router()

apiRouter.get('/users', async (_request, response, next) => {
  try {
    response.json(await User.find().select('-passwordHash').sort({ createdAt: -1 }))
  } catch (error) {
    next(error)
  }
})

apiRouter.post('/users', async (request, response, next) => {
  try {
    const user = await User.create(request.body)
    const safeUser = await User.findById(user._id).select('-passwordHash')
    response.status(201).json(safeUser)
  } catch (error) {
    next(error)
  }
})

apiRouter.get('/activities', async (_request, response, next) => {
  try {
    response.json(await Activity.find().populate('userId', 'name email').sort({ completedAt: -1 }))
  } catch (error) {
    next(error)
  }
})

apiRouter.post('/activities', async (request, response, next) => {
  try {
    response.status(201).json(await Activity.create(request.body))
  } catch (error) {
    next(error)
  }
})

apiRouter.get('/teams', async (_request, response, next) => {
  try {
    response.json(await Team.find().populate('memberIds', 'name email').sort({ name: 1 }))
  } catch (error) {
    next(error)
  }
})

apiRouter.post('/teams', async (request, response, next) => {
  try {
    response.status(201).json(await Team.create(request.body))
  } catch (error) {
    next(error)
  }
})

apiRouter.get('/leaderboard', async (_request, response, next) => {
  try {
    const leaderboard = await Activity.aggregate([
      { $group: { _id: '$userId', points: { $sum: '$points' }, activities: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', name: '$user.name', points: 1, activities: 1 } },
    ])
    response.json(leaderboard)
  } catch (error) {
    next(error)
  }
})

apiRouter.get('/workouts', async (_request, response, next) => {
  try {
    response.json(await Workout.find().sort({ createdAt: -1 }))
  } catch (error) {
    next(error)
  }
})

apiRouter.post('/workouts', async (request, response, next) => {
  try {
    response.status(201).json(await Workout.create(request.body))
  } catch (error) {
    next(error)
  }
})
