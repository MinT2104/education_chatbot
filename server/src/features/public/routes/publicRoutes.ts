import { Router } from 'express'
import * as publicController from '../controllers/publicController'

const router = Router()

router.get('/languages', publicController.getLanguages)
router.get('/config', publicController.getConfig)

export default router


