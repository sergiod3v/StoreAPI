require('dotenv').config();
//async errors
require('express-async-errors')
//DB Connection
const connectDB = require('./db/connect');

//Server initializing
const express = require('express');
const app = express();

const port = process.env.PORT || 3000
const baseURL = process.env.BASE_URL || '/api/v1'
//Routes
const productsRouter = require('./routers/products')
app.get(baseURL, (req, res) => {
  res.send(`
  <h1 style="color: blue">Store API</h1> 
  <a href="/api/v1/products">Products Page</a>
  `)
})

app.use(`${baseURL}/products`, productsRouter)

//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorMiddleware = require('./middleware/error');
app.use(express.json());
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const start = async () => {
  try {
    //connectDB
    await connectDB(process.env.MONGO_URI);
    console.log("Successfully connected to DB!")
    app.listen(port, console.log(`Server running on :${port}${baseURL}`))
  } catch (error) {
    console.error(error)
  }
}

start()
