-- =====================================================
-- INSPECTION DE LA STRUCTURE DES TABLES
-- SOGAS-RH V2.0 - Diagnostic Module 2.3
-- =====================================================

-- 1. STRUCTURE COMPLÈTE DE LA TABLE PERMISSION
-- =====================================================
DESCRIBE Permission;

-- 2. STRUCTURE COMPLÈTE DE LA TABLE ROLE
-- =====================================================
DESCRIBE Role;

-- 3. STRUCTURE COMPLÈTE DE LA TABLE ROLEPERMISSION
-- =====================================================
DESCRIBE RolePermission;

-- 4. AFFICHER LES 5 PREMIÈRES PERMISSIONS (toutes colonnes)
-- =====================================================
SELECT * FROM Permission LIMIT 5;

-- 5. AFFICHER TOUS LES RÔLES (toutes colonnes)
-- =====================================================
SELECT * FROM Role;

-- 6. COMPTER LES ENREGISTREMENTS
-- =====================================================
SELECT 
    (SELECT COUNT(*) FROM Permission) AS total_permissions,
    (SELECT COUNT(*) FROM Role) AS total_roles,
    (SELECT COUNT(*) FROM RolePermission) AS total_associations;