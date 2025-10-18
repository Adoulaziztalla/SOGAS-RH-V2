-- =====================================================
-- SEED DES PERMISSIONS EMPLOYEE
-- SOGAS-RH V2.0 - Module 2.3
-- Structure adaptée: resource + action
-- =====================================================

-- 1. INSERTION DES 4 PERMISSIONS EMPLOYEE
-- =====================================================
INSERT INTO Permission (id, resource, action, description, createdAt, updatedAt)
VALUES
    (UUID(), 'employee', 'create', 'Créer des employés dans le système', NOW(3), NOW(3)),
    (UUID(), 'employee', 'read', 'Consulter les informations des employés', NOW(3), NOW(3)),
    (UUID(), 'employee', 'update', 'Modifier les informations des employés', NOW(3), NOW(3)),
    (UUID(), 'employee', 'delete', 'Supprimer des employés du système', NOW(3), NOW(3));

-- 2. VÉRIFICATION POST-INSERTION
-- =====================================================
SELECT 
    '✅ PERMISSIONS EMPLOYEE CRÉÉES' AS statut,
    COUNT(*) AS nombre_permissions
FROM Permission
WHERE resource = 'employee';

-- 3. AFFICHER LES PERMISSIONS CRÉÉES
-- =====================================================
SELECT 
    id,
    CONCAT(resource, ':', action) AS permission_name,
    description,
    createdAt,
    updatedAt
FROM Permission
WHERE resource = 'employee'
ORDER BY 
    FIELD(action, 'create', 'read', 'update', 'delete');

-- 4. RÉSUMÉ GLOBAL
-- =====================================================
SELECT 
    (SELECT COUNT(*) FROM Permission) AS total_permissions,
    (SELECT COUNT(*) FROM Permission WHERE resource = 'employee') AS permissions_employee,
    (SELECT COUNT(*) FROM Role) AS total_roles,
    (SELECT COUNT(*) FROM RolePermission) AS total_associations;

-- =====================================================
-- NOTES IMPORTANTES
-- =====================================================
-- Les permissions utilisent le format:
--   resource = 'employee' 
--   action = 'create' | 'read' | 'update' | 'delete'
--
-- Dans le code TypeScript, référencer comme:
--   type PermissionName = `${string}:${string}`;
--   Exemples: 'employee:create', 'employee:read', etc.
--
-- Pour associer à un rôle ultérieurement:
--   INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
--   SELECT UUID(), 'ROLE_ID', p.id, NOW(3)
--   FROM Permission p
--   WHERE p.resource = 'employee' AND p.action = 'read';
-- =====================================================