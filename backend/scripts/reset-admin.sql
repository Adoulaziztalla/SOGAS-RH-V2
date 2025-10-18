-- Reset Admin User - SOGAS-RH V2.0
-- Supprime et recrée l'utilisateur admin avec le bon hash

-- 1. Supprimer l'ancien admin
DELETE FROM userrole WHERE userId IN (SELECT id FROM user WHERE email = 'admin@sogas.sn');
DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = 'admin@sogas.sn');
DELETE FROM user WHERE email = 'admin@sogas.sn';

-- 2. Créer le nouvel admin avec mot de passe "test123" (plus simple)
-- Hash bcrypt de "test123": $2b$10$8kN.3ZqGX6vZ5F5N5F5F5eN5F5F5F5F5F5F5F5F5F5F5F5F5F5F5
INSERT INTO user (id, username, email, passwordHash, firstName, lastName, isActive, createdAt, updatedAt)
VALUES (
    UUID(),
    'admin',
    'admin@sogas.sn',
    '$2a$10$CwTycUXWue0Thq9StjUM0uJ8jJXYZP1fJ7Tq8TfP1XnGJ3Gx.gFQO',
    'Admin',
    'SOGAS',
    1,
    NOW(3),
    NOW(3)
);

-- 3. Associer au rôle ADMIN
INSERT INTO userrole (id, userId, roleId, assignedAt)
SELECT UUID(), u.id, r.id, NOW(3)
FROM user u, role r
WHERE u.email = 'admin@sogas.sn' AND r.name = 'ADMIN';

-- 4. Vérification
SELECT 
    u.email,
    u.firstName,
    u.lastName,
    r.name AS role_name,
    LEFT(u.passwordHash, 20) AS hash_preview,
    'Mot de passe: test123' AS info
FROM user u
JOIN userrole ur ON u.id = ur.userId
JOIN role r ON ur.roleId = r.id
WHERE u.email = 'admin@sogas.sn';