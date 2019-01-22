const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../users/user');
const authHash = require('../../config/auth.json');

const sigin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password
    
    User.findOne({ email, password }, function (err, user) {
        
        if(err)
            return res.status(400).send({"error":true, "message":err.message})

        if(!user)
            return res.status(404).send({"error":true, "message":"User not found!"})

        if(!bcrypt.compare(password, user.password))
            return res.status(400).send({"error":true, "message":"Invalid password!"})

        user.password = undefined

        token = tokenGenerate({id: user.id})

        res.send({ user, token });

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

module.exports = {sigin, tokenGenerate, auth}