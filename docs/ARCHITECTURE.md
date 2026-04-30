# 🏗️ System Architecture — Robotics Engineer Personal Branding Website

## Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │              Next.js Static Export (GitHub Pages)             │   │
│  │                                                              │   │
│  │  Landing | About | Portfolio | Blog | Services | Contact    │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                          │ HTTPS Fetch/Webhook                       │
└──────────────────────────┼──────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  n8n Cloud  │ │  Tally.so   │ │  Formspree  │
    │  (Webhook   │ │  (Forms &   │ │  (Fallback  │
    │   Server)   │ │   Upload)   │ │   Contact)  │
    └──────┬──────┘ └─────────────┘ └─────────────┘
           │
    ┌──────┴──────────────────────────────┐
    │         n8n Automation Hub          │
    │                                     │
    │  ┌─────────┐  ┌──────────────────┐ │
    │  │ Chat    │  │ Service Request  │ │
    │  │ Webhook │  │ Workflow         │ │
    │  └────┬────┘  └────────┬─────────┘ │
    │       │                │           │
    │  ┌────▼────┐      ┌────▼─────────┐ │
    │  │Telegram │      │ Google Sheet │ │
    │  │ / Email │      │ (CRM/Orders) │ │
    │  └─────────┘      └──────────────┘ │
    └─────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 (Static Export) | Free |
| Hosting | GitHub Pages | Free |
| CMS (Blog) | Markdown files + gray-matter | Free |
| Forms | Formspree / Tally.so | Free tier |
| Automation | n8n Cloud (free tier) | Free |
| Database | Google Sheets via n8n | Free |
| Notifications | Telegram Bot API | Free |
| Domain | Freenom / GitHub subdomain | Free |
| Images | Next.js Image (unoptimized) | Free |

---

## Directory Structure

```
robotics-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD
├── content/
│   ├── posts/                  # Markdown blog posts
│   │   ├── robot-arm-pid.md
│   │   └── esp32-ros2.md
│   └── projects/               # Markdown project case studies
│       ├── robot-arm.md
│       └── smart-greenhouse.md
├── public/
│   ├── images/
│   ├── cv/
│   │   └── RaiJen-CV.pdf       # Downloadable CV
│   └── .nojekyll               # Required for GitHub Pages
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── sections/           # Landing page sections
│   │   │   ├── Hero.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── PortfolioPreview.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── CTASection.tsx
│   │   └── ui/                 # Reusable components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       ├── LiveChat.tsx    # n8n integrated chat widget
│   │       └── ServiceForm.tsx # n8n integrated form
│   ├── pages/
│   │   ├── index.tsx           # Landing page
│   │   ├── about.tsx
│   │   ├── portfolio/
│   │   │   ├── index.tsx       # Portfolio with filter
│   │   │   └── [slug].tsx      # Project case study
│   │   ├── blog/
│   │   │   ├── index.tsx       # Blog list + search
│   │   │   └── [slug].tsx      # Blog post
│   │   ├── services.tsx        # Services + booking
│   │   └── 404.tsx
│   ├── lib/
│   │   ├── markdown.ts         # MDX/Markdown utils
│   │   ├── n8n.ts              # n8n webhook client
│   │   └── rateLimit.ts        # Client-side rate limiting
│   ├── hooks/
│   │   └── useChat.ts          # Chat state management
│   ├── data/
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   └── services.ts
│   └── styles/
│       └── globals.css
├── n8n-workflows/
│   ├── live-chat-workflow.json
│   ├── service-request-workflow.json
│   └── contact-form-workflow.json
├── next.config.js              # Static export config
├── package.json
└── README.md
```
