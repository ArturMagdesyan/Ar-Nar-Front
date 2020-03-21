const isValidRole = (roles, role) => {
  if(roles.indexOf('ALL') >= 0) return true;
  return roles.some((adminRole) => adminRole === role);
};

module.exports = { isValidRole };
