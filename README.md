# Professional Portfolio with Supabase

A modern, full-featured portfolio website built with Next.js, TypeScript, Tailwind CSS, and Supabase for authentication and content management.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## ✨ Features

- 🎨 Modern, responsive design with glassmorphism effects
- 🔐 Secure authentication system
- 📊 Admin dashboard for content management
- 📝 Editable About Me page
- 🗃️ Database integration with Supabase
- ✨ Dynamic project display with CRUD operations
- 📧 Contact form with email integration
- 🔒 Row Level Security (RLS) for data protection
- 📱 Mobile-responsive design
- 🎯 Smooth scroll behavior and navigation



## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Nodemailer with Gmail SMTP
- **Deployment**: Vercel

## 📂 Project Structure

```
portfolio-sem-4/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   │   ├── about/        # About Me page
│   │   ├── admin/        # Admin dashboard
│   │   ├── auth/         # Login/signup pages
│   │   ├── contact/      # Contact form
│   │   ├── work/         # All projects page
│   │   └── project/[id]/ # Dynamic project pages
│   ├── components/       # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── DynamicHomePage.tsx
│   │   ├── ContactForm.tsx
│   │   └── Auth components
│   └── lib/              # Utils, actions, types
│       ├── actions/      # Server actions
│       ├── supabase/     # Database clients
│       ├── types/        # TypeScript types
│       └── utils/        # Helper functions
├── public/               # Static assets and images
├── supabase/             # Database schema
└── .env.local            # Environment variables (create this)
```

## 🔧 Environment Setup

Copy `.env.example` to `.env.local` and update with your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> 💡 **Tip**: Visit `/setup` in your browser for an interactive setup guide!

## 📖 Pages

- `/` - Homepage with featured projects
- `/about` - About Me page (editable via admin)
- `/work` - All projects gallery
- `/contact` - Contact form
- `/admin` - Admin dashboard (protected)

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Create a project at [Supabase](https://supabase.com)
2. Copy your project credentials to `.env.local` (or use the `/setup` guide)
3. Run the SQL schema in Supabase SQL Editor (from `supabase/schema.sql`)
4. Enable email authentication in Supabase dashboard

### 3. Configure Email (Optional)
1. Set up Gmail App Password
2. Add `EMAIL_USER` and `EMAIL_PASS` to `.env.local`
3. See `EMAIL_SETUP.md` for detailed instructions

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Admin Dashboard

Access the admin dashboard at `/admin` to manage content:

**Projects Tab:**
- Add new projects with images, descriptions, links
- Mark projects as "featured" to show on homepage
- Edit or delete existing projects
- Add custom project dates

**About Me Tab:**
- Edit your introduction paragraph
- Update additional content paragraphs
- Manage your skills list (comma-separated)
- Skills auto-sort alphabetically

## 🚀 Deployment

Deploy to [Vercel](https://vercel.com) by connecting your GitHub repository and adding the environment variables from `.env.local` to the Vercel dashboard.

## 📝 License

MIT License - feel free to use this for your own portfolio!

---

*This README was written with the assistance of GitHub Copilot.*
