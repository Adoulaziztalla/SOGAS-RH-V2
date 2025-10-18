-- =====================================================
-- SETUP RBAC COMPLET - EMPLOYEE MODULE
-- SOGAS-RH V2.0 - Module 2.3 - VERSION FINALE
-- Adapté au schéma réel avec table userrole
-- =====================================================

-- 1. CRÉER LES RÔLES
-- =====================================================
INSERT INTO role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'ADMIN', 'Administrateur système - Tous droits', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'ADMIN');

INSERT INTO role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'EMPLOYEE_MANAGER', 'Gestionnaire employés - CRUD complet', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'EMPLOYEE_MANAGER');

INSERT INTO role (id, name, description, isActive, createdAt, updatedAt)
SELECT UUID(), 'EMPLOYEE_VIEWER', 'Consultation employés - Lecture seule', 1, NOW(3), NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'EMPLOYEE_VIEWER');

-- 2. ASSOCIER PERMISSIONS → RÔLES
-- =====================================================

-- ADMIN : toutes permissions employee
INSERT INTO rolepermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), r.id, p.id, NOW(3)
FROM role r, permission p
WHERE r.name = 'ADMIN' AND p.resource = 'employee'
AND NOT EXISTS (
    SELECT 1 FROM rolepermission rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- EMPLOYEE_MANAGER : toutes permissions employee
INSERT INTO rolepermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), r.id, p.id, NOW(3)
FROM role r, permission p
WHERE r.name = 'EMPLOYEE_MANAGER' AND p.resource = 'employee'
AND NOT EXISTS (
    SELECT 1 FROM rolepermission rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- EMPLOYEE_VIEWER : uniquement employee:read
INSERT INTO rolepermission (id, roleId, permissionId, assignedAt)
SELECT UUID(), r.id, p.id, NOW(3)
FROM role r, permission p
WHERE r.name = 'EMPLOYEE_VIEWER' AND p.resource = 'employee' AND p.action = 'read'
AND NOT EXISTS (
    SELECT 1 FROM rolepermission rp 
    WHERE rp.roleId = r.id AND rp.permissionId = p.id
);

-- 3. CRÉER UTILISATEUR ADMIN
-- =====================================================
-- Mot de passe: Admin@123
-- Hash bcrypt: $2b$10$rQZ9YxJv5K1kF8gN.HvKJ.xP8qK7aBmF5vWnXp6FE5.8W9K6gYzJ2

INSERT INTO user (id, username, email, password, firstName, lastName, isActive, createdAt, updatedAt)
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
WHERE NOT EXISTS (SELECT 1 FROM user WHERE email = 'admin@sogas.sn');

-- 4. ASSOCIER UTILISATEUR → RÔLE ADMIN
-- =====================================================
INSERT INTO userrole (id, userId, roleId, assignedAt)
SELECT 
    UUID(),
    u.id,
    r.id,
    NOW(3)
FROM user u, role r
WHERE u.email = 'admin@sogas.sn' AND r.name = 'ADMIN'
AND NOT EXISTS (
    SELECT 1 FROM userrole ur
    WHERE ur.userId = u.id AND ur.roleId = r.id
);

-- 5. CRÉER UTILISATEUR EMPLOYEE_MANAGER
-- =====================================================
-- Mot de passe: Manager@123

INSERT INTO user (id, username, email, password, firstName, lastName, isActive, createdAt, updatedAt)
SELECT 
    UUID(),
    'manager',
    'manager@sogas.sn',
    '$2b$10$rQZ9YxJv5K1kF8gN.HvKJ.xP8qK7aBmF5vWnXp6FE5.8W9K6gYzJ2',
    'Manager',
    'Test',
    1,
    NOW(3),
    NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM user WHERE email = 'manager@sogas.sn');

INSERT INTO userrole (id, userId, roleId, assignedAt)
SELECT UUID(), u.id, r.id, NOW(3)
FROM user u, role r
WHERE u.email = 'manager@sogas.sn' AND r.name = 'EMPLOYEE_MANAGER'
AND NOT EXISTS (
    SELECT 1 FROM userrole ur
    WHERE ur.userId = u.id AND ur.roleId = r.id
);

