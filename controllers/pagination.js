//make function for pagination
const pagination = (page, limit, data) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result = {};

  if (endIndex > data.length) {
    result.next = {
      //information for next page
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    result.previous = {
      // information for previous page
      page: page - 1,
      limit: limit,
    };
  }

  result.result = data.slice(startIndex, endIndex);
  return result;
};

export default pagination;