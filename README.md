# Francivo

A production-oriented Next.js App Router application for AI-generated TEF Canada, TCF Canada, General TEF, General TCF, and CEFR French practice from A1 to B2.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- TanStack Query for client data and mutations
- Prisma ORM with Neon PostgreSQL
- OpenAI Responses API for TEF/TCF test generation and evaluation
- Zod validation across API boundaries and model output

## Main Routes

- `/` - public TEF/TCF home page
- `/tests/create` - authenticated test builder
- `/tests/[id]` - test taking
- `/tests/[id]/result` - test-result alias route
- `/grammar` - grammar topics by CEFR level
- `/lessons` - lessons and vocabulary by level

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in real secrets.

3. Create the database schema and seed CEFR-aligned content:

   ```bash
   npm run prisma:migrate:dev
   npm run prisma:seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

## Notes

- The seed content is original, CEFR-aligned study metadata based on open/public reference categories. It does not scrape or copy lessons from third-party sites.
- Supported practice modes include CEFR grammar, TEF Canada, TCF Canada, writing, speaking, mixed grammar/vocabulary, and full mock exam mode.
- OpenAI and Vercel Blob calls require production environment variables.
- TEF/TCF section templates are aligned to public official provider descriptions and are practice simulations, not official exam content. Scores are estimated practice scores only.
