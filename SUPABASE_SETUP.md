# Supabase Setup Guide

This guide will walk you through setting up Supabase for PassAI.

## Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub (recommended) or email
4. Once logged in, click "New Project"
5. Fill in the project details:
   - **Name**: PassAI
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development
6. Click "Create new project"
7. Wait 2-3 minutes for your project to be provisioned

## Step 2: Get Your API Credentials

1. Once your project is ready, you'll be on the project dashboard
2. Click on the **Settings** icon (gear) in the left sidebar
3. Click on **API** in the settings menu
4. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your PassAI project root, create a `.env.local` file:

```bash
# Create the file
New-Item -Path ".env.local" -ItemType File
```

2. Open `.env.local` and add your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=PassAI
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_GARDEN_FEATURE=true
VITE_ENABLE_AI_GENERATION=false
```

3. **Replace** `your-project-id` and `your-anon-key-here` with your actual values from Step 2

4. Save the file

## Step 4: Verify Setup

1. Make sure your dev server is running:

   ```bash
   npm run dev
   ```

2. The app will now use Supabase (though we haven't created tables yet)

3. You should see no errors about missing environment variables

## Important Notes

⚠️ **Never commit `.env.local` to git!** It's already in `.gitignore`

✅ Use `.env.example` as a template for other developers

🔒 The anon key is safe to expose in client-side code (it's public)

🔑 Never expose your service_role key in client-side code

## Next Steps

After completing this setup, we'll:

1. Create the database schema (Phase 2.2)
2. Set up authentication (Phase 3.1)
3. Configure storage buckets (Phase 4.3)

## Troubleshooting

### "Missing Supabase environment variables" error

- Check that `.env.local` exists in the project root
- Verify variable names start with `VITE_`
- Restart your dev server after creating/editing `.env.local`

### Can't connect to Supabase

- Verify your Project URL is correct (no trailing slash)
- Check that you copied the **anon** key, not the service_role key
- Make sure your project is fully provisioned (check Supabase dashboard)
