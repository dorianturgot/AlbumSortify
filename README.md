# AlbumSortify

AlbumSortify is a Next.js application that lets users organize their favorite Spotify albums into custom lists. It uses the Spotify Web API to fetch album, artist, and playback data.

## Tech Stack

- Next.js (App Router)
- NextAuth.js (Spotify Provider)
- Prisma (SQLite)
- Tailwind CSS

## Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/dorianturgot/AlbumSortify.git
   cd AlbumSortify
   npm install
   ```

2. Create a `.env.local` file in the root directory:
   ```env
   SPOTIFY_CLIENT_ID="your_spotify_client_id"
   SPOTIFY_CLIENT_SECRET="your_spotify_client_secret"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. Setup the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

If you are hosting on a VPS, build the app and use PM2:

```bash
npm run build
pm2 start npm --name "albumsortify" -- run start
```
Make sure to configure a reverse proxy (Nginx/Apache) to point to port 3000.
