var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  img_url: {
    type: String
  },
  description: {
    type: String
  },
  availableQuantity: {
    type: number,
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
    ]
  }
});

ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
