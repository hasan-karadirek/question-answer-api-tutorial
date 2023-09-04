const searchHelper = (searchKey, query, req) => {
  if (req.query.search) {
    const searchOptions = {};
    const regex = new RegExp(req.query.search, 'i');
    searchOptions[searchKey] = regex;

    return query.where(searchOptions);
  }
  return query;
};

const populateHelper = (query, population) => {
  return query.populate(population);
};

const questionSortHelper = (query, req) => {
  const sortKey = req.query.sortBy;
  if (sortKey === 'most-answered') {
    query.sort('-answerCount -createdAt');
  }
  if (sortKey === 'most-liked') {
    query.sort('-likeCount -createdAt');
  } else {
    query.sort('-createdAt');
  }
  return query;
};
const paginationHelper = async (model, query, req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagination = {};
  let total = 0;
  const modelName = model.collection.collectionName;
  if (modelName === 'answers') {
    total = (await model.find().where({ question: req.params.id })).length;
  } else {
    total = await model.countDocuments(query.getQuery());
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit,
    };
  }

  return {
    query:
      modelName != 'answers'
        ? query.skip(startIndex).limit(limit)
        : query.find(
            { _id: req.params.id },
            { answers: { $slice: [startIndex, endIndex] } }
          ),
    pagination: pagination,
    total: total,
  };
};
module.exports = {
  searchHelper,
  populateHelper,
  questionSortHelper,
  paginationHelper,
};
