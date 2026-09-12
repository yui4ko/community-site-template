# 🏢 Organization Website Template

A modern, fully-featured website template for organizations, chapters, and communities. Built with **Next.js 15**, **Tailwind CSS**, **Prisma (SQLite)**, and **Docker** — ready to deploy in minutes.

> **Template by Emily Deng** · [me@emilydeng.com](mailto:me@emilydeng.com)

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6-2d3748?logo=prisma)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **📅 Events Management** — Create, edit, and publish upcoming & past events with banners, speakers, and photo galleries
- **📰 News & Announcements** — Publish articles and display site-wide announcement banners
- **🎙️ Podcasts** — Manage and showcase podcast episodes (YouTube embed support)
- **📸 Photo Galleries** — Upload and organize event photos with drag-and-drop reordering
- **📆 Calendar Subscription** — Auto-generated ICS feed with Google Calendar subscribe support
- **🎨 Theme Customization** — Change colors, logos, hero text, and more from a single config file or the Admin UI
- **🔒 Admin Dashboard** — Full-featured CMS with no public registration (admin-only access)
- **🐳 Docker Ready** — One-command deployment with zero-config SQLite database
- **📱 Fully Responsive** — Mobile-first design that looks great on all devices

---

## 📸 Screenshots

> _Replace these with your own screenshots after deployment._

