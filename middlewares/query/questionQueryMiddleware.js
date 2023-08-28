const Question = require('../../models/Question');
const {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper,
} = require('./queryMiddlewareHelpers');
const asyncHandler = require('express-async-handler');

const questionQueryMiddleware = function (model, options) {
  return asyncHandler(async function (req, res, next) {
    let query = model.find();

    query = searchHelper('title', query, req);

    if (options && options.population) {
      query = populateHelper(query, options.population);
    }
    query = questionSortHelper(query, req);

    const paginationResults = await paginationHelper(Question, query, req);
    query = paginationResults.query;

    const pagination = paginationResults.pagination;
    const queryResults = await query;
    res.queryResults = {
      success: true,
      count: paginationResults.total,
      pagination: pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = questionQueryMiddleware;
