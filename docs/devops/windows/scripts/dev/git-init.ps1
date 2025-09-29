<#
.SYNOPSIS
    Initialise un dépôt Git local et pousse sur GitHub (branche main).

.DESCRIPTION
    Ce script automatise la configuration initiale d'un dépôt Git pour le projet SOGAS-RH.
    Il effectue les opérations suivantes :
    - Vérification de l'installation de Git
    - Initialisation du dépôt Git local
    - Configuration de l'identité Git (user.name, user.email)
    - Création/vérification du fichier .gitignore
    - Premier commit
    - Configuration du remote origin (GitHub)
    - Push initial vers la branche main

.PARAMETER RepoUrl
    URL du dépôt GitHub (obligatoire).
    Exemples :
      - HTTPS : https://github.com/username/repo.git
      - SSH   : git@github.com:username/repo.git

.PARAMETER UserName
    Nom d'utilisateur Git pour les commits (optionnel).
    Exemple : "SOGAS Dev Team"

.PARAMETER UserEmail
    Email Git pour les commits (optionnel).
    Exemple : "dev@sogas.local"

.EXAMPLE
    # Initialisation avec HTTPS (nécessite un Personal Access Token)
    .\git-init.ps1 -RepoUrl "https://github.com/sogas-org/sogas-rh-v2.git" `
                   -UserName "SOGAS Dev" `
                   -UserEmail "dev@sogas.local"

.EXAMPLE
    # Initialisation avec SSH (nécessite une clé SSH configurée)
    .\git-init.ps1 -RepoUrl "git@github.com:sogas-org/sogas-rh-v2.git"

.NOTES
    Fichier     : git-init.ps1
    Projet      : SOGAS-RH V2.0
    Date        : 2025-09-29
    Auteur      : SOGAS DevOps Team
    Version     : 1.0

    IMPORTANT : Exécuter ce script depuis la RACINE du projet.
    La racine doit contenir les dossiers 'backend/', 'docs/', etc.

    PRÉREQUIS :
    -----------
    1. Git doit être installé : https://git-scm.com/downloads
       Vérifier avec : git --version

    2. Pour HTTPS :
       - Avoir un Personal Access Token (PAT) GitHub
       - Créer un PAT : Settings > Developer settings > Personal access tokens > Tokens (classic)
       - Permissions requises : repo (full control)
       - Git demandera username + PAT lors du push

    3. Pour SSH :
       - Avoir une clé SSH configurée sur GitHub
       - Vérifier avec : ssh -T git@github.com
       - Guide : https://docs.github.com/en/authentication/connecting-to-github-with-ssh

    4. Le dépôt GitHub doit exister (vide ou non) :
       - Créer via l'interface GitHub : https://github.com/new
       - OU via GitHub CLI : gh repo create sogas-org/sogas-rh-v2 --private

.LINK
    Documentation Git : https://git-scm.com/doc
    Documentation GitHub : https://docs.github.com
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true, HelpMessage = "URL du dépôt GitHub (HTTPS ou SSH)")]
    [ValidateNotNullOrEmpty()]
    [string]$RepoUrl,

    [Parameter(Mandatory = $false, HelpMessage = "Nom d'utilisateur Git pour les commits")]
    [string]$UserName,

    [Parameter(Mandatory = $false, HelpMessage = "Email Git pour les commits")]
    [string]$UserEmail
)

# ========================================
# CONFIGURATION
# ========================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$SCRIPT_VERSION = "1.0"
$PROJECT_NAME = "SOGAS-RH V2.0"
$DEFAULT_BRANCH = "main"
$COMMIT_MESSAGE = "chore: initial commit (SOGAS-RH V2.0)"

# Couleurs pour les messages
$COLOR_SUCCESS = "Green"
$COLOR_INFO = "Cyan"
$COLOR_WARNING = "Yellow"
$COLOR_ERROR = "Red"

# ========================================
# FONCTIONS UTILITAIRES
# ========================================

