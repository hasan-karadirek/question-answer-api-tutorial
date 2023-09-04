const Answer = require('../../models/Answer');
const {
  paginationHelper,
  populateHelper,
} = require('./queryMiddlewareHelpers');
const asyncHandler = require('express-async-handler');

const answerQueryMiddleware = function (model, options) {
  return asyncHandler(async function (req, res, next) {
    const { id } = req.params;

    let query = model;
    const paginationResults = await paginationHelper(Answer, query, req);
    query = paginationResults.query;
    if (options && options.population) {
      query = populateHelper(query, options.population);
    }

    const pagination = paginationResults.pagination;
    const queryResults = await query;
    res.queryResults = {
      success: true,
      answerCount: paginationResults.total,
      pagination: pagination,
      data: queryResults,
    };
    next();
  });
};

module.exports = answerQueryMiddleware;
