var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ProductSchema = new mongoose.Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  status: {
    type: String,
    enum: [
      'DONE',
      'ACTIVE'
    ],
    required: true
  }
});

ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