function Write-StepHeader {
    param([string]$Message)
    Write-Host "`n========================================" -ForegroundColor $COLOR_INFO
    Write-Host " $Message" -ForegroundColor $COLOR_INFO
    Write-Host "========================================" -ForegroundColor $COLOR_INFO
}

function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor $COLOR_SUCCESS
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor $COLOR_INFO
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor $COLOR_WARNING
}

function Write-ErrorMessage {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor $COLOR_ERROR
}

# ========================================
# ÉTAPE 1 : VÉRIFICATIONS PRÉALABLES
# ========================================

Write-StepHeader "ÉTAPE 1 : Vérifications préalables"

try {
    # Vérifier que Git est installé
    Write-Info "Vérification de l'installation de Git..."
    $gitVersion = git --version 2>$null
    
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($gitVersion)) {
        Write-ErrorMessage "Git n'est pas installé ou n'est pas dans le PATH."
        Write-Host ""
        Write-Host "Solution :" -ForegroundColor $COLOR_WARNING
        Write-Host "  1. Télécharger Git : https://git-scm.com/downloads" -ForegroundColor $COLOR_WARNING
        Write-Host "  2. Installer Git for Windows" -ForegroundColor $COLOR_WARNING
        Write-Host "  3. Redémarrer PowerShell" -ForegroundColor $COLOR_WARNING
        Write-Host "  4. Vérifier avec : git --version" -ForegroundColor $COLOR_WARNING
        exit 1
    }
    
    Write-Success "Git détecté : $gitVersion"
    
    # Vérifier que nous sommes à la racine du projet
    Write-Info "Vérification de l'emplacement du script..."
    $currentPath = Get-Location
    
    if (-not (Test-Path "backend" -PathType Container)) {
        Write-Warning "Le dossier 'backend/' n'a pas été trouvé."
        Write-Warning "Vous devez exécuter ce script depuis la RACINE du projet."
        Write-Host ""
        Write-Host "Structure attendue :" -ForegroundColor $COLOR_INFO
        Write-Host "  projet-racine/" -ForegroundColor $COLOR_INFO
        Write-Host "  ├── backend/" -ForegroundColor $COLOR_INFO
        Write-Host "  ├── docs/" -ForegroundColor $COLOR_INFO
        Write-Host "  ├── frontend/ (optionnel)" -ForegroundColor $COLOR_INFO
        Write-Host "  └── README.md" -ForegroundColor $COLOR_INFO
        Write-Host ""
        
        $continue = Read-Host "Continuer quand même ? (o/N)"
        if ($continue -ne "o" -and $continue -ne "O") {
            Write-Info "Arrêt du script."
            exit 0
        }
    }
    else {
        Write-Success "Emplacement correct : $currentPath"
    }
    
    # Validation du format de l'URL
    Write-Info "Validation de l'URL du dépôt..."
    $isHttps = $RepoUrl -match "^https://"
    $isSsh = $RepoUrl -match "^git@"
    
    if (-not $isHttps -and -not $isSsh) {
        Write-ErrorMessage "Format d'URL invalide."
        Write-Host "Formats acceptés :" -ForegroundColor $COLOR_WARNING
        Write-Host "  - HTTPS : https://github.com/username/repo.git" -ForegroundColor $COLOR_WARNING
        Write-Host "  - SSH   : git@github.com:username/repo.git" -ForegroundColor $COLOR_WARNING
        exit 1
    }
    
    if ($isHttps) {
        Write-Success "URL HTTPS détectée : $RepoUrl"
        Write-Info "Git demandera votre username et votre Personal Access Token (PAT) lors du push."
    }
    else {
        Write-Success "URL SSH détectée : $RepoUrl"
        Write-Info "Assurez-vous que votre clé SSH est configurée : ssh -T git@github.com"
    }
    
} catch {
    Write-ErrorMessage "Erreur lors des vérifications préalables : $_"
    exit 1
}

# ========================================
# ÉTAPE 2 : INITIALISATION DU DÉPÔT GIT
# ========================================

