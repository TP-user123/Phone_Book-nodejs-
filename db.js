
const mongoose = require('mongoose');
const Connect = async () => {
    await mongoose.connect('mongodb://0.0.0.0:27017/phoneBook');
    

}

module.exports ={ Connect };