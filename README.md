# Inkwell Frontend

Frontend application for **Inkwell**, an AI‑powered social blogging
platform where writers can create, explore, and interact with stories
enhanced by AI.

This project is built with **Next.js 14**, **TypeScript**,
**TailwindCSS**, and integrates with a **NestJS backend** that provides
AI features through **OpenRouter / OpenAI models**.

------------------------------------------------------------------------

# ✨ Core Idea

**Where AI Helps Stories Come to Life**

Inkwell combines blogging with AI tools that help readers and writers
understand and expand ideas.

Key AI capabilities:

-   🧠 **AI TL;DR Generator** -- instantly summarize long posts
-   💬 **AI Explainer** -- ask AI to explain difficult sections
-   ✍️ **AI Expansion** -- expand ideas or paragraphs
-   🤖 **AI Kanban Agents** -- AI-powered workflow management for
    creators
-   🔎 **AI-assisted exploration of content**

------------------------------------------------------------------------

# 🚀 Features

### Writing & Content

-   Rich text blog editor powered by **Tiptap**
-   Create, edit, and delete blog posts
-   Blog feed and blog detail pages
-   User profile pages
-   Responsive UI for reading and writing

### AI Features

-   TL;DR summary generation for posts
-   AI explanation of selected content
-   AI expansion of ideas or paragraphs
-   Agentic AI workflows integrated with **Kanban boards**

### User Interaction

-   Like and dislike posts
-   Follow / unfollow authors
-   View user profiles
-   Timeline feed from followed users

### UI/UX

-   Modern UI built with **TailwindCSS**
-   Animations with **Framer Motion**
-   Icon system with **Lucide React**
-   Component primitives using **Radix UI** and **shadcn/ui**

------------------------------------------------------------------------

# 🧰 Tech Stack

## Framework

-   **Next.js 14 (App Router)**
-   **React 18**
-   **TypeScript**

## Styling

-   **Tailwind CSS**
-   **Tailwind Merge**
-   **tw-animate-css**
-   **Framer Motion**

## Editor

-   **Tiptap Editor**

## State Management

-   **Zustand**

## Networking

-   **Axios**

## UI Libraries

-   **Radix UI**
-   **shadcn/ui**
-   **Lucide React**

------------------------------------------------------------------------

# 📁 Project Structure

    src
    │
    ├── app/                # Next.js App Router pages
    │
    ├── assets/             # Static assets
    │
    ├── components/
    │   ├── ai/             # AI related UI components
    │   ├── blog/           # Blog components
    │   ├── layout/         # Layout components (navbar, wrappers)
    │   ├── ui/             # Reusable UI components
    │   └── user/           # User related components
    │
    ├── constants/          # Global constants
    ├── helpers/            # Helper utilities
    ├── hooks/              # Custom React hooks
    ├── lib/                # API utilities and configs
    ├── providers/          # React providers
    ├── services/           # API service layer
    ├── store/              # Zustand global state
    ├── types/              # TypeScript types
    └── utils/              # General utility functions

------------------------------------------------------------------------

# 🔑 Demo Account

| Email | Password |
|------|---------|
| season@season.com | 123456 |

Use this account to explore the AI blogging features without creating a new account.

------------------------------------------------------------------------

# ⚙️ Environment Variables

Create a **.env.local** file in the root of the project.

    NEXT_PUBLIC_API_URL=http://localhost:3001/api

This should point to the **NestJS backend API**.

------------------------------------------------------------------------

# 📦 Installation

Clone the repository:

``` bash
git clone https://github.com/rubayetseason/inkwell-nextjs-frontend.git
```

Install dependencies:

``` bash
npm install
```

Run development server:

``` bash
npm run dev
```

Application will run at:

    http://localhost:3000

------------------------------------------------------------------------

# 🏗 Build

Create production build:

``` bash
npm run build
```

Start production server:

``` bash
npm run start
```

------------------------------------------------------------------------

# 🔗 Backend

This frontend communicates with a **NestJS backend** that handles:

-   Authentication
-   Blog CRUD operations
-   AI processing via **OpenRouter / OpenAI**
-   User interactions (likes, follows)

Backend API example:

    POST /api/blogs
    GET /api/blogs/feed
    POST /api/auth/login
    POST /api/auth/register

------------------------------------------------------------------------

# 🧠 AI Integration

The platform integrates AI features through a **NestJS backend** using
**OpenRouter / OpenAI compatible APIs**.

AI features include:

-   Post summarization (TL;DR)
-   Content explanation
-   Idea expansion
-   AI-powered Kanban workflow agents

------------------------------------------------------------------------

# 📜 License

This project is open source and available under the **MIT License**.

------------------------------------------------------------------------

# 👨‍💻 Author

Developed by **Rubayet Season**
