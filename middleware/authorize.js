export const authorize = (role) => {
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
