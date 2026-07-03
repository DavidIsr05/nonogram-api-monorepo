# Pixelit

A web app for playing nonograms — those picture-logic puzzles where you fill in squares on a grid using number clues, and a little pixel-art image reveals itself when you get it right.

## What it's about

Pixelit turns images into playable nonograms. Upload a picture, pick a difficulty, and a generator service converts it into a puzzle you can start solving on the spot.

Every solve is timed and mistakes are counted — six and the game is over. Unfinished boards save automatically so you can come back later. Each puzzle has a leaderboard of the fastest solves, and a global leaderboard ranks the top solvers across all public puzzles. Your profile keeps your stats and a history of everything you've finished.

## What you can do

- **Play** — pick a puzzle from the catalog, filter by difficulty (Easy 20×20, Medium 30×30, Hard 40×40) or hide ones you've already played, and solve at your own pace. Progress saves automatically, and you can like the puzzles you finish.
- **Create** — upload an image and generate a puzzle from it. Puzzles you create stay private to your account; the public catalog is curated by admins.
- **Compete** — race for the fastest time on per-puzzle leaderboards and climb the global ranking.
- **Track** — view your solve history, times, and stats on your profile.

## How it's built

Pixelit is a TypeScript monorepo (Nx) with a React + Vite frontend and a NestJS backend. Data lives in Postgres (via Sequelize). Puzzle generation is handled by a separate Spring service that converts images into nonogram grids. Auth is JWT-based, delivered in an httpOnly cookie. The UI is built on Tailwind and Radix.

```
apps/
  client/   React frontend
  server/   NestJS API
libs/
  types/    shared types and Zod schemas
  ui/       shared UI components
```

## Running it

The fastest way to try it locally:

```bash
docker network create nonogram-network
docker compose up
```

Client at `localhost:4200`, API at `localhost:3000`.

The image-to-nonogram generator (`nonogram-spring-api`) is a separate service and isn't part of this compose file — start it on the same `nonogram-network` if you want puzzle creation to work. The rest of the app runs without it.

For local (non-Docker) dev you'll need Postgres and an `.env` in `apps/server/` — see `docker-compose.yml` for the expected variables.