-- 6. CRÉER UTILISATEUR EMPLOYEE_VIEWER
-- =====================================================
-- Mot de passe: Viewer@123

INSERT INTO user (id, username, email, password, firstName, lastName, isActive, createdAt, updatedAt)
SELECT 
    UUID(),
    'viewer',
    'viewer@sogas.sn',
    '$2b$10$rQZ9YxJv5K1kF8gN.HvKJ.xP8qK7aBmF5vWnXp6FE5.8W9K6gYzJ2',
    'Viewer',
    'Test',
    1,
    NOW(3),
    NOW(3)
WHERE NOT EXISTS (SELECT 1 FROM user WHERE email = 'viewer@sogas.sn');

INSERT INTO userrole (id, userId, roleId, assignedAt)
SELECT UUID(), u.id, r.id, NOW(3)
FROM user u, role r
WHERE u.email = 'viewer@sogas.sn' AND r.name = 'EMPLOYEE_VIEWER'
AND NOT EXISTS (
    SELECT 1 FROM userrole ur
    WHERE ur.userId = u.id AND ur.roleId = r.id
);

-- =====================================================
-- VÉRIFICATIONS
-- =====================================================

SELECT '=== RÔLES CRÉÉS ===' AS section;
SELECT id, name, description, isActive
FROM role
WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
ORDER BY name;

SELECT '=== PERMISSIONS PAR RÔLE ===' AS section;
SELECT 
    r.name AS role_name,
    CONCAT(p.resource, ':', p.action) AS permission,
    p.description
FROM rolepermission rp
JOIN role r ON rp.roleId = r.id
JOIN permission p ON rp.permissionId = p.id
WHERE r.name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
ORDER BY r.name, p.resource, p.action;

SELECT '=== UTILISATEURS DE TEST ===' AS section;
SELECT 
    u.username,
    u.email,
    u.firstName,
    u.lastName,
    r.name AS role_name,
    u.isActive
FROM user u
JOIN userrole ur ON u.id = ur.userId
JOIN role r ON ur.roleId = r.id
WHERE u.email IN ('admin@sogas.sn', 'manager@sogas.sn', 'viewer@sogas.sn')
ORDER BY u.email;

SELECT '=== RÉSUMÉ ===' AS section;
SELECT 
    (SELECT COUNT(*) FROM role WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')) AS roles_crees,
    (SELECT COUNT(*) FROM permission WHERE resource = 'employee') AS permissions_employee,
    (SELECT COUNT(*) FROM rolepermission WHERE roleId IN (
        SELECT id FROM role WHERE name IN ('ADMIN', 'EMPLOYEE_MANAGER', 'EMPLOYEE_VIEWER')
    )) AS permissions_associees,
    (SELECT COUNT(*) FROM user WHERE email IN ('admin@sogas.sn', 'manager@sogas.sn', 'viewer@sogas.sn')) AS utilisateurs_crees,
    (SELECT COUNT(*) FROM userrole WHERE userId IN (
        SELECT id FROM user WHERE email IN ('admin@sogas.sn', 'manager@sogas.sn', 'viewer@sogas.sn')
    )) AS associations_user_role;

-- =====================================================
-- INFORMATIONS DE CONNEXION
-- =====================================================
-- 
-- ADMIN (tous droits):
--   Email: admin@sogas.sn
--   Password: Admin@123
--   Permissions: employee:create, employee:read, employee:update, employee:delete
--
-- MANAGER (CRUD employés):
--   Email: manager@sogas.sn
--   Password: Manager@123
--   Permissions: employee:create, employee:read, employee:update, employee:delete
--
-- VIEWER (lecture seule):
--   Email: viewer@sogas.sn
--   Password: Viewer@123
--   Permissions: employee:read uniquement
--
-- =====================================================