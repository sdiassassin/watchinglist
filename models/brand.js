let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BrandSchema = new Schema({
    brand_id:String,
    name:String,
    description:String,
    createdAt:Date,  //Time Stamp,
});

module.exports = mongoose.model('brand', BrandSchema);
