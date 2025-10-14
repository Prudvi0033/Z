# Alpha

**Alpha** is a modern, minimalist social media platform inspired by **Twitter (X)** — built for seamless expression and meaningful connections.  
With a sleek dark interface and smooth user experience, Alpha lets users post thoughts, share media, and engage with others in real time.

---

## Features

- **Create Posts** — Share text updates, images, or GIFs.  
- **Like & Bookmark** — Engage with posts and save what matters.  
- **Follow System** — Follow other users to personalize your feed.  
- **Media Uploads** — Support for image and GIF attachments.  
- **Dark Theme** — Sleek, elegant black design focused on clarity and comfort.  
- **Authentication** — Secure login and session management with **Better Auth**.  
- **Server Actions** — Efficient server-side CRUD operations.  
- **Type Safety** — Fully written in **TypeScript** for robust and predictable code.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | PostgreSQL, Prisma ORM |
| **Authentication** | Better Auth |
| **Server Logic** | Next.js Server Actions |

---

## 🧭 Architecture Overview

Alpha follows a **modern full-stack architecture** leveraging **Next.js App Router** and **Server Actions** for smooth integration between frontend and backend logic.  
Data persistence is managed through **PostgreSQL** and **Prisma ORM**, ensuring type-safe, efficient database communication.

Next.js (Frontend + Server Actions)
│
▼
Prisma ORM
│
▼
PostgreSQL Database


---

## Getting Started

1. Clone the Repository
git clone https://github.com/your-username/alpha.git
cd alpha

2. Install Dependencies
npm install

3. Set Up Environment Variables

Create a .env file in the root directory and configure the following:

DATABASE_URL=your_postgres_connection_string
NEXTAUTH_SECRET=your_secret_key

4. Run Prisma Migrations
npx prisma migrate dev

5. Start the Development Server
npm run dev


Your app should now be running at http://localhost:3000

## Folder Structure
src/
 ├── app/                 # Next.js app directory
 │    ├── components/     # Reusable UI components
 │    ├── actions/        # Server actions for CRUD
 │    ├── api/            # API routes
 │    └── pages/          # App pages
 ├── lib/                 # Utilities and configuration
 ├── prisma/              # Prisma schema and migrations
 └── styles/              # Global styles

Core Concepts
🔸 Server Actions

Alpha uses Next.js Server Actions to perform CRUD operations directly on the server, improving performance and reducing API complexity.

🔸 Prisma ORM

Handles all database interactions with a fully type-safe interface for models like User, Post, Follow, and Bookmark.

🔸 Authentication

User sessions and security are managed using Better Auth, providing a smooth and reliable login experience.

## UI & Design

Clean, minimalist interface with a sleek black theme

Smooth transitions and responsive layouts

Tailwind CSS for fast, consistent styling

Mobile-friendly and accessibility-focused

## Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a pull request or start a discussion.

Steps:

Fork the repository

Create a new branch (feature/your-feature)

Commit your changes

Open a Pull Request

## License

This project is licensed under the MIT License — you’re free to use, modify, and distribute it.

Acknowledgments

Special thanks to:

Next.js for its powerful full-stack framework

Prisma for elegant database management

Tailwind CSS for clean and fast UI development

Better Auth for simple, secure authentication

Built with ❤️ and TypeScript by G. Prudvi Raj Varma

