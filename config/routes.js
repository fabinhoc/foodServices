const express = require('express')
const server = require('./server')
const userService = require('../api/users/userService')
const authService = require('../api/authentication/authService')

const router = express()

server.use('/api', router)

// ROUTES OPENS ( NOT AUTHENTICATION )
router.get('/teste', function(req, res){
	
    res.send('funcionou')
})

router.post('/authentication', authService.sigin)
router.post('/saveSocket', authService.saveSocket)
    
// MIDDLEWARE TO AUTHENTICATION
// router.use(authService.auth);

// ALL THE ROUTES IS AUTHENTICATED 
router.post('/users', userService.save)
router.get('/users', authService.auth, userService.findAll)
router.get('/user/:id', authService.auth, userService.findById)

module.exports = router;  

