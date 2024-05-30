require('dotenv').config();
const express = require('express');
const mongoDB = require('./db')
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;

const app = express();

mongoDB();
 
app.use(cors({
    origin: ["https://frolicking-bubblegum-009f5b.netlify.app"] 
}));

app.use((req,res,next)=>{

    res.setHeader("Access-Control-Allow-Origin", ["https://frolicking-bubblegum-009f5b.netlify.app"]);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})
app.use(express.json());
app.use('/api', require('./Routes/CreateUser'));

app.use('/api', require('./Routes/DisplayData'));
app.use('/api', require('./Routes/OrderData'));



app.use(express.static(path.join(__dirname, '../build')))  
app.get('*', function(req,res) {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})



app.listen(PORT, ()=>{
    console.log(`Server running on port 5000`);
})