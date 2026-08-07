export const authorize = (role) => {
  console.log("role: ", role);

  return (req, res, next) => {
    if (req.user.role !== role) {
      return next({
        status: 403,
        message: "Forbidden",
      });
    }

    next();
  };
};
