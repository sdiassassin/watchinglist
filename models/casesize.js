let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CaseSizeSchema = new Schema({
    cs_id:String,
    name:String,
    description:String,
    createdAt:Date,  //Time Stamp,
});

module.exports = mongoose.model('case_size', CaseSizeSchema);
