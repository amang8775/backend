const userController = require('../controller/userController')
const auth = require('../middlewares/auth')

const router = require('express').Router()


router.post('/register' , userController.register)
router.post('/login' , userController.login)
router.get('/refreshToken' , userController.refreshToken)
router.get('/info' ,auth ,  userController.getUser)
router.get('/logout'  ,  userController.logout)
router.get('/history'  ,auth ,   userController.history)


module.exports  = router