const Product = require('../models/product')
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {}

  if (featured) {
    queryObject.featured = featured ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    }
    //All available values to replace
    const regEx = /\b(<|>|<=|>=|=)\b/g
    //Replacing all values with any matching expression declared above
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
    //Fields allowed to be numericaly filtered
    const options = ['price', 'rating']
    //Formatted response separated in individual filter values
    filters = filters.split(',').forEach((item) => {
      //Destructuring from individual filter value
      const [field, operator, value] = item.split('-')
      //If field is allowed to be numerically filtered, add object to queryObject
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
      //Final format if accepted: { price: { '$gt': 40 }, rating: { '$gte': 4 } }
    });
  }

  console.log(queryObject)
  let result = Product.find(queryObject);
  //Sorting
  if (sort) {
    //converts "price,name" to "price name" so the method works as expected
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }
  //Specific fields
  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  //Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  /**
   * If page = 3 & limit = 10
   * skip = (3 - 1) * 10 = 20
   * so it will skip everything until 20
   * and render 10 because thats the limit
  */

  result.skip(skip).limit(limit);

  //Numeric Filtering

  const products = await result;

  res.status(200).json({ products, nbHits: products.length })
}

module.exports = {
  getAllProducts,
}