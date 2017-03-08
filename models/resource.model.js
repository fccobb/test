var mongoose = require('mongoose');

var ResourceSchema = new mongoose.Schema({
  name: String,
  resource_type: String,
  resource_id: { type: mongoose.Schema.Types.ObjectId },
  filename: String,
  mime_type: String,
  size: String,
  original_name: String,  
  extension: String,
  log: [],
  download_link: String, //Should not actually stored in the Mongo collection. It's in the schema so we can fill it with temporary download location on request.
  created_by: { type: mongoose.Schema.Types.ObjectId},
  amended_by: { type: mongoose.Schema.Types.ObjectId},
  active: { type: Boolean, default: true }
}, {timestamps : { createdAt: 'created_at', updatedAt: 'updated_at' }});

module.exports = mongoose.model('Resource', ResourceSchema);
