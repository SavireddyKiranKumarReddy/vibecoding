# Deployment Checklist

## Environment Variables (CRITICAL!)

Set these in your deployment platform (Vercel/Netlify/etc.):

```
VITE_SUPABASE_URL=https://bdfvhyfusrjgbgxrcyga.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_Vx_p4mdWwV40cwdcPkH7IA_S9cVsKM_
VITE_SUPABASE_PROJECT_ID=bdfvhyfusrjgbgxrcyga
```

## Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Set environment variables in Project Settings → Environment Variables
3. Deploy!

## Netlify Deployment

1. Connect your GitHub repo to Netlify
2. Build settings are in `netlify.toml`
3. Set environment variables in Site Settings → Environment Variables
4. Deploy!

## Common Issues

### Issue: Blank page or 404 on routes
**Solution:** The `vercel.json` or `netlify.toml` files handle this. Make sure they're committed.

### Issue: API calls failing
**Solution:** Check that environment variables are set correctly in your deployment platform.

### Issue: Build fails
**Solution:** 
- Check build logs
- Ensure Node.js version matches (use Node 18+)
- Run `npm run build` locally first to test

### Issue: Fonts not loading
**Solution:** The PostCSS warning about @import is non-critical but can be fixed by moving the @import to the top of `src/index.css`

## Testing Production Build Locally

```bash
npm run build
npm run preview
```

Then visit http://localhost:4173
