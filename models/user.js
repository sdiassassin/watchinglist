let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
    user_id:String,
    email:String,
    password:String,
    fname:{type:String,default:""},
    sname:{type:String,default:""},
    address1:{type:String,default:""},
    address2:{type:String,default:""},
    avatar:String,
    fb_link:String,
    tw_link:String,
    inst_link:String,
    createdAt:Date,  //Time Stamp,
    role:String
});

module.exports = mongoose.model('user', UserSchema);
