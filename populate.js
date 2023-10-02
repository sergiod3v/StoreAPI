require('dotenv').config();

const connectDB = require('./db/connect');
const Product = require('./models/product')
const jsonProducts = require('./products.json')

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("DB connection successful");
    await Product.deleteMany();
    console.log("Old Documents Deleted");
    await Product.create(jsonProducts);
    console.log("DB population successful!");
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()