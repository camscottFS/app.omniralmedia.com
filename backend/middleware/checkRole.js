module.exports = function (requiredRoleId) {
  return function (req, res, next) {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (user.roleId !== requiredRoleId) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }

    next();
  };
};
