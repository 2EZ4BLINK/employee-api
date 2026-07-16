export const validateEmployee = async (req, res, next) => {
  const { first_name, last_name, email, department, salary } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedFirstName = first_name?.trim();
  const trimmedLastName = last_name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedDepartment = department?.trim();
  const convertedSalary = Number(salary);

  req.body.first_name = trimmedFirstName;
  req.body.last_name = trimmedLastName;
  req.body.email = trimmedEmail;
  req.body.department = trimmedDepartment;
  req.body.salary = convertedSalary;

  if (
    !trimmedFirstName ||
    !trimmedLastName ||
    !trimmedEmail ||
    !trimmedDepartment ||
    salary == null
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  if (Number.isNaN(convertedSalary) || convertedSalary <= 0) {
    return res.status(400).json({
      message: "Salary must be a positive number.",
    });
  }

  next();
};
