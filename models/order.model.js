var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var OrderSchema = new mongoose.Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number
  }],
  status: {
    type: String,
    enum: [
      'DONE',
      'ACTIVE'
    ],
    default: 'ACTIVE'
  }
});

OrderSchema.plugin(mongoosePaginate);
const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
