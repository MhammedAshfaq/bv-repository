import { useCallback } from "react";

export type Permission = "CREATE_RULE" | "UPDATE_RULE" | "DELETE_RULE" | (string & {});

export interface UsePermissionsOptions {
  permissions?: readonly Permission[];
}

const defaultPermissions: readonly Permission[] = ["CREATE_RULE", "UPDATE_RULE", "DELETE_RULE"];

export function usePermissions({ permissions = defaultPermissions }: UsePermissionsOptions = {}) {
  const hasPermission = useCallback(
    (permission: Permission) => permissions.includes(permission),
    [permissions],
  );
  return { hasPermission, permissions };
}
