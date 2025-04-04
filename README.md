# Lofts des Arts Condominiums

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/mrj0nesmtl/loftsdesarts/blob/main/CHANGELOG.md)
[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://github.com/mrj0nesmtl/loftsdesarts/blob/main/STATUS.md)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ecf8e.svg)](https://supabase.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, elegant website for Lofts des Arts Condominiums located in Montreal, Quebec.

**🌐 [Live Site](https://loftsdesarts.replit.app)**

## Overview

This website serves as the digital presence for Lofts des Arts Condominiums, featuring:
- Cinematic landing page with looping hero video
- Information about the building, history and amenities
- Photo gallery showcasing the property
- Contact information for the Board of Directors
- Admin dashboard for board members and staff (contact form submissions, website content management, and parcel delivery tracking)
- Document management system for storing and sharing important files
- Dark/Light theme toggle for personalized user experience

## Project Vision

> "Celebrating community living in the heart of Montreal"

The site delivers an elegant, sophisticated experience with an aesthetic that reflects the industrial-chic character of Lofts des Arts. It features high-quality visuals of the building, common areas, and surrounding neighborhood to showcase the unique living experience offered by this condominium.

## Architecture

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (Auth, Storage, Database)
- **Deployment**: Replit
- **Theme System**: Context-based theme provider with localStorage persistence
- **File Storage**: Supabase Storage with custom folder management

## Key Features

### Public-Facing
- **Landing Page** - Featuring hero video and key information about the condominium
- **About Page** - Building history, amenities, and surrounding neighborhood
- **Gallery** - Photo gallery showcasing the condominium's architecture, common spaces, and views
- **Contact** - Contact form for inquiries to the board of directors
- **Theme Toggle** - Dark/Light mode for personalized browsing experience

### Admin Dashboard
- **Authentication**: Secure login for board members and staff
- **Dashboard**: Overview of recent activity and key metrics
- **Inquiries**: View, manage, and respond to contact form submissions
- **Content Management**: Edit the website content and gallery
- **Document Management**: Store, organize, and share important condominium documents
- **Parcel Delivery Tracking**: Track parcel deliveries for residents
- **Mobile-Optimized**: Responsive design for managing condominium affairs on the go

### Document Management System
- **Folder Organization**: Create and manage a hierarchical folder structure
- **File Operations**: Upload, download, preview, share, duplicate, and delete files
- **Preview Support**: View images and PDFs directly in the browser
- **Sharing**: Generate expiring links to share documents
- **Metadata**: View file size, type, and creation information
- **Mobile Support**: Fully responsive for on-the-go document access

## Documentation

This project includes comprehensive documentation to guide development and usage:

- [Project Status](STATUS.md) - Current development status and progress tracking
- [Changelog](CHANGELOG.md) - History of changes and versions
- [Roadmap](ROADMAP.md) - Development plan and timeline for future features
- [Statement of Work](SOW.md) - Detailed project scope and deliverables
- [Request for Product](RFP.md) - Original project requirements
- [Developer Documentation](docs/README.md) - Comprehensive guide for developers

## Installation
```bash
git clone https://github.com/mrj0nesmtl/loftsdesarts.git
cd loftsdesarts
npm install
npm run dev
```

For network access (mobile testing):
```bash
npm run dev:network
```

## Development Timeline

The project is following a phased approach:

- **Phase 1**: Foundation - Core website and admin functionality ✅
- **Phase 2**: Extended Admin - Document management and enhanced analytics 🔵
- **Phase 3**: Resident Portal - Resident accounts and service requests
- **Phase 4**: Community Features - Events and amenities booking
- **Phase 5**: Advanced Features - Mobile app and integrations
- **Phase 6**: Optimization - Performance and usability improvements

See [ROADMAP.md](ROADMAP.md) for the detailed development plan.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
