# Portfolio Project Setup

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase Account

## Setup Steps

1. Clone the repository
```bash
git clone <your-repo-url>
cd project
```

2. Install Dependencies
```bash
npm install
```

3. Supabase Configuration
- Go to [Supabase](https://supabase.com/) and create a new project
- Copy Project URL and Anon Key from Project Settings > API

4. Configure Environment
Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=strong-admin-password
```

5. Setup Admin User
```bash
npm run setup-admin
```

6. Run Development Server
```bash
npm run dev
```

## Deployment
- Build: `npm run build`
- Preview: `npm run preview`

## Troubleshooting
- Ensure all environment variables are correctly set
- Check Supabase project configuration
- Verify network connectivity

## Technologies
- React
- TypeScript
- Supabase
- Tailwind CSS
- Zustand
