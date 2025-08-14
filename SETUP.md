# MateTees Landing Page Setup

## Email Configuration

To enable email notifications, create a `.env.local` file in the root directory with the following variables:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Gmail Setup Instructions:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App Passwords
3. Use the generated password as `SMTP_PASS`

## Database Configuration

The current implementation uses an in-memory array for storage. For production, replace the database logic in `app/api/register/route.ts` with your preferred database:

### Example with PostgreSQL:
```typescript
import { sql } from '@vercel/postgres'

// Replace the subscribers array with:
await sql`
  INSERT INTO subscribers (email, opt_in, timestamp)
  VALUES (${email}, ${optIn}, ${timestamp})
`
```

### Example with MongoDB:
```typescript
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
await client.db().collection('subscribers').insertOne({
  email,
  optIn,
  timestamp
})
```

## Features Implemented

✅ **Opt-in checkbox selected by default**
✅ **Email storage to database** (currently in-memory, configurable)
✅ **Email notification to info@matetees.co.au** with subject "New Early Access Member"
✅ **Form validation and error handling**
✅ **Success/error user feedback**

## API Endpoint

- **POST** `/api/register`
- **Body**: `{ email: string, optIn: boolean, timestamp: string }`
- **Response**: `{ success: true }` or `{ error: string }`
