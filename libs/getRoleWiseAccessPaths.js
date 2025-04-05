export const getRoleWiseAccessPaths = (roles,permissions,paths) => {
    return roles.map((role) => {
      const rolePermissions = permissions
        .filter((perm) => perm.role_id === role.id && perm.can_access === 1)
        .map((perm) => {
          const path = paths.find((p) => p.pathID === perm.path_id);
          
          return path
            ? {
                pathId: path.pathID,
                pathName: path.pathName,
                name: path.name,
                mutable: perm.mutable ? 1:0,
                can_access:perm.can_access ? 1:0
              }
            : null;
        })
        .filter((path) => path !== null);
  
      return {
        roleID: role.id,
        roleName: role.name,
        paths: rolePermissions,
      };
    });
  };
  