const express = require('express');
const app = express();
const port = 8000;

const db = require('./db')
const detailModel = require('./model');


app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

var result;

app.post('/search', async (req, res) => {
    let heading = "Phone Book";
    await db.Connect();

    const dispName = await detailModel.find({}, 'name phone_no email -_id').collation({ locale: 'en', strength: 1 }).sort({ name: 1 });
        let arr = dispName.map(item => item.name);
        let arr1 = dispName.map(item => item.phone_no);
        let arr2 = dispName.map(item => item.email);

    const name = req.body.search;
    const regex = new RegExp('^' + name, 'i');
    const DispName = await detailModel.find({name:{ $regex: regex }}, 'name phone_no email -_id').collation({ locale: 'en', strength: 1 }).sort({ name: 1 });
    let Arr = DispName.map(item => item.name);
    let Arr1 = DispName.map(item => item.phone_no);
    let Arr2 = DispName.map(item => item.email);

    res.render("index", {  heading,arr,arr1,arr2, Arr ,Arr1 ,Arr2 });
});

app.post('/update', async (req, res) => {
    await db.Connect();
   const name = req.body.name;
   const phone = req.body.phone;

   const Name = req.body.Name;
   const Phone = req.body.Phone;
   const Email = req.body.Email;
   
  console.log("enter in the update section ");
  console.log(name);
  console.log(phone);
  console.log(req.body);

  const filter = { name: name , phone_no: phone};
const update = { name: Name, phone_no: Phone,email:Email};

detailModel.updateOne(filter, update)
  .then(result => {
    console.log("Update successful");
    console.log('Update result:', result);
  })
  .catch(err => {
    console.error('Update error:', err);
  });
  res.redirect('/');

});

app.post('/delete', async (req, res) => {
    await db.Connect();
   const name = req.body.name;
   const phone = req.body.phone;
   

    try {
        // Assuming your detailModel has a method to delete data based on name and phone_no
        const deletedData = await detailModel.deleteOne({ name: name , phone_no: phone });
       
        if (deletedData.deletedCount === 1) {
            
            res.redirect('/');
        } else {
            // No data found to delete
            
            res.status(404).json({ success: false, message: 'Data not found for deletion' });
        }
    } catch (error) {
        // Error occurred while deleting data
        console.log("enter in catch");
        console.error('Error deleting data:', error);
        res.status(500).json({ success: false, message: 'Error deleting data' });
    }

    
});

app.post('/process', async (req, res) => {
    console.log(req.body);
    await db.Connect();
    const check = await detailModel.findOne({ $or: [{ name: req.body.name }, { phone_no: req.body.phone }]    
  });
    console.log("Check : ", check);
    if (check!= null) {
        res.status(400).send('Contact already exists');
        console.log('User exists');
    } else {
        let data = new detailModel({
            name: req.body.name,
            phone_no: req.body.phone,
            email: req.body.email
        });
        console.log("data = ", data);
        try {
            result = await data.save();
            console.log('Data saved successfully:', result);
            res.redirect('/');
        } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).send('Error saving data');
        }
    }

});

app.get('/' , async (req, res) => {
    let heading = "Phone Book";
   
    db.Connect();
   
    try {
        const dispName = await detailModel.find({}, 'name phone_no email -_id').collation({ locale: 'en', strength: 1 }).sort({ name: 1 });
        

        let arr = dispName.map(item => item.name);
        let arr1 = dispName.map(item => item.phone_no);
        let arr2 = dispName.map(item => item.email);
        let Arr = [];
       
        res.render("index", { heading, arr , arr1, arr2,Arr });
    } catch (err) {
        console.log("Error in displaying data: " + err)
    }
});




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
