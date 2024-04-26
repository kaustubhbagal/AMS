const express = require('express');
const app = express();
const port = process.env.port || 3000;

// MongoDB setup
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Model and databases
const mong = require("mongoose");
mong.connect("mongodb://127.0.0.1:27017/AMS",{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("database connected successfully done bro");
}).catch((e)=>{
    console.log("not bro");
})

app.use(express.static('public'));
app.use(express.static('external'));

// Middleware
app.use(express.urlencoded({ extended: true }));

// Set up EJS templating engine
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  // Render your HTML file with EJS
  res.render('index');
});

const db = mong.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

//table 1 = signUp
const contact=new mong.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
      type:String,
      required:true
  },
});
const contact_a = new mong.model("contact",contact)
module.exports  = contact_a;

// Handle form submission
app.post('/addData', async (req, res) => {
    try{
        const inserting = new contact_a({
            name:req.body.name,
            email:req.body.email,
            subject:req.body.subject,
            message:req.body.message,
        })
        const register1 = await inserting.save();
        res.status(201).render(index);
    }catch(error){
        res.status(400).send(error);
    }
});

//table 2 = admission_form
const product=new mong.Schema({
    product_name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    contact:{
        type:String,
        required:true
    }
});
const product_a = new mong.model("product",product)
module.exports  = product_a;

const userdetails = product_a.find({});

// Handle form submission
app.post('/registration_data', async (req, res) => {
    try{
        const inserting = new product_a({
            product_name:req.body.product_name,
            quantity:req.body.quantity,
            price:req.body.price,
            contact:req.body.contact,
        })
        const register2 = await inserting.save();
        res.status(201).render(index);
    }catch(error){
        res.status(400).send(error);
    }


});




// app.get('/registration_data', async (req, res) => {
//     try {
//         // Retrieve data from MongoDB using your model
//         const records = await Register_admission_form.find(); // Change this to your actual model

//         // Generate an HTML table dynamically
//         let tableHTML = '<table>';
//         tableHTML += '<thead><tr><th>College_name</th><th>Branch</th><th>Full_name</th><th>Fathers_name</th><th>Mothers_name</th><th>Date_of_birth</th><th>Candidate_type</th><th>Home_university</th><th>Category</th><th>Category_for_admission</th><th>Applied_for_EWS</th><th>Person_with_disability</th><th>Applied_tfws_seat</th><th>Defence_type</th><th>Is_orphan_candidate</th><th>Minority_candidate_type</th><th>Gender</th><th>fees_paid</th><th>Action</th></thead>';
//         tableHTML += '<tbody>';

//         // Loop through the records and add rows to the table
//         records.forEach((record) => {
//             tableHTML += <tr><td>${record.College_name}</td> <td>${record.Branch}</td> <td>${record.Full_name}</td> <td>${record.Fathers_name}</td> <td>${record.Mothers_name}</td> <td>${record.Date_of_birth}</td> <td>${record.Candidate_type}</td> <td>${record.Home_university}</td> <td>${record.Category}</td> <td>${record.Category_for_admission}</td> <td>${record.Applied_for_EWS}</td> <td>${record.Person_with_disability}</td> <td>${record.Applied_tfws_seat}</td> <td>${record.Defence_type}</td> <td>${record.Is_orphan_candidate}</td> <td>${record.Minority_candidate_type}</td> <td>${record.Gender}</td> <td>${record.fees_paid}</td><td><button onclick="deleteRecord('${record._id}')">Delete</button></td></tr>;
//             // Add more columns as needed
//         });

//         tableHTML += '</tbody></table>';

//         // Add a JavaScript function to handle record deletion
//         tableHTML += `
//             <script>
//                 function deleteRecord(id) {
//                     fetch('/delete_record/' + id, {
//                         method: 'DELETE'
//                     })
//                     .then(response => response.json())
//                     .then(data => {
//                         if (data.success) {
//                             // Reload the page or update the table as needed
//                             window.location.reload();
//                         } else {
//                             alert('Failed to delete the record.');
//                         }
//                     });
//                 }
//             </script>
//         `;

//         // Send the HTML table as the response
//         res.send(tableHTML);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

// Add a route to handle record deletion
app.delete('/delete_record/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Perform the deletion operation using your model
        await Register_admission_form.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});



// Start the server
app.listen(port, () => {
    console.log('Server(Website) is running');
  });