Write-StepHeader "ÉTAPE 2 : Initialisation du dépôt Git"

try {
    if (Test-Path ".git" -PathType Container) {
        Write-Warning "Le dépôt Git existe déjà (.git/ présent)."
        $reinit = Read-Host "Réinitialiser le dépôt ? Cela supprimera l'historique existant ! (o/N)"
        
        if ($reinit -eq "o" -or $reinit -eq "O") {
            Write-Info "Suppression du dossier .git existant..."
            Remove-Item -Path ".git" -Recurse -Force
            Write-Success "Ancien dépôt supprimé."
            
            Write-Info "Initialisation d'un nouveau dépôt Git..."
            git init
            Write-Success "Nouveau dépôt Git initialisé."
        }
        else {
            Write-Info "Conservation du dépôt existant."
        }
    }
    else {
        Write-Info "Initialisation du dépôt Git..."
        git init
        Write-Success "Dépôt Git initialisé."
    }
    
} catch {
    Write-ErrorMessage "Erreur lors de l'initialisation de Git : $_"
    exit 1
}

# ========================================
# ÉTAPE 3 : CONFIGURATION DE L'IDENTITÉ GIT
# ========================================

Write-StepHeader "ÉTAPE 3 : Configuration de l'identité Git"

try {
    if (-not [string]::IsNullOrWhiteSpace($UserName)) {
        Write-Info "Configuration de user.name : $UserName"
        git config user.name "$UserName"
        Write-Success "user.name configuré."
    }
    else {
        $currentName = git config user.name 2>$null
        if ([string]::IsNullOrWhiteSpace($currentName)) {
            Write-Warning "user.name non configuré. Utilisez -UserName ou configurez globalement."
        }
        else {
            Write-Success "user.name actuel : $currentName"
        }
    }
    
    if (-not [string]::IsNullOrWhiteSpace($UserEmail)) {
        Write-Info "Configuration de user.email : $UserEmail"
        git config user.email "$UserEmail"
        Write-Success "user.email configuré."
    }
    else {
        $currentEmail = git config user.email 2>$null
        if ([string]::IsNullOrWhiteSpace($currentEmail)) {
            Write-Warning "user.email non configuré. Utilisez -UserEmail ou configurez globalement."
        }
        else {
            Write-Success "user.email actuel : $currentEmail"
        }
    }
    
} catch {
    Write-ErrorMessage "Erreur lors de la configuration de l'identité Git : $_"
    exit 1
}

# ========================================
# ÉTAPE 4 : DÉFINITION DE LA BRANCHE PAR DÉFAUT
# ========================================

Write-StepHeader "ÉTAPE 4 : Définition de la branche par défaut"

try {
    Write-Info "Configuration de la branche par défaut : $DEFAULT_BRANCH"
    git branch -M $DEFAULT_BRANCH
    Write-Success "Branche par défaut configurée : $DEFAULT_BRANCH"
    
} catch {
    Write-ErrorMessage "Erreur lors de la définition de la branche : $_"
    exit 1
}

# ========================================
# ÉTAPE 5 : VÉRIFICATION/CRÉATION DU .GITIGNORE
# ========================================

Write-StepHeader "ÉTAPE 5 : Vérification du fichier .gitignore"

