const express = require('express')
const server = require('./server')
const userService = require('../api/users/userService')
const authService = require('../api/authentication/authService')

const router = express()
server.use('/api', router)

// ROUTES OPENS ( NOT AUTHENTICATION )
router.get('/', function(req, res){
    res.send('funcionou')
})

router.post('/authentication', authService.sigin)
    
// MIDDLEWARE TO AUTHENTICATION
router.use(authService.auth);

// ALL THE ROUTES IS AUTHENTICATED 
router.post('/users', userService.save)
router.get('/users', userService.findAll)
router.get('/user/:id', userService.findById)

module.exports = router;  