| Home Page | Events Page | Admin Dashboard |
|-----------|-------------|-----------------|
| ![home](#) | ![events](#) | ![admin](#) |

---

## 🚀 Quick Start

### Option 1: Use this Template (Recommended)

1. Click **"Use this template"** on GitHub, or fork this repository
2. Clone to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

### Option 2: Clone Directly

```bash
git clone https://github.com/emilydeng/org-website-template.git my-org-website
cd my-org-website
rm -rf .git && git init  # Start with a fresh git history
```

---

## ⚙️ Configuration

This template uses a **two-layer configuration system**:

| Layer | File | Purpose | When to Use |
|-------|------|---------|-------------|
| **Static Config** | `theme.json` | Site name, branding, SEO, footer, colors | Initial setup (requires rebuild) |
| **Environment** | `.env` | Secrets, admin credentials, social links | Per-environment settings |
| **Runtime Config** | Admin UI → Theme Settings | Override theme.json values from the browser | Live tweaks after deployment |

### Step 1: Configure `theme.json`

This is the **main configuration file**. Edit it to match your organization:

```json
{
  "siteName": "My Organization",
  "siteTagline": "Your tagline here",
  "siteDescription": "A brief description of your organization for SEO.",
  "siteUrl": "https://www.yoursite.com",
  "contactEmail": "contact@yoursite.com",
  "logoUrl": "/images/new_logo.png",

  "hero": {
    "badge": "Welcome Badge Text",
    "title": "Your Big Hero Title \\n Second Line",
    "subtitle": "A longer subtitle description for the hero section.",
    "primaryLinkText": "Explore Events",
    "primaryLinkUrl": "/events",
    "secondaryLinkText": "Learn More",
    "secondaryLinkUrl": "https://www.example.com"
  },

  "footer": {
    "description": "About us text shown in the footer.",
    "copyrightName": "My Organization",
    "externalLinks": [
      { "label": "Partner Site", "url": "https://partner.example.com" }
    ]
  },

  "seo": {
    "keywords": ["Quality", "Events", "Community"]
  },

  "calendar": {
    "categories": ["Professional Development"],
    "organizerName": "My Organization",
    "icsFilename": "my-org-events.ics"
  },

  "social": {
    "hashtag": "#MyOrganization"
  },

  "colors": {
    "primary": "#042c5c",
    "secondary": "#28a745",
    "dark": "#1e293b"
  }
}
```

#### 🎨 Customizing Colors

The `colors` object in `theme.json` maps to Tailwind CSS classes used throughout the site:

| Key | Tailwind Class | Used For |
|-----|----------------|----------|
| `primary` | `bg-brand`, `text-brand` | Buttons, links, accents, header background |
| `secondary` | `bg-accent` | Hover states, secondary actions |
| `dark` | `bg-ink` | Footer background, dark sections |

`brand-light` and `brand-deep` are also available for hover states and dark
sections; by default they resolve to `primary`, so set your own tones in
`tailwind.config.ts` if you want them to differ.

#### 🖼️ Adding Your Logo

`logoUrl` ships empty, and while it is empty the header shows your `siteName`
as text — so a fresh install looks finished rather than showing a broken image.

1. Place your logo file in `public/images/`
2. Set `logoUrl` in `theme.json` to match (e.g., `"/images/my-logo.png"`)

The header sits on a dark background, so a white or light logo works best.

#### ⭐ Replacing the Browser Icon

`src/app/icon.svg` is the tab / bookmark icon. Replace that one file with your
own — Next.js picks it up automatically. It ships as a plain placeholder
calendar mark, so swap it before you launch.
3. Recommended: use a **transparent PNG**, height around **80–120px**

### Step 2: Configure `.env`

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database (Docker handles this automatically)
DATABASE_URL="file:./dev.db"

# NextAuth — IMPORTANT: Change the secret!
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run-openssl-rand-base64-32-to-generate"

# Your admin login credentials
ADMIN_EMAIL="admin@yoursite.com"
ADMIN_PASSWORD="your_secure_password"

# Your public site URL (used for calendar links, SEO)
NEXT_PUBLIC_SITE_URL="https://www.yoursite.com"

# Social links (leave empty to hide the icon)
NEXT_PUBLIC_LINKEDIN_URL="https://linkedin.com/company/yourcompany"
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/yourcompany"
```

> 💡 **Tip:** Generate a secure `NEXTAUTH_SECRET` by running:
> ```bash
> openssl rand -base64 32
> ```

### Step 3: Replace Default Images (Optional)

Default placeholder images are stored in `public/images/defaults/`:

| File | Used For |
|------|----------|
| `event-default-1.png` | Upcoming event hero banner |
| `event-default-2.png` | Past event cards |
| `event-default-3.png` | Home page event highlights |
| `news-default.png` | News article cards |

Replace these with your own images of similar dimensions to customize the look.

---

## 🐳 Deployment (Docker — Recommended)

This is the simplest way to deploy. Docker handles everything: build, database setup, and startup.

### 1. Prepare

Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your server.

```bash
# Clone to your server
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Configure
cp .env.example .env
nano .env  # Edit your settings
nano theme.json  # Customize your branding
```

### 2. Build & Start

```bash
docker compose up -d --build
```

**Docker will automatically:**
- ✅ Build the Next.js application
- ✅ Initialize the SQLite database
- ✅ Create the admin account from your `.env` credentials
- ✅ Persist the database **and** admin uploads in named Docker volumes
  (`db_data`, `uploads`) so a rebuild never wipes your content
- ✅ Start on port **3000**

### 3. Verify

```bash
# Check the container is running
docker compose ps

# View logs
docker compose logs -f web
```

Visit `http://your-server-ip:3000` — your site should be live! 🎉

### 4. Set Up Reverse Proxy (Production)

For production, set up a reverse proxy to handle SSL and route traffic to port 3000.
Set `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the public HTTPS address — the app
already sets Auth.js `trustHost`, which is what lets sign-in work behind a proxy.

<details>
<summary><strong>Nginx Example</strong></summary>

```nginx
server {
    listen 80;
    server_name www.yoursite.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.yoursite.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

</details>

<details>
<summary><strong>Caddy Example (Auto-SSL)</strong></summary>

```
www.yoursite.com {
    reverse_proxy localhost:3000
}
```

</details>

### Updating

```bash
git pull
docker compose up -d --build
```

---

## 💻 Local Development

If you want to run locally for development:

### Prerequisites

- **Node.js 18+** (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** (comes with Node.js)

### Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Initialize the database
npx prisma db push

# (Optional) Seed sample data
npm run seed

# Start the dev server
npm run dev
```

Visit `http://localhost:3000` — the site will hot-reload as you make changes.

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed sample data into the database |
| `npx prisma studio` | Open database GUI browser |
| `npx prisma db push` | Apply schema changes to database |

---

## 🔐 Admin Access

1. Navigate to `/login` or `/api/auth/signin`
2. Log in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`
3. You'll be redirected to the **Admin Dashboard**

### Admin Dashboard Features

| Section | Description |
|---------|-------------|
| **Dashboard** | Overview and quick stats |
| **Events** | Create/edit/delete events, upload banners, manage speakers |
| **News** | Write and publish news articles |
| **Announcements** | Manage site-wide announcement banners |
| **Podcasts** | Add episodes by pasting a YouTube/Vimeo URL — they appear at `/podcasts` |
| **User Management** | Manage admin users |
| **Theme Settings** | Override `theme.json` values at runtime (stored in DB) |
| **Settings** | Change admin password and other preferences |

---

## 📁 Project Structure

```
├── 📄 theme.json              # ⭐ Main site configuration
├── 📄 .env.example             # Environment variables template
├── 📄 docker-compose.yml       # Docker deployment config
├── 📄 Dockerfile               # Multi-stage Docker build
├── 📄 tailwind.config.ts       # Tailwind CSS config (reads from theme.json)
├── 📂 prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Sample data seeder
├── 📂 public/
│   └── images/
│       └── defaults/           # Default placeholder images
├── 📂 src/
│   ├── 📂 app/                 # Next.js App Router pages
│   │   ├── page.tsx            # Home page
│   │   ├── layout.tsx          # Root layout (SEO metadata)
│   │   ├── events/             # Events listing & detail pages
│   │   ├── news/               # News listing & detail pages
│   │   ├── login/              # Public login page
│   │   ├── admin/              # Admin dashboard pages
│   │   └── api/                # API routes (calendar, auth)
│   ├── 📂 components/          # Reusable UI components
│   │   ├── Header.tsx          # Site header/navigation
│   │   ├── Footer.tsx          # Site footer
│   │   └── admin/              # Admin-specific components
│   ├── 📂 actions/             # Server actions (CRUD operations)
│   │   ├── theme.ts            # Theme read/update actions
│   │   ├── events.ts           # Event CRUD
│   │   └── news.ts             # News CRUD
│   └── 📂 lib/
│       ├── site-config.ts      # Centralized config helper
│       └── prisma.ts           # Prisma client singleton
```

---

## 🎨 Customization Guide

### How Configuration Flows

```
theme.json (defaults) → DB overrides (Admin UI) → Final Config
                              ↑
                   /admin/theme settings page
```

- **`theme.json`** provides the baseline values (version-controlled)
- **Admin UI** (`/admin/theme`) can override any value at runtime (stored in database)
- The system **merges** DB values on top of `theme.json` defaults

### Extending the Template

| I want to... | Do this... |
|--------------|------------|
| Add a new page | Create a folder in `src/app/` with a `page.tsx` |
| Add a new database model | Edit `prisma/schema.prisma`, run `npx prisma db push` |
| Modify the navigation | Edit `src/components/Header.tsx` |
| Change the footer links | Edit `footer.externalLinks` in `theme.json` |
| Add a new admin section | Add a folder in `src/app/admin/(dashboard)/` |
| Change the color scheme | Edit `colors` in `theme.json` |

---

## 🗃️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org/) | 15 | React framework (App Router) |
| [React](https://react.dev/) | 19 | UI library |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4 | Utility-first CSS |
| [Prisma](https://www.prisma.io/) | 6 | Database ORM |
| [SQLite](https://www.sqlite.org/) | — | Zero-config database |
| [NextAuth.js](https://authjs.dev/) | 5 (beta) | Authentication |
| [Docker](https://www.docker.com/) | — | Containerized deployment |

---

## ❓ FAQ

<details>
<summary><strong>How do I reset the admin password?</strong></summary>

Update `ADMIN_PASSWORD` in `.env` and restart:
```bash
docker compose down && docker compose up -d --build
```
Or use the Admin Dashboard → Settings → Change Password.
</details>

<details>
<summary><strong>How do I backup the database?</strong></summary>

Under Docker the database and the uploaded images live in two named volumes,
`db_data` and `uploads`. Back both up together:
```bash
docker run --rm -v db_data:/data -v uploads:/uploads -v "$PWD:/backup" alpine \
  tar czf /backup/backup-$(date +%F).tar.gz /data /uploads
```
Running locally without Docker, the database is just `./prisma/dev.db` and the
uploads are in `./public/uploads/` — copy them as normal files.
</details>

<details>
<summary><strong>Can I use PostgreSQL or MySQL instead of SQLite?</strong></summary>

Yes. Update the `datasource` in `prisma/schema.prisma` and change `DATABASE_URL` in `.env`. You may need to adjust some SQLite-specific syntax in the schema. See the [Prisma docs](https://www.prisma.io/docs/concepts/database-connectors) for details.
</details>

<details>
<summary><strong>How do I add more social media links?</strong></summary>

1. Add new environment variables in `.env` (e.g., `NEXT_PUBLIC_TWITTER_URL`)
2. Add the corresponding icon in `Header.tsx` and `Footer.tsx`
</details>

<details>
<summary><strong>Changes to theme.json aren't showing up?</strong></summary>

`theme.json` is read at **build time**. If you modified it:
- **Local dev:** Restart the dev server (`npm run dev`)
- **Docker:** Rebuild (`docker compose up -d --build`)
- **Alternative:** Use **Admin UI → Theme Settings** for changes without rebuilding
</details>

---

## 📄 License

Released under the [MIT License](LICENSE) — free to use, modify, and ship,
commercially or otherwise. No attribution required, though it is appreciated.

**Template by Emily Deng** · [me@emilydeng.com](mailto:me@emilydeng.com)
