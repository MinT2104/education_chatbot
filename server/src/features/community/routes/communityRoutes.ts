import { Router } from 'express'
import * as communityController from '../controllers/communityController'

const router = Router()

router.get('/posts', communityController.getPosts)
router.get('/posts/:id', communityController.getPostDetail)
router.post('/posts', communityController.createPost)
router.put('/posts/:id', communityController.updatePost)
router.delete('/posts/:id', communityController.deletePost)

export default router


