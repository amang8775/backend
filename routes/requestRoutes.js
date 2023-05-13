const requestController = require('../controller/requestController')
const auth = require('../middlewares/auth')

const router = require('express').Router()


router.post('/addRequest' , auth , requestController.addRequest)
router.get('/getAllRequest'  , requestController.getAllRequest)
router.put('/donate/:requestId' , auth ,  requestController.donate )
router.put('/finalDonate/:requestId' , auth ,  requestController.finalDonate )



module.exports  = router