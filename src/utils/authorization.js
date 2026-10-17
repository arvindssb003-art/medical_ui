export function hasRole(user, requiredRole) {
  const roleValues = [
    user?.role,
    ...(Array.isArray(user?.roles) ? user.roles : []),
    ...(Array.isArray(user?.authorities) ? user.authorities : []),
  ];

  return roleValues.some((role) => {
    const normalizedRole =
      typeof role === "string"
        ? role.replace(/^ROLE_/, "").toUpperCase()
        : "";
    return normalizedRole === requiredRole.toUpperCase();
  });
}
