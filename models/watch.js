let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WatchSchema = new Schema({
    watch_id: String,
    user_id: String,
    title: String,
    description: String,
    sku: String,
    price: Number,
    thumbnails: Array,
    gender: String,
    movement: String,
    case_size: String,
    case_material: String,
    strap_material: String,
    brand: String,
    location: String,
    is_cert: Boolean,
    condition: String,
    age: String,
    is_box: Boolean,
    is_sold: Boolean,
    promote:String,//Start, Standard, Pro
    contact_name: String,
    contact_email: String,
    contact_phone: String,
    model: String,
    createdAt: Date  //Time Stamp
});

module.exports = mongoose.model('watch', WatchSchema);
