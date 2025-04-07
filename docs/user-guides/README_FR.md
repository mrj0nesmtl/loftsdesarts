# Guides d'Utilisateur

Ce répertoire contient des guides d'utilisateur complets pour les différents rôles interagissant avec la plateforme Lofts des Arts.

> **Dernière mise à jour :** 7 avril 2025

## Structure du Répertoire

- `/roles/` - Guides spécifiques aux rôles basés sur le niveau d'accès de l'utilisateur
  - `/super-admin/` - Guides pour administrateurs système
  - `/admin/` - Guides pour administrateurs de copropriété
  - `/manager/` - Guides pour gestionnaires d'immeuble
  - `/board-member/` - Guides pour membres du conseil
  - `/staff/` - Guides pour personnel de l'immeuble
  - `/doorman/` - Guides pour personnel de la réception
  - `/contractor/` - Guides pour prestataires de services externes
  - `/resident-owner/` - Guides pour propriétaires de condos
  - `/resident-tenant/` - Guides pour résidents locataires
  - `/guest/` - Guides pour visiteurs à accès limité
- `/features/` - Guides spécifiques aux fonctionnalités
  - `/messaging-system/` - Guides du système de messagerie
  - `/package-management/` - Guides de suivi des colis
  - `/document-management/` - Guides du système de documents
  - `/rbac/` - Guides du contrôle d'accès basé sur les rôles
- `/common/` - Guides généraux pour tous les utilisateurs

## Rôles d'Utilisateur

La plateforme Lofts des Arts implémente un système complet de Contrôle d'Accès Basé sur les Rôles (RBAC) avec les rôles suivants :

### Rôles Administratifs

| Rôle | Description | Niveau d'Accès |
|------|-------------|----------------|
| **SUPER_ADMIN** | Administrateur système avec accès complet | Accès complet au système, y compris la gestion des utilisateurs, la configuration du système et les paramètres techniques |
| **ADMIN** | Administrateur de copropriété | Accès complet à toutes les fonctionnalités de gestion de copropriété sauf la configuration technique du système |
| **MANAGER** | Gestionnaire d'immeuble | Accès complet aux fonctionnalités opérationnelles quotidiennes |
| **BOARD_MEMBER** | Membre du conseil de copropriété | Accès administratif limité avec accent sur les fonctionnalités de gouvernance |
| **STAFF** | Personnel de maintenance et de soutien | Accès à la gestion des demandes de service et données résidentielles limitées |
| **DOORMAN** | Personnel de la réception pour la gestion des colis | Accès à la gestion des colis et au registre des visiteurs |
| **CONTRACTOR** | Prestataire de services externe | Accès limité à des zones de service spécifiques et aux documents connexes |

### Rôles des Résidents

| Rôle | Description | Niveau d'Accès |
|------|-------------|----------------|
| **RESIDENT_OWNER** | Propriétaire de copropriété | Accès complet de résident avec privilèges supplémentaires pour les fonctions spécifiques à l'unité |
| **RESIDENT_TENANT** | Locataire résidant dans l'immeuble | Accès standard de résident aux ressources du bâtiment et à la communication |
| **GUEST** | Visiteur à accès limité | Accès restreint à des ressources spécifiques partagées par les résidents |

## Guides Spécifiques aux Rôles

Chaque rôle dispose d'un guide dédié qui couvre :

- Aperçu du rôle et responsabilités
- Fonctionnalités et autorisations disponibles
- Flux de travail et tâches courantes
- Meilleures pratiques et directives
- Dépannage et FAQ

Vous pouvez accéder au guide de chaque rôle ici :

- [Guide Super Admin](./roles/super-admin/README_FR.md) - Guide de l'administrateur système
- [Guide Admin](./roles/admin/README_FR.md) - Guide de l'administrateur de copropriété
- [Guide Gestionnaire](./roles/manager/README_FR.md) - Guide du gestionnaire d'immeuble
- [Guide Membre du Conseil](./roles/board-member/README_FR.md) - Guide du membre du conseil
- [Guide Personnel](./roles/staff/README_FR.md) - Guide du personnel de l'immeuble
- [Guide Portier](./roles/doorman/README_FR.md) - Guide du personnel de la réception
- [Guide Entrepreneur](./roles/contractor/README_FR.md) - Guide du prestataire de services externe
- [Guide Propriétaire Résident](./roles/resident-owner/README_FR.md) - Guide du propriétaire de condo
- [Guide Locataire Résident](./roles/resident-tenant/README_FR.md) - Guide du résident locataire
- [Guide Invité](./roles/guest/README_FR.md) - Guide du visiteur à accès limité

