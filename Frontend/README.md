# Audit Dashboard Frontend

Next.js frontend for the Website Audit Dashboard.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
Create a `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Project Structure

- `pages/` - Next.js pages (routes)
  - `index.js` - Main dashboard page
  - `audit/[id].js` - Audit detail page (dynamic route)
- `lib/` - Utility functions
  - `api.js` - API client functions
- `styles/` - Global styles
  - `globals.css` - Global CSS styles

## API Integration

The frontend connects to the backend API running on `http://localhost:4000` by default. Make sure the backend server is running before using the frontend.

