# Project Kickoff Prompt – Marc Reichel & STTS Website

## Project Title
Marc Reichel – STTS: Special Effects Studio Website

## Style & Vibe
Dark, cinematic, high-contrast. Think **Michael Bay meets Blade Runner**. Gritty textures, heavy industrial design cues, ember particles, smoke, and explosive flair. The user uploaded reference imagery – use that as a visual style guide.

## Site Purpose
This is a **showcase and lead generation website** for Marc Reichel, a legendary Canadian special effects coordinator and demolitions expert, with over 100 film credits across blockbusters like *Arrival*, *Nobody*, *Source Code*, and more.

The site serves to:
- Showcase Marc’s career highlights.
- Display his latest **highlight reel**.
- Provide easy contact methods for booking his studio (STTS) for film, TV, and commercial work.
- Drive engagement through social links, newsletter subscriptions, and visual immersion into Marc’s work.

## Core Pages
This site will be built as a **React + Supabase Replit project** with three primary pages, plus a few core sections within them. Use **modern React architecture** with modular components, Tailwind CSS (or another utility-first framework), and scalable best practices for future expansion.

---

## Design Notes
- Use **dark textured backgrounds** (carbon fiber, metal plating).
- Font inspiration: Think military stencils mixed with sci-fi typography.
- Red-orange accents to match fire/explosion vibe.
- Section dividers should feel like "rivet seams" or industrial plating edges.

## Next Steps
1. Initialize the repo & push base project structure.
2. Scaffold all pages & components (empty for now).
3. Create placeholder assets for hero video and portfolio images.
4. Build out the Newsletter and Contact forms.
5. Pull actual content (credits, bio) from the IMDb PDF and draft text content.

---

## Bonus
If possible, enable **dark mode toggle** — invert text & background colors for alternate viewing.

---

## Final Note
This project should feel **like a cinematic experience** — not just a website. Use Cursor AI and Claude 3.7 to iterate fast on design and animation concepts.

---

### Page Structure & Requirements

### 1. Landing Page (Home)
- Hero Section: Full-screen background video (explosion & bridge destruction scene — placeholder for Sora asset) with overlay text:
    - "We’ll Burn That Bridge When We Get There"
    - Subtitle: Special Effects by Marc Reichel
- Embedded Newsletter Subscription Form.
- Section for Latest Work (Carousel or Grid – clickable thumbnails linking to the Portfolio page).
- Footer with social links (Instagram, YouTube, IMDb, LinkedIn).

### 2. Portfolio / Repertoire Page
- Dynamic grid showcasing **selected projects** with hover effects (Title, Year, Role).
- Expandable sections for:
    - Feature Films
    - Television
    - Commercial Work
- Pull data from **provided IMDb PDF** for accurate credits list.
- Optional Video Highlight Reel embed at the top.

### 3. Contact & About Page
- Split page layout:
    - Left side: Contact Form with fields:
        - Name
        - Email
        - Project Type (Dropdown: Film, TV, Commercial, Other)
        - Message
    - Right side: About Marc Reichel
        - Short bio (military background, family legacy in SFX, career highlights).
        - Studio Information (STTS – based in Montreal, serving global productions).
        - Embed location map.
        - Direct link to IMDb profile.
        - Direct social links.

---

## Tech Stack
- **React** (Vite for fast builds)
- **Tailwind CSS** for styling
- **React Router** for page navigation
- **Framer Motion** (for cinematic transitions and hover effects)
- **Hero Video Placeholder Component** (we will swap with final Sora asset later)
- **Replit for deployment**
- **Supabase for database** 
- **Cursor AI** for development
- **Claude 3.7** for design and content assistance
---

## Directory Structure

## Folder Structure (Replit Optimized)

```plaintext
/src
  /assets              # Images, videos, logos
  /components          # Reusable UI components (Header, Footer, etc.)
  /pages                # Page components (LandingPage.jsx, PortfolioPage.jsx, ContactPage.jsx)
  /styles                # Tailwind or global.css if needed
  /App.jsx
  /main.jsx
  /vite.config.js
  /tailwind.config.js
  /index.html
  /README.md
/replit.nix            # Replit-specific file to manage environment
/.replit                # Replit workspace config
.gitignore
package.json