## Guides Spécifiques aux Fonctionnalités

Ces guides fournissent des informations détaillées sur des fonctionnalités spécifiques de la plateforme :

### Système de Messagerie

Le système de messagerie permet une communication en temps réel au sein de la communauté :

- [Aperçu de la Messagerie](./features/messaging-system/overview_FR.md)
- [Guide de Messagerie Directe](./features/messaging-system/direct-messaging_FR.md)
- [Guide des Conversations de Groupe](./features/messaging-system/group-conversations_FR.md)
- [Guide des Annonces](./features/messaging-system/announcements_FR.md)
- [Guide des Pièces Jointes](./features/messaging-system/attachments_FR.md)

### Gestion des Colis

Le système de suivi des colis simplifie la livraison et le ramassage des colis :

- [Aperçu du Système de Colis](./features/package-management/overview_FR.md)
- [Guide d'Enregistrement des Colis](./features/package-management/logging_FR.md)
- [Guide de Confirmation de Ramassage](./features/package-management/pickup_FR.md)
- [Guide des Notifications](./features/package-management/notifications_FR.md)
- [Guide de Suivi par Code QR](./features/package-management/qr-codes_FR.md)

### Gestion de Documents

Le système de documents permet un stockage et un partage sécurisés de fichiers importants :

- [Aperçu du Système de Documents](./features/document-management/overview_FR.md)
- [Guide de Gestion des Dossiers](./features/document-management/folders_FR.md)
- [Guide des Opérations de Fichiers](./features/document-management/files_FR.md)
- [Guide de Partage de Documents](./features/document-management/sharing_FR.md)
- [Guide de Contrôle d'Accès aux Documents](./features/document-management/access-control_FR.md)

### Contrôle d'Accès Basé sur les Rôles

Le système RBAC garantit un accès approprié à toutes les fonctionnalités de la plateforme :

- [Aperçu du Système RBAC](./features/rbac/overview_FR.md)
- [Guide de Structure des Permissions](./features/rbac/permissions_FR.md)
- [Guide de Gestion des Rôles](./features/rbac/role-management_FR.md)
- [Guide d'Audit d'Accès](./features/rbac/auditing_FR.md)

## Tâches Communes

Guides inter-rôles pour les fonctionnalités fréquemment utilisées :

- [Navigation dans le Tableau de Bord](./common/dashboard-navigation_FR.md)
- [Gestion de Profil](./common/profile-management_FR.md)
- [Paramètres de Notification](./common/notification-settings_FR.md)
- [Processus de Réinitialisation de Mot de Passe](./common/password-reset_FR.md)
- [Authentification à Deux Facteurs](./common/two-factor-authentication_FR.md)
- [Guide de l'Application Mobile](./common/mobile-app_FR.md)

## Fonctionnalités d'Accessibilité

La plateforme comprend plusieurs fonctionnalités d'accessibilité :

- Support de navigation au clavier
- Compatibilité avec les lecteurs d'écran
- Conformité de contraste de couleur
- Ajustement de la taille de police
- Texte alternatif pour les images

[Voir le Guide d'Accessibilité](./common/accessibility_FR.md)

## Support Linguistique

La plateforme prend en charge à la fois l'anglais et le français :

- Bascule de langue dans la navigation
- Éléments d'interface entièrement traduits
- Contenu spécifique à la langue
- Formulaires et messages d'erreur multilingues

[Voir le Guide Linguistique](./common/language-support_FR.md)

## Commentaires et Support

Les utilisateurs peuvent obtenir de l'aide supplémentaire via :

- La section d'aide dans le tableau de bord de la plateforme
- Support par email à support@loftsdesarts.com
- Documentation de support spécifique au rôle
- Ce guide d'utilisateur complet

Pour des demandes de fonctionnalités spécifiques ou des signalements de bugs, veuillez contacter votre administrateur d'immeuble.

---

[English Version](./README.md) 