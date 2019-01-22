const restful = require('node-restful')
const mongoose = restful.mongoose


const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    name:       {type: String, required: true},
    username:   {type: String, required: true, unique: true},
    email:      {type: String, required: true, lowercase: true, unique: true},
    password:   {type: String, required:true, select:false},
    status:     {type: String, default: 'active', enum: ['active', 'inactive']},
    modules:    {type: Array, default: ['users']},
    createdAt:  {type:Date, default:Date.now},
    updatedAt:  {type:Date, default:Date.now}
})


module.exports = restful.model('User', userSchema)