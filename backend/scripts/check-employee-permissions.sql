-- =====================================================
-- SCRIPT DE VÉRIFICATION DES PERMISSIONS EMPLOYEE
-- SOGAS-RH V2.0 - Module 2.3
-- =====================================================

-- 1. LISTER TOUTES LES PERMISSIONS EXISTANTES
-- =====================================================
SELECT 
    id,
    name,
    description,
    createdAt
FROM Permission
ORDER BY name;

-- 2. VÉRIFIER SPÉCIFIQUEMENT LES PERMISSIONS EMPLOYEE
-- =====================================================
SELECT 
    CASE 
        WHEN COUNT(*) = 4 THEN '✅ TOUTES LES PERMISSIONS EMPLOYEE EXISTENT'
        ELSE '❌ PERMISSIONS EMPLOYEE MANQUANTES'
    END AS statut,
    COUNT(*) AS nombre_permissions_trouvees
FROM Permission
WHERE name IN (
    'employee:create',
    'employee:read', 
    'employee:update',
    'employee:delete'
);

-- 3. DÉTAIL DES PERMISSIONS EMPLOYEE (SI EXISTANTES)
-- =====================================================
SELECT 
    name,
    description,
    createdAt,
    '✅ Existe' AS statut
FROM Permission
WHERE name IN (
    'employee:create',
    'employee:read',
    'employee:update', 
    'employee:delete'
)
ORDER BY name;

-- 4. IDENTIFIER LES PERMISSIONS MANQUANTES
-- =====================================================
SELECT 
    perm.name AS permission_manquante,
    '❌ À créer' AS statut
FROM (
    SELECT 'employee:create' AS name
    UNION SELECT 'employee:read'
    UNION SELECT 'employee:update'
    UNION SELECT 'employee:delete'
) AS perm
WHERE perm.name NOT IN (
    SELECT name FROM Permission
);

-- =====================================================
-- 5. SCRIPT D'INSERTION (À EXÉCUTER SI PERMISSIONS MANQUANTES)
-- =====================================================
-- ATTENTION : Décommenter et exécuter UNIQUEMENT si les permissions sont manquantes

/*
-- Insertion des permissions Employee
INSERT INTO Permission (id, name, description, createdAt, updatedAt)
VALUES
    (UUID(), 'employee:create', 'Créer des employés', NOW(), NOW()),
    (UUID(), 'employee:read', 'Consulter les employés', NOW(), NOW()),
    (UUID(), 'employee:update', 'Modifier les employés', NOW(), NOW()),
    (UUID(), 'employee:delete', 'Supprimer des employés', NOW(), NOW())
ON DUPLICATE KEY UPDATE 
    description = VALUES(description),
    updatedAt = NOW();

-- Vérification post-insertion
SELECT 
    name,
    description,
    createdAt,
    '✅ Créée avec succès' AS statut
FROM Permission
WHERE name IN (
    'employee:create',
    'employee:read',
    'employee:update',
    'employee:delete'
)
ORDER BY name;
*/

-- =====================================================
-- 6. VÉRIFIER LES ASSOCIATIONS RÔLE-PERMISSIONS
-- =====================================================
-- Voir quels rôles ont déjà accès aux permissions employee (si existantes)

SELECT 
    r.name AS role_name,
    p.name AS permission_name,
    rp.createdAt AS associe_le
FROM RolePermission rp
INNER JOIN Role r ON rp.roleId = r.id
INNER JOIN Permission p ON rp.permissionId = p.id
WHERE p.name LIKE 'employee:%'
ORDER BY r.name, p.name;

-- =====================================================
-- 7. COMPTEUR GLOBAL
-- =====================================================
SELECT 
    (SELECT COUNT(*) FROM Permission) AS total_permissions,
    (SELECT COUNT(*) FROM Permission WHERE name LIKE 'employee:%') AS permissions_employee,
    (SELECT COUNT(*) FROM Role) AS total_roles,
    (SELECT COUNT(*) FROM RolePermission WHERE permissionId IN (
        SELECT id FROM Permission WHERE name LIKE 'employee:%'
    )) AS associations_employee_permissions;