try {
    if (Test-Path ".gitignore" -PathType Leaf) {
        Write-Success "Le fichier .gitignore existe déjà à la racine."
        Write-Info "Contenu actuel :"
        Get-Content ".gitignore" | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
        if ((Get-Content ".gitignore" | Measure-Object -Line).Lines -gt 10) {
            Write-Host "  ..." -ForegroundColor Gray
        }
    }
    else {
        Write-Warning "Aucun .gitignore trouvé à la racine."
        Write-Info "Création d'un .gitignore minimal..."
        
        $gitignoreContent = @"
# ========================================
# GITIGNORE GLOBAL - SOGAS-RH V2.0
# ========================================

# IMPORTANT : Le backend possède déjà son propre backend/.gitignore
# Ce fichier sert uniquement pour la racine du projet

# Fichiers système
.DS_Store
Thumbs.db
desktop.ini

# Éditeurs
.vscode/
.idea/
*.swp
*.swo
*~

# Environnements virtuels Python (si à la racine)
venv/
env/
.env

# Logs généraux
*.log
logs/

# Fichiers de configuration locaux
*.local
config.local.*

# Sauvegardes temporaires
*.bak
*.tmp
*.temp

# Dossiers de build/dist (si présents)
dist/
build/

# Certificats et clés (ne JAMAIS committer)
*.pem
*.key
*.crt
*.p12
*.pfx

# Bases de données locales
*.db
*.sqlite
*.sqlite3
"@
        
        Set-Content -Path ".gitignore" -Value $gitignoreContent -Encoding UTF8
        Write-Success "Fichier .gitignore créé."
    }
    
    # Rappel concernant backend/.gitignore
    if (Test-Path "backend/.gitignore" -PathType Leaf) {
        Write-Success "Le fichier backend/.gitignore est présent (spécifique Python/Flask)."
    }
    else {
        Write-Warning "Le fichier backend/.gitignore est absent."
        Write-Warning "Pensez à créer backend/.gitignore pour ignorer __pycache__, venv/, .env, etc."
    }
    
} catch {
    Write-ErrorMessage "Erreur lors de la gestion du .gitignore : $_"
    exit 1
}

# ========================================
# ÉTAPE 6 : AJOUT DES FICHIERS AU STAGING
# ========================================

Write-StepHeader "ÉTAPE 6 : Ajout des fichiers au staging"

try {
    Write-Info "Ajout de tous les fichiers non-ignorés..."
    git add .
    
    $stagedFiles = git diff --cached --name-only | Measure-Object -Line
    Write-Success "$($stagedFiles.Lines) fichier(s) ajouté(s) au staging."
    
    if ($stagedFiles.Lines -eq 0) {
        Write-Warning "Aucun fichier à committer (tous ignorés ou déjà committés)."
        Write-Info "Vérifiez votre .gitignore ou ajoutez des fichiers au projet."
    }
    
} catch {
    Write-ErrorMessage "Erreur lors de l'ajout des fichiers : $_"
    exit 1
}

# ========================================
# ÉTAPE 7 : PREMIER COMMIT
# ========================================

Write-StepHeader "ÉTAPE 7 : Premier commit"

try {
    # Vérifier s'il y a déjà des commits
    $hasCommits = git rev-parse HEAD 2>$null
    
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrEmpty($hasCommits)) {
        Write-Warning "Le dépôt contient déjà des commits."
        $commitAgain = Read-Host "Créer un nouveau commit quand même ? (o/N)"
        
        if ($commitAgain -ne "o" -and $commitAgain -ne "O") {
            Write-Info "Pas de nouveau commit créé."
        }
        else {
            Write-Info "Création d'un nouveau commit..."
            git commit -m "$COMMIT_MESSAGE"
            Write-Success "Commit créé : $COMMIT_MESSAGE"
        }
    }
    else {
        Write-Info "Création du premier commit..."
        git commit -m "$COMMIT_MESSAGE"
        Write-Success "Premier commit créé : $COMMIT_MESSAGE"
    }
    
} catch {
    # Si le commit échoue (ex: rien à committer), ce n'est pas forcément une erreur fatale
    if ($_.Exception.Message -match "nothing to commit") {
        Write-Warning "Aucun changement à committer."
    }
    else {
        Write-ErrorMessage "Erreur lors du commit : $_"
        exit 1
    }
}

# ========================================
# ÉTAPE 8 : CONFIGURATION DU REMOTE ORIGIN
# ========================================

Write-StepHeader "ÉTAPE 8 : Configuration du remote origin"

