const mongoose= require('mongoose');

const connectDB= async(url)=>{
    try{
        const conn = await mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan)
    }catch(e){
        console.log(`Error: ${e.message}`.red)
        process.exit();
    }
}

module.exports = connectDB;

