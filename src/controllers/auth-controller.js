const authController = {};

authController.register = async (req, res, next) => {
  try {
    res.status(201).json({ message: 'Register successful' });
  } catch (error) {
    next(error);
  }
};

authController.login = async (req, res, next) => {
  try {
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = authController;
