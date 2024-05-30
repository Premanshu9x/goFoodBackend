require('dotenv').config();
const mongoose = require('mongoose');

//const mongoURI = 'mongodb+srv://premanshu:premanshu123@cluster0.tftnlx1.mongodb.net/gofoodmern?retryWrites=true&w=majority'

const MONGO_URL = process.env.MONGO_URL;

const mongoDB = async () => {
    await mongoose.connect(
        MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err)=>{
            if(err) {
                console.log(err);
            } else {
                console.log("Connected to DATABASE........");
                const fetched_data =  mongoose.connection.db.collection('food_items');
                fetched_data.find({}).toArray((err, data) =>{
                    if(err) console.log(err);
                    else {
                        console.log("Got Food Items");
                        global.food_items = data;
                    }
                })

                const fetched_data_1 =  mongoose.connection.db.collection('foodCategory');
                fetched_data_1.find({}).toArray((err, data) =>{
                    if(err) console.log(err);
                    else {
                        console.log("Got Food Category");
                        global.foodCategory = data;
                    }
                })
            }
        }
    );

}

module.exports = mongoDB;