var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imageURL: {
    type: String
  },
  description: {
    type: String
  },
  availableQuantity: {
    type: Number,
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: [
      'TECHNOLOGY',
      'CLOTHES',
      'JEWELRY',
      'FOOD',
      'SPORT',
      'TOYS',
      'HOME',
      'COSMETICS'
    ],
    required: true
  }
});

ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
