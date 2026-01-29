# Setup Guide - Transcription App V2

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

For local development, the default SQLite database works fine:

```
DATABASE_URL="file:./dev.db"
```

### 3. Initialize Database

Generate Prisma client and create the database:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### Option 1: Quick Deploy (Using Vercel CLI)

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel
```

Follow the prompts. Vercel will detect Next.js and configure everything automatically.

### Option 2: Deploy via Vercel Dashboard

1. **Push Code to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**

   In Vercel project settings, add environment variable:

   ```
   DATABASE_URL = your_postgres_connection_string
   ```

   For production, use Vercel Postgres or Supabase for a hosted database.

4. **Run Database Migrations**

   If using Prisma with PostgreSQL, you may need to run migrations:

   ```bash
   npx prisma migrate deploy
   ```

   You can add this as a build command in Vercel settings.

### 3. Custom Domain (Optional)

In Vercel project settings → Domains → Add domain:

- Add your custom domain
- Configure DNS records as instructed by Vercel

## Database Setup for Production

### Vercel Postgres (Recommended)

1. In your Vercel project, go to "Storage"
2. Create a new Postgres database
3. Vercel will automatically set `DATABASE_URL` in your environment variables
4. Update your `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. Push schema to production:

   ```bash
   npx prisma db push
   ```

### Alternative: Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your PostgreSQL connection string
3. Set `DATABASE_URL` in Vercel environment variables
4. Update Prisma schema to use `postgresql` provider
5. Run `npx prisma db push`

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |

## Post-Deployment Checklist

- [ ] Database is accessible
- [ ] Environment variables are configured
- [ ] Test creating a transcript
- [ ] Test search functionality
- [ ] Verify analytics dashboard
- [ ] Check settings page
- [ ] Test on mobile devices

## Troubleshooting

### Database Connection Issues

**Error:** "Can't reach database server"

**Solution:**
- Verify `DATABASE_URL` is correct
- Check database server is running
- Ensure firewall allows connections

### Build Failures

**Error:** "Module not found"

**Solution:**
```bash
rm -rf node_modules .next
npm install
npm run build
```

### Migration Issues

**Error:** "Migration failed"

**Solution:**
```bash
npx prisma migrate reset --force
npx prisma db push
```

## Performance Optimization

### Enable Caching

Vercel automatically caches static assets. For API routes, consider adding cache headers:

```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
    }
  })
}
```

### Database Indexing

Add indexes to frequently queried fields in `prisma/schema.prisma`:

```prisma
model Transcript {
  // ... fields
  
  @@index([provider])
  @@index([createdAt])
}
```

## Monitoring and Logs

- **Vercel Dashboard:** View deployment logs and errors
- **Analytics:** Built-in Vercel Analytics for performance monitoring
- **Database:** Check Prisma Studio for data inspection:

  ```bash
  npx prisma studio
  ```

## Security Best Practices

1. **Environment Variables:** Never commit `.env` files
2. **API Routes:** Validate all input data
3. **Database:** Use parameterized queries (Prisma handles this)
4. **Rate Limiting:** Consider adding rate limiting for API routes
5. **HTTPS:** Vercel provides this automatically

## Next Steps

1. Add authentication (NextAuth.js recommended)
2. Implement file upload for audio files
3. Add more chart types to analytics
4. Export transcripts as PDF/DOCX
5. Add email notifications
6. Implement real-time updates

## Support

For issues or questions:
- Check Vercel deployment logs
- Review Prisma documentation
- Consult Next.js docs at [nextjs.org/docs](https://nextjs.org/docs)

---

**Congratulations!** Your Transcription App V2 is now live on Vercel. 🎉
