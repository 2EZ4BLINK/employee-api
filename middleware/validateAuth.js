export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();

  req.body.name = trimmedName;
  req.body.email = trimmedEmail;

  if (!trimmedName)
    return res.status(400).json({
      message: "Name is required",
    });

  if (!trimmedEmail)
    return res.status(400).json({
      message: "Email is required",
    });

  if (!password)
    return res.status(400).json({
      message: "Password is required",
    });

  if (password.length < 8)
    return res.status(400).json({
      message: "Password must be at least 8 characters",
    });

  next();
};