try {
    # Vérifier si le remote origin existe déjà
    $existingRemote = git remote get-url origin 2>$null
    
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrEmpty($existingRemote)) {
        Write-Warning "Le remote 'origin' existe déjà : $existingRemote"
        
        if ($existingRemote -ne $RepoUrl) {
            Write-Info "Mise à jour de l'URL du remote origin..."
            git remote set-url origin $RepoUrl
            Write-Success "Remote origin mis à jour : $RepoUrl"
        }
        else {
            Write-Success "Le remote origin est déjà configuré correctement."
        }
    }
    else {
        Write-Info "Ajout du remote origin..."
        git remote add origin $RepoUrl
        Write-Success "Remote origin ajouté : $RepoUrl"
    }
    
    # Vérification finale
    $finalRemote = git remote get-url origin
    Write-Success "Remote origin configuré : $finalRemote"
    
} catch {
    Write-ErrorMessage "Erreur lors de la configuration du remote : $_"
    exit 1
}

# ========================================
# ÉTAPE 9 : PUSH VERS GITHUB
# ========================================

Write-StepHeader "ÉTAPE 9 : Push vers GitHub"

try {
    Write-Info "Push vers la branche $DEFAULT_BRANCH..."
    Write-Warning "Si vous utilisez HTTPS, Git va demander vos identifiants GitHub."
    Write-Warning "Username : votre nom d'utilisateur GitHub"
    Write-Warning "Password : votre Personal Access Token (PAT), PAS votre mot de passe !"
    Write-Host ""
    
    # Tentative de push
    git push -u origin $DEFAULT_BRANCH
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Push réussi vers origin/$DEFAULT_BRANCH !"
        Write-Host ""
        Write-Host "========================================" -ForegroundColor $COLOR_SUCCESS
        Write-Host " ✓ INITIALISATION GIT TERMINÉE AVEC SUCCÈS" -ForegroundColor $COLOR_SUCCESS
        Write-Host "========================================" -ForegroundColor $COLOR_SUCCESS
        Write-Host ""
        Write-Host "Votre dépôt est maintenant synchronisé avec GitHub." -ForegroundColor $COLOR_INFO
        Write-Host "URL du dépôt : $RepoUrl" -ForegroundColor $COLOR_INFO
        Write-Host ""
        Write-Host "Prochaines étapes :" -ForegroundColor $COLOR_INFO
        Write-Host "  1. Vérifier le dépôt sur GitHub" -ForegroundColor $COLOR_INFO
        Write-Host "  2. Configurer les protections de branche (si nécessaire)" -ForegroundColor $COLOR_INFO
        Write-Host "  3. Inviter les collaborateurs" -ForegroundColor $COLOR_INFO
        Write-Host "  4. Commencer à développer : git checkout -b feature/votre-fonctionnalite" -ForegroundColor $COLOR_INFO
    }
    else {
        throw "Le push a échoué avec le code d'erreur : $LASTEXITCODE"
    }
    
} catch {
    Write-ErrorMessage "Erreur lors du push : $_"
    Write-Host ""
    Write-Host "Solutions possibles :" -ForegroundColor $COLOR_WARNING
    Write-Host "  1. Vérifier que le dépôt GitHub existe et est accessible" -ForegroundColor $COLOR_WARNING
    Write-Host "  2. Pour HTTPS : vérifier que votre PAT est valide" -ForegroundColor $COLOR_WARNING
    Write-Host "  3. Pour SSH : vérifier votre clé SSH : ssh -T git@github.com" -ForegroundColor $COLOR_WARNING
    Write-Host "  4. Vérifier les permissions (push access) sur le dépôt" -ForegroundColor $COLOR_WARNING
    Write-Host "  5. Si le dépôt distant n'est pas vide, utiliser : git pull origin main --rebase" -ForegroundColor $COLOR_WARNING
    Write-Host ""
    exit 1
}

# ========================================
# FIN DU SCRIPT
# ========================================

Write-Host ""
Write-Host "Script terminé." -ForegroundColor $COLOR_INFO
Write-Host "Version : $SCRIPT_VERSION" -ForegroundColor Gray
exit 0