export const validateEmployeeQuery = (req, res, next) => {
  const requestedPage = Number(req.query.page);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const requestedLimit = Number(req.query.limit);
  const limit =
    Number.isInteger(requestedLimit) &&
    requestedLimit > 0 &&
    requestedLimit <= 100
      ? requestedLimit
      : 10;

  const search = req.query.search || "";

  if (search.length > 100) {
    return res.status(400).json({
      message: "Search must not exceed 100 characters",
    });
  }

  const allowedDepartments = ["IT", "HR", "Finance"];

  if (
    req.query.department &&
    !allowedDepartments.includes(req.query.department)
  ) {
    return res.status(400).json({
      message: "Invalid department",
    });
  }

  const department = req.query.department || "";

  const allowedSortFields = ["id", "first_name", "department"];
  const allowedOrders = ["asc", "desc"];

  const sort = allowedSortFields.includes(req.query.sort)
    ? req.query.sort
    : "id";

  const order = allowedOrders.includes(req.query.order?.toLowerCase())
    ? req.query.order.toLowerCase()
    : "asc";

  req.employeeQuery = {
    page,
    limit,
    search,
    department,
    sort,
    order,
  };

  next();
};
