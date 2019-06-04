const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const server = require('../../config/server');

const User = require('../users/user');
const authHash = require('../../config/auth.json');

const sigin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password
	
    User.findOne({ email }, function (err, user) {

        if(err)
            return res.status(400).send({"error":true, "message":err.message})

        if(!user)
            return res.status(404).send({"error":true, "message":"User/password incorrect!"})


		bcrypt.compare(password, user.password, function(err, isPasswordMatch) {
			
			if (err) 
				return res.status(404).send({"error":true, "message":"User not found!"})
			
			if (!isPasswordMatch)
				return res.status(404).send({"error":true, "message":"User/password incorrect!"})
			
			user.password = undefined

			token = tokenGenerate({id: user.id})
				
			return res.json({ user, token });	 
			// return callback(null, isPasswordMatch);
		});

        // if(!bcrypt.compare(password, user.password))
        //     return res.status(400).send({"error":true, "message":"Invalid password!"})

        

    }).select('+password');
   
}

const tokenGenerate = (params = {}) => {

    return jwt.sign(params, authHash.secret, {
        expiresIn: 604800,
    })

}

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).send({"error":true, "message":"No token provided!"})
    
    const parts = authHeader.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({"error":true, "message":"Token error!"});

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({"error":true, "message":"Token bad formatted!"})

    jwt.verify(token, authHash.secret, (err, decoded) => {
        if (err) 
            return res.status(401).send({"error":true, "message":"Invalid Token!"});

        req.userId = decoded.id;
        return next()
    })
}

const saveSocket = (req, res, next) => {

	let userId = req.body.userId;
    let socketId = req.body.socketId;

	User.findById(userId, function (err, user) {
        if (err)
            res.status(400).send({"error":true, "message": err.message})
        
        User.updateOne({_id: userId}, {$set: {socketId:socketId}}, (err, user) => {
			if (err)
				return res.status(400).send({"error":true, "message": err.message})
			else 
				return res.status(200).send({"error":false, "message": user})
		}) 
    });
}

module.exports = {sigin, tokenGenerate, auth, saveSocket}