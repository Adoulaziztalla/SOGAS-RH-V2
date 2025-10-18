-- ============================================
-- PERMISSIONS RBAC - MODULE CONGÉS
-- ============================================
-- Fichier : backend/prisma/seeds/permissions-leave.sql
-- À exécuter manuellement ou via script seed
-- ============================================

-- ============================================
-- 1. PERMISSIONS POUR LES TYPES DE CONGÉS
-- ============================================

INSERT INTO Permission (id, resource, action, description, createdAt, updatedAt) VALUES
(UUID(), 'leave-type', 'read', 'Voir les types de congés', NOW(), NOW()),
(UUID(), 'leave-type', 'create', 'Créer un type de congé', NOW(), NOW()),
(UUID(), 'leave-type', 'update', 'Modifier un type de congé', NOW(), NOW()),
(UUID(), 'leave-type', 'delete', 'Supprimer un type de congé', NOW(), NOW()),
(UUID(), 'leave-type', 'manage', 'Gérer les types de congés (activer/désactiver)', NOW(), NOW());

-- ============================================
-- 2. PERMISSIONS POUR LES SOLDES DE CONGÉS
-- ============================================

INSERT INTO Permission (id, resource, action, description, createdAt, updatedAt) VALUES
(UUID(), 'leave-balance', 'read', 'Voir ses propres soldes de congés', NOW(), NOW()),
(UUID(), 'leave-balance', 'read-all', 'Voir tous les soldes de congés', NOW(), NOW()),
(UUID(), 'leave-balance', 'create', 'Créer/initialiser des soldes', NOW(), NOW()),
(UUID(), 'leave-balance', 'update', 'Modifier les soldes', NOW(), NOW()),
(UUID(), 'leave-balance', 'delete', 'Supprimer des soldes', NOW(), NOW()),
(UUID(), 'leave-balance', 'manage', 'Gérer les soldes (ajustements)', NOW(), NOW());

-- ============================================
-- 3. PERMISSIONS POUR LES DEMANDES DE CONGÉ
-- ============================================

INSERT INTO Permission (id, resource, action, description, createdAt, updatedAt) VALUES
(UUID(), 'leave-request', 'read', 'Voir ses propres demandes de congé', NOW(), NOW()),
(UUID(), 'leave-request', 'read-all', 'Voir toutes les demandes de congé', NOW(), NOW()),
(UUID(), 'leave-request', 'create', 'Créer une demande de congé', NOW(), NOW()),
(UUID(), 'leave-request', 'update', 'Modifier une demande (si PENDING)', NOW(), NOW()),
(UUID(), 'leave-request', 'delete', 'Supprimer une demande', NOW(), NOW()),
(UUID(), 'leave-request', 'approve', 'Approuver/rejeter des demandes', NOW(), NOW()),
(UUID(), 'leave-request', 'cancel', 'Annuler une demande', NOW(), NOW());

-- ============================================
-- 4. ATTRIBUTION DES PERMISSIONS AUX RÔLES
-- ============================================

-- ==================
-- RÔLE: ADMIN
-- ==================
-- L'ADMIN a TOUTES les permissions

INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT 
    UUID(),
    (SELECT id FROM Role WHERE name = 'ADMIN'),
    p.id,
    NOW()
FROM Permission p
WHERE p.resource IN ('leave-type', 'leave-balance', 'leave-request');

-- ==================
-- RÔLE: EMPLOYEE_MANAGER
-- ==================
-- Peut gérer les demandes et voir les soldes de son équipe

INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT 
    UUID(),
    (SELECT id FROM Role WHERE name = 'EMPLOYEE_MANAGER'),
    p.id,
    NOW()
FROM Permission p
WHERE 
    -- Types de congés : lecture seule
    (p.resource = 'leave-type' AND p.action = 'read')
    -- Soldes : lecture de tous, création, modification
    OR (p.resource = 'leave-balance' AND p.action IN ('read', 'read-all', 'create', 'update'))
    -- Demandes : toutes sauf delete
    OR (p.resource = 'leave-request' AND p.action IN ('read', 'read-all', 'create', 'approve', 'cancel'));

-- ==================
-- RÔLE: EMPLOYEE_VIEWER
-- ==================
-- Peut consulter ses propres congés et faire des demandes

INSERT INTO RolePermission (id, roleId, permissionId, assignedAt)
SELECT 
    UUID(),
    (SELECT id FROM Role WHERE name = 'EMPLOYEE_VIEWER'),
    p.id,
    NOW()
FROM Permission p
WHERE 
    -- Types de congés : lecture seule
    (p.resource = 'leave-type' AND p.action = 'read')
    -- Soldes : lecture de ses propres soldes uniquement
    OR (p.resource = 'leave-balance' AND p.action = 'read')
    -- Demandes : créer, lire les siennes, modifier (si PENDING), annuler
    OR (p.resource = 'leave-request' AND p.action IN ('read', 'create', 'update', 'cancel'));

-- ============================================
-- 5. VÉRIFICATION
-- ============================================

-- Compter les permissions créées
SELECT 
    resource,
    COUNT(*) as total_permissions
FROM Permission
WHERE resource IN ('leave-type', 'leave-balance', 'leave-request')
GROUP BY resource;

-- Vérifier les permissions par rôle
SELECT 
    r.name AS role_name,
    p.resource,
    p.action,
    p.description
FROM Role r
JOIN RolePermission rp ON r.id = rp.roleId
JOIN Permission p ON rp.permissionId = p.id
WHERE p.resource IN ('leave-type', 'leave-balance', 'leave-request')
ORDER BY r.name, p.resource, p.action;