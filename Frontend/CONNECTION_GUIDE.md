# Frontend-Backend Connection Guide

## Quick Test

1. **Start the backend server:**
   ```bash
   # From project root
   npm run backend
   ```
   You should see: `✅ Backend listening on http://localhost:4000`

2. **Test the connection in the browser:**
   - Start the frontend: `cd Frontend && npm run dev`
   - Visit: `http://localhost:3000/api-test`
   - This page will show you the connection status

## API Endpoints

The frontend connects to these backend endpoints:

- `GET http://localhost:4000/` - Health check
- `GET http://localhost:4000/audit` - List all audits
- `GET http://localhost:4000/audit/:id` - Get single audit
- `POST http://localhost:4000/audit` - Create new audit
- `GET http://localhost:4000/audit/:id/pdf` - Download PDF

## Configuration

The API base URL is configured in:
- `Frontend/lib/api.js` - Defaults to `http://localhost:4000`
- Can be overridden with environment variable: `NEXT_PUBLIC_API_BASE_URL`

Create `Frontend/.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

## Troubleshooting

### Backend not connecting

1. **Check if backend is running:**
   ```bash
   lsof -ti:4000
   # Should return a process ID
   ```

2. **Check backend logs:**
   Look for errors in the terminal where you ran `npm run backend`

3. **Check MongoDB connection:**
   The backend needs MongoDB. Make sure it's running or update `MONGO_URI` in `.env`

4. **Check CORS:**
   The backend has CORS enabled, so this should work out of the box

### Frontend shows connection error

1. **Verify backend is accessible:**
   ```bash
   curl http://localhost:4000/
   # Should return: "Backend root OK"
   ```

2. **Check browser console:**
   Open DevTools (F12) and check for network errors

3. **Verify API base URL:**
   Check that `NEXT_PUBLIC_API_BASE_URL` matches your backend URL

## Testing Checklist

- [ ] Backend server is running (`npm run backend`)
- [ ] Backend responds to `GET http://localhost:4000/`
- [ ] Frontend can fetch audits (`GET http://localhost:4000/audit`)
- [ ] Frontend can create audits (`POST http://localhost:4000/audit`)
- [ ] No CORS errors in browser console
- [ ] Dashboard loads and shows audits (if any exist)

## Next Steps

Once the connection is verified:
1. Go to the main dashboard: `http://localhost:3000`
2. Try creating a new audit
3. View audit details
4. Download PDF reports

