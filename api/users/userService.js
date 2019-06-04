const bcrypt = require('bcrypt-nodejs')
const server = require('../../config/server')
const User = require('./user')
const AuthService = require('../authentication/authService')

User.methods(['get','post','put','delete'])
User.updateOptions({ new:true, runValidators:true })

// SAVE USER AND CRYPT PASSWORD
const save = (req, res, next) => {

    const name      = req.body.name || ''
    const username  = req.body.username || ''
    const email     = req.body.email || ''
    const password  = req.body.password || ''

    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    User.find({$or:[ { email }, { username } ]}, function(err, user) {

        if(err)
            res.status(400).send({"error":true, "message": err.message})

        if(user != '')
            return res.status(400).send({"error": true, "message": "User already exist!"})
        
        const newUser = new User({ name, username, email, password: passwordHash })
        newUser.save((err, user) => {
            if (err)
                return res.status(400).send({"error":true, "message":err.message}) 
            
            token = AuthService.tokenGenerate({id: user.id})
            
            user.password = undefined

            res.json({ user, token });
        })
    });
}


// RETURN ALL USERS
const findAll = (req, res, next) => {
    User.find((err, users) => {
        if(err)
            res.status(400).send({"error":true, "message": err.message})
				
		res.json(users);
		
    });
}

// RETURN USER OBJECT 
const findById = (req, res, next) => {

    var id = req.params.id    
    
    User.findById(id, function (err, user) {
        if (err)
            res.status(400).send({"error":true, "message": err.message})
        
        res.json(user);
    });
}

// RETURN ONE USER
const findOne = (req, res, next) => {
   
    var params = req.body

    User.findOne({ params }, function(err, user) {
        if(err)
            res.status(400).send({"error":true, "message": err.message})

        res.json(user);
    });
}

module.exports = {save, findAll, findById, findOne}