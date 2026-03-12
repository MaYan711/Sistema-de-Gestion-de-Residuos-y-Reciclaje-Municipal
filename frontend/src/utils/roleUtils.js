export const getRoleName = (user) => {
  return (user?.rol_nombre || "").toLowerCase();
};

export const hasRole = (user, roles = []) => {
  const currentRole = getRoleName(user);
  return roles.map(r => r.toLowerCase()).includes(currentRole);
};

export const getDefaultRouteByRole = (user) => {
  const role = getRoleName(user);

  switch (role) {
    case "administrador":
      return "/dashboard";
    case "coordinador":
      return "/dashboard";
    case "operador":
      return "/operacion-reciclaje";
    case "ciudadano":
      return "/denuncias";
    case "auditor":
      return "/reportes-reciclaje";
    default:
      return "/login";
  }
};