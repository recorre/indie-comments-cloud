# Indie Comments v0.3 Setup Guide

## Prerequisites

- Node.js (version 14 or higher)
- NoCodeBackend account and API key (from your NoCodeBackend dashboard)
- NoCodeBackend database instance: `41300_indie_comments_v2`

## Installation Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file by copying the example:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your NoCodeBackend API key:
   ```env
   NOCODEBACKEND_API_KEY=your_actual_api_key_here
   ```

4. **Configure NoCodeBackend Database Schema**:

   **Important**: Before starting the server, you must configure your NoCodeBackend database:

   - Access your NoCodeBackend dashboard
   - Go to the `41300_indie_comments_v2` instance
   - Find the `users` table and the `password_hash` field
   - **Change the field type from `password` to `text`**
   - This disables automatic password hashing for MVP compatibility

   **Why this is needed**: NoCodeBackend doesn't have built-in authentication endpoints. For the MVP, we store passwords in plain text and use database queries to authenticate users.

5. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev  # requires nodemon: npm install -g nodemon
   ```

## How It Works

The application uses a backend proxy to securely communicate with NoCodeBackend:

1. **Admin Panel Authentication**:
   - Signup: `POST /api/proxy/create/users` - Creates new user accounts
   - Login: `GET /api/proxy/read/users?email={email}&password_hash={password}` - Authenticates users

2. **API Security**:
   - The admin panel (frontend) makes requests to `/api/proxy` on your local server
   - The backend server adds the required API key and headers
   - The backend forwards the request to NoCodeBackend
   - This keeps your API key secure since it's only stored on the server

3. **Comment Widget**:
   - Runs directly on external websites
   - Makes direct API calls to NoCodeBackend (cannot use proxy for CORS reasons)
   - Uses site-specific API keys for authentication

## Security Notes

- **MVP Security Notice**: For the current MVP, passwords are stored in plain text for compatibility with NoCodeBackend. This is NOT secure for production use.
- Never commit your `.env` file to version control
- The widget (`widget/indie_comments.js`) runs on external sites and thus cannot use the proxy
- For production deployment, ensure your server is properly secured
- Use HTTPS in production
- **Future Security**: Implement proper password hashing (bcrypt) on the backend when infrastructure allows

## Configuration

- Default port: 4130 (can be changed in `.env`)
- API proxy endpoint: `/api/proxy`
- Admin panel: accessible at `http://localhost:4130/painel`
- NoCodeBackend instance: `41300_indie_comments_v2`

## User Experience Features

- **Password Visibility Toggle**: Eye icons (👁️/🙈) on all password fields for better UX
- **Password Confirmation**: Signup form includes password confirmation field
- **Form Validation**: Client-side validation for email format and password matching
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints Used

### Authentication
- `POST /create/users` - User registration
- `GET /read/users?email={email}&password_hash={password}` - User login

### Site Management
- `GET /read/sites?user_id={id}` - Get user's sites
- `POST /create/sites` - Create new site
- `DELETE /delete/sites/{id}` - Delete site

### Comments & Moderation
- `GET /read/comments?thread_id={id}&visible=1` - Get approved comments
- `POST /create/comments` - Submit new comment
- `PUT /update/comments/{id}` - Approve/reject comments

### Threads
- `GET /read/threads?site_id={id}&page_identifier={path}` - Get/create thread for page

## Troubleshooting

### "Error creating record" during signup
- Ensure the `password_hash` field in NoCodeBackend is set to `text` type (not `password`)
- Check that your NoCodeBackend API key is correct in `.env`

### Authentication not working
- Verify the database schema matches the API expectations
- Check browser console for detailed error messages
- Ensure the server is running on port 4130

### Widget not loading comments
- Verify the site API key is correct
- Check that the widget script is properly embedded
- Ensure CORS is not blocking direct API calls from external sites