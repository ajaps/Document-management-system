const paginate = (request) => {
  let limit = request.query.limit;
  const size = request.query.offset;
  if (!limit || limit < 1) {
    limit = 10;
  }
  if (!size || size < 1) {
    return [0, limit];
  }
  const offset = size;
  return [offset, limit];
};

const paginateResult = (data, query, type) => {
  const result = {};
  if (data.count > 0 && (data.rows).length > 0) {
    result.message = `${type} retrieved successfully`;
    result[type] = data.rows;
    result.pagination = {
      page: Math.floor(query.offset / query.limit) + 1,
      pageCount: Math.ceil(data.count / query.limit),
      pageSize: query.limit,
      totalCount: data.count,
    };
    return result;
  }
  result.message = `End of page - There are no ${type} on this page`;
  result[type] = data.rows;
  result.pagination = {
    page: Math.floor(query.offset / query.limit) + 1,
    pageCount: Math.ceil(data.count / query.limit),
    pageSize: query.limit,
    totalCount: data.count,
  };
  return result;
};

module.exports = {
  paginate,
  paginateResult,
};
