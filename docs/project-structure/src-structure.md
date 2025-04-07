# Source Code Structure

*Last Updated: 2025-04-07*

Next.js application source code including components, pages, and API routes

```
/Users/mrjones/Local/Github/loftsdesarts/src
├── app
│   ├── (pages)
│   │   ├── about
│   │   │   └── page.tsx
│   │   ├── contact
│   │   │   ├── actions.ts
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── gallery
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── portfolio
│   │       ├── [slug]
│   │       │   └── page.tsx
│   │       └── page.tsx
│   ├── admin
│   │   ├── analytics
│   │   │   └── page.tsx
│   │   ├── dashboard
│   │   │   └── page.tsx
│   │   ├── documents
│   │   │   └── page.tsx
│   │   ├── dropbox
│   │   │   └── page.tsx
│   │   ├── inquiries
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── messaging
│   │   │   ├── [conversationId]
│   │   │   │   ├── ConversationDetails.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── metadata.ts
│   │   │   ├── new
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── packages
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── residents
│   │   │   └── page.tsx
│   │   ├── settings
│   │   │   ├── metadata.ts
│   │   │   └── page.tsx
│   │   └── website
│   │       └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── callback
│   │   │   │   └── route.ts
│   │   │   └── signout
│   │   │       └── route.ts
│   │   ├── thumbnail
│   │   │   └── route.ts
│   │   └── webhooks
│   │       └── contact
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── supabase
│       ├── fix_folders.sql
│       ├── policies.sql
│       └── simplified-policies.sql
├── components
│   ├── admin
│   │   ├── AdminNav.tsx
│   │   ├── ClientAdminLayout.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── UserAvatar.tsx
│   │   └── WelcomeMessage.tsx
│   ├── auth
│   │   └── LoginForm.tsx
│   ├── documents
│   │   ├── DocumentGrid.tsx
│   │   ├── DocumentUploader.tsx
│   │   ├── DocumentViewer.tsx
│   │   └── FolderExplorer.tsx
│   ├── forms
│   │   └── ContactForm.tsx
│   ├── icons.tsx
│   ├── layout
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── RootLayout.tsx
│   ├── layouts
│   │   └── AdminLayout.tsx
│   ├── messaging
│   │   ├── ConversationItem.tsx
│   │   ├── ConversationList.tsx
│   │   ├── DateSeparator.tsx
│   │   ├── Message.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── MessageThread.tsx
│   │   └── NewConversationModal.tsx
│   ├── packages
│   │   ├── BarcodeScanner.tsx
│   │   ├── PackageRegistrationForm.tsx
│   │   └── QRCodeGenerator.tsx
│   ├── residents
│   │   └── UnitManagement.tsx
│   ├── sections
│   │   └── NewsletterSection.tsx
│   └── ui
│       ├── Card.tsx
│       ├── ThemeToggle.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── skeleton.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.tsx
├── context
│   └── ThemeProvider.tsx
├── hooks
│   ├── useDropbox.ts
│   └── useMessages.ts
├── lib
│   ├── actions
│   │   └── contact.ts
│   ├── auth.ts
│   ├── helpers.ts
│   ├── schema
│   ├── seo.ts
│   ├── sql
│   │   ├── building_units_rls_policy.sql
│   │   └── disable_rls_for_import.sql
│   ├── store.ts
│   ├── supabase-server.ts
│   ├── supabase.ts
│   └── utils.ts
├── services
│   ├── conversationService.ts
│   ├── dropboxService.ts
│   ├── messageService.ts
│   └── websiteService.ts
├── styles
├── types
│   ├── messaging.ts
│   └── supabase.ts
└── utils
    └── messagingUtils.ts

52 directories, 109 files

```
