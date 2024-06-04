

const mongoose = require('mongoose');


  const userSchema = new mongoose.Schema({
    
        name:  {  type: String,
            required: true,
            unique: true},  
        phone_no: {  type: String,
            required: true,
            unique: true},
        email: String
  
  });
 const detailModel = mongoose.model('detail', userSchema);


module.exports = detailModel;