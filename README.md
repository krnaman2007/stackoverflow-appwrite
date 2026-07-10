# StackFlow

A Q&A platform (Stack Overflow-style) built with Next.js 15 and Appwrite, featuring collection-based data modeling, granular permissions, and global state management with Zustand.

## Features

- ❓ **Ask & Answer Questions** — Create, browse, and answer questions with a rich text editor (RTE)
- 💬 **Comments** — Comment on questions and answers
- ⬆️ **Voting System** — Upvote/downvote questions and answers via a dedicated votes collection
- 🔐 **Authentication & Permissions** — Fine-grained access control using Appwrite's permission system (`Role.any()`, `Role.users()`)
- 👤 **User Profiles** — Dynamic user pages (`/users/[userId]/[userSlug]`) showing a user's questions, answers, and votes
- 🏆 **Top Contributors** — Homepage section highlighting most active users
- 🆕 **Latest Questions** — Homepage feed of recently asked questions
- 📄 **Pagination** — Paginated question/answer listings
- 🗂️ **Collection-Based Data Model** — Questions, answers, comments, and votes managed as Appwrite collections with dedicated server-side setup
- 🗃️ **Global State Management** — Zustand store (`Auth.ts`) with `persist` and `immer` middleware
- 🏷️ **Type-Safe Documents** — Custom TypeScript types extending Appwrite's `Models.Document`

## Tech Stack

| Layer            | Technology                     |
|-------------------|---------------------------------|
| Framework          | Next.js 15 (App Router)        |
| Backend-as-a-Service | Appwrite                     |
| State Management   | Zustand (`persist`, `immer`)    |
| UI Components       | shadcn/ui                      |
| Language           | TypeScript                      |
| Styling            | Tailwind CSS                    |

## Getting Started

### Prerequisites

- Node.js (v18+)
- An [Appwrite](https://appwrite.io) project (self-hosted or Appwrite Cloud)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/krnaman2007/stackoverflow-appwrite
   cd stackoverflow-appwrite
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables (see below)

4. Set up Appwrite collections (Questions, Answers, Users) with the appropriate permissions in your Appwrite console

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_APPWRITE_PROJECT_ID = 
NEXT_PUBLIC_APPWRITE_PROJECT_NAME =
NEXT_PUBLIC_APPWRITE_ENDPOINT = 
        
APPWRITE_API_KEY=
```

## Project Structure

```
stackoverflow-appwrite/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Sign-in / sign-up routes
│   │   ├── api/                       # API routes
│   │   ├── components/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroSectionHeader.tsx
│   │   │   ├── LatestQuestions.tsx
│   │   │   └── TopContributers.tsx
│   │   ├── questions/                 # Question listing & detail routes
│   │   ├── users/
│   │   │   └── [userId]/[userSlug]/
│   │   │       ├── answers/
│   │   │       ├── edit/
│   │   │       ├── questions/
│   │   │       ├── votes/
│   │   │       ├── EditButton.tsx
│   │   │       ├── layout.tsx
│   │   │       ├── Navbar.tsx
│   │   │       └── page.tsx
│   │   ├── env.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components
│   │   ├── Answers.tsx
│   │   ├── Comments.tsx
│   │   ├── Pagination.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── QuestionForm.tsx
│   │   ├── RTE.tsx                    # Rich text editor
│   │   └── VoteButtons.tsx
│   └── lib/
│       ├── models/
│       │   ├── client/
│       │   │   └── config.ts          # Appwrite client-side config
│       │   ├── server/
│       │   │   ├── answer.collection.ts
│       │   │   ├── comment.collection.ts
│       │   │   ├── config.ts
│       │   │   ├── dbSetup.ts         # Programmatic DB/collection setup
│       │   │   ├── question.collection.ts
│       │   │   ├── storageSetup.ts    # Appwrite storage bucket setup
│       │   │   └── vote.collection.ts
│       │   ├── index.ts
│       │   └── name.ts
│       ├── store/
│       │   ├── Auth.ts                # Zustand auth store
│       │   └── proxy.ts
│       ├── slugify.ts
│       └── utils.ts
└── .env
```

## Key Implementation Notes

- **Appwrite permissions** are set per-document using `Role.any()` for public read access and `Role.users()` to restrict write access to authenticated users
- Database, collections (questions, answers, comments, votes), and storage buckets are provisioned programmatically via `lib/models/server/dbSetup.ts` and `storageSetup.ts`
- **Zustand store** (`store/Auth.ts`) combines `persist` middleware (to retain state across sessions) with `immer` middleware (for cleaner immutable state updates)
- Custom TypeScript interfaces extend Appwrite's `Models.Document` to add strong typing on top of dynamically-returned collection data
- User profile routes use dynamic `[userId]/[userSlug]` segments generated via `slugify.ts`