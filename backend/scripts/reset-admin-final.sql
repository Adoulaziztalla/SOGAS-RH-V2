-- Reset complet utilisateur admin
DELETE FROM userrole WHERE userId IN (SELECT id FROM user WHERE email = 'admin@sogas.sn');
DELETE FROM session WHERE userId IN (SELECT id FROM user WHERE email = 'admin@sogas.sn');
DELETE FROM user WHERE email = 'admin@sogas.sn';

-- Créer admin (mot de passe: test123)
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

-- Associer au rôle ADMIN
INSERT INTO userrole (id, userId, roleId, assignedAt)
SELECT UUID(), u.id, r.id, NOW(3)
FROM user u, role r
WHERE u.email = 'admin@sogas.sn' AND r.name = 'ADMIN';

-- Vérification
SELECT u.email, r.name AS role, COUNT(p.id) AS permissions_count
FROM user u
JOIN userrole ur ON u.id = ur.userId
JOIN role r ON ur.roleId = r.id
JOIN rolepermission rp ON r.id = rp.roleId
JOIN permission p ON rp.permissionId = p.id
WHERE u.email = 'admin@sogas.sn'
GROUP BY u.email, r.name;