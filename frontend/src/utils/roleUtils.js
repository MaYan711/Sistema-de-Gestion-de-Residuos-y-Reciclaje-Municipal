export const getRoleName = (user) => {
  return (user?.rol_nombre || "").toLowerCase();
};

export const hasRole = (user, roles = []) => {
  const currentRole = getRoleName(user);
  return roles.map(r => r.toLowerCase()).includes(currentRole);
};