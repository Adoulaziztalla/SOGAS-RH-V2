-- =====================================================
-- SETUP RBAC COMPLET POUR EMPLOYEE MODULE (VERSION FINALE)
-- SOGAS-RH V2.0 - Module 2.3
-- Adapté au schéma réel : colonne 'password' (pas 'passwordHash')
-- =====================================================

-- 1. CRÉER LES RÔLES
-- =====================================================
INSERT INTO Role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'ADMIN', 'Administrateur système avec tous les droits', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM Role WHERE name = 'ADMIN');

INSERT INTO Role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'EMPLOYEE_MANAGER', 'Gestionnaire des employés (CRUD complet)', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM Role WHERE name = 'EMPLOYEE_MANAGER');

INSERT INTO Role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'EMPLOYEE_VIEWER', 'Consultation des employés uniquement', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM Role WHERE name = 'EMPLOYEE_VIEWER');

-- 2. ASSOCIER LES PERMISSIONS AUX RÔLES
-- =====================================================

-- ADMIN : toutes les permissions employee
INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), (SELECT id FROM Role WHERE name = 'ADMIN' LIMIT 1), p.id, NOW(3)
FROM Permission p
WHERE p.resource = 'employee'
AND NOT EXISTS (
    SELECT 1 FROM RolePermission rp 
    WHERE rp.roleId = (SELECT id FROM Role WHERE name = 'ADMIN' LIMIT 1)
    AND rp.permissionId = p.id
);

-- EMPLOYEE_MANAGER : toutes les permissions employee
INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), (SELECT id FROM Role WHERE name = 'EMPLOYEE_MANAGER' LIMIT 1), p.id, NOW(3)
FROM Permission p
WHERE p.resource = 'employee'
AND NOT EXISTS (
    SELECT 1 FROM RolePermission rp 
    WHERE rp.roleId = (SELECT id FROM Role WHERE name = 'EMPLOYEE_MANAGER' LIMIT 1)
    AND rp.permissionId = p.id
);

-- EMPLOYEE_VIEWER : uniquement employee:read
INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), (SELECT id FROM Role WHERE name = 'EMPLOYEE_VIEWER' LIMIT 1), p.id, NOW(3)
FROM Permission p
WHERE p.resource = 'employee' AND p.action = 'read'
AND NOT EXISTS (
    SELECT 1 FROM RolePermission rp 
    WHERE rp.roleId = (SELECT id FROM Role WHERE name = 'EMPLOYEE_VIEWER' LIMIT 1)
    AND rp.permissionId = p.id
);

-- 3. CRÉER LES UTILISATEURS DE TEST
-- =====================================================
-- Note: Mot de passe hashé avec bcrypt pour 'Admin@123'
-- Hash: $2b$10$rQZ9YxJv5K1kF8gN.HvKJ.xP8qK7aBmF5vWnXp6FE5.8W9K6gYzJ2

-- Utilisateur ADMIN
INSERT INTO User (
    id, username, email, password, firstName, lastName, isActive, createdAt, updatedAt
)
SELECT 
    UUID(),
    'admin',
    'admin@sogas.sn',
    '$2b$10$rQZ9YxJv5K1kF8gN.HvKJ.xP8qK7aBmF5vWnXp6FE5.8W9K6gYzJ2',
    'Admin',
    'SOGAS',
    1,
    NOW(3),
    NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM User WHERE email = 'admin@sogas.sn');

-- Associer le rôle ADMIN
UPDATE User 
SET username = 'admin'
WHERE email = 'admin@sogas.sn' AND username IS NULL;

-- Note: La table User n'a pas de colonne roleId visible dans le DESCRIBE
-- Il faut vérifier s'il y a une table de liaison UserRole

-- 4. VÉRIFICATIONS
-- =====================================================

SELECT '=== RÔLES CRÉÉS ===' AS section;
SELECT id, name, description, isActive, createdAt
FROM Role
WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
ORDER BY name;

SELECT '=== PERMISSIONS PAR RÔLE ===' AS section;
SELECT 
    r.name AS role_name,
    CONCAT(p.resource, ':', p.action) AS permission,
    p.description
FROM RolePermission rp
JOIN Role r ON rp.roleId = r.id
JOIN Permission p ON rp.permissionId = p.id
WHERE r.name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
ORDER BY r.name, p.resource, p.action;

SELECT '=== UTILISATEUR ADMIN ===' AS section;
SELECT id, username, email, firstName, lastName, isActive
FROM User
WHERE email = 'admin@sogas.sn';

SELECT '=== RÉSUMÉ ===' AS section;
SELECT 
    (SELECT COUNT(*) FROM Role WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')) AS roles_crees,
    (SELECT COUNT(*) FROM Permission WHERE resource = 'employee') AS permissions_employee,
    (SELECT COUNT(*) FROM RolePermission WHERE roleId IN (
        SELECT id FROM Role WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
    )) AS associations_totales,
    (SELECT COUNT(*) FROM User WHERE email = 'admin@sogas.sn') AS utilisateur_admin_cree;

-- =====================================================
-- INFORMATIONS DE CONNEXION
-- =====================================================
-- Email: admin@sogas.sn
-- Mot de passe: Admin@123
-- 
-- IMPORTANT: Si la table User n'a pas de colonne roleId,
-- vérifiez l'existence d'une table UserRole pour associer
-- l'utilisateur au rôle ADMIN
-- =====================================================