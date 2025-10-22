# indie-comments

Lightweight comments system ideal for Neocities, GitHub Pages, portfolios, and indie web creators.

## Overview
Indie Comments is a comment widget for static sites, built with MySQL backend via NocodeBackEnd, HTML/CSS/JavaScript frontend.

## Project Structure
```
indie_comments_v03/
├── painel/                 # Dashboard for site management
│   ├── index.html         # Main dashboard HTML
│   ├── css/
│   │   └── style.css      # Dashboard styles
│   └── js/
│       ├── api.js         # API client with security
│       └── app.js         # Dashboard logic
├── widget/
│   └── indie_comments.js  # Widget script
└── README.md              # This file
```

## Backend Setup (NocodeBackEnd)

### 1. Create Instance
- Create a new instance named `41300_indie_comments_v2`
- Enable CORS for all domains (*)

### 2. Create Tables

#### Table: `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    plan ENUM('free', 'paid') DEFAULT 'free',
    payment_proof TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `sites`
```sql
CREATE TABLE sites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    site_url VARCHAR(255) UNIQUE NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Table: `threads`
```sql
CREATE TABLE threads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    site_id INT NOT NULL,
    page_identifier VARCHAR(255) NOT NULL,
    page_title VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES sites(id)
);
```

#### Table: `comments`
```sql
CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thread_id INT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    visible BOOLEAN DEFAULT FALSE,
    ip_address VARCHAR(45) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thread_id) REFERENCES threads(id)
);
```

### 3. API Endpoints Used
- `POST /search/users?Instance=41300_indie_comments_v2` - Login (search by email)
- `POST /create/users?Instance=41300_indie_comments_v2` - Signup
- **Required JSON payload for user creation:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password_hash": "string",
    "plan": "free"
  }
  ```
  Note: "free" is the default plan. The `created_at` field is automatically set by NoCodeBackend.
- `PUT /update/users/{id}?Instance=41300_indie_comments_v2` - Upgrade plan
- `GET /read/sites?Instance=41300_indie_comments_v2&user_id={id}` - Get user sites
- `POST /create/sites?Instance=41300_indie_comments_v2` - Create site
- `DELETE /delete/sites/{id}?Instance=41300_indie_comments_v2` - Delete site
- `GET /read/sites?Instance=41300_indie_comments_v2` - Get all sites (for widget)
- `POST /search/threads?Instance=41300_indie_comments_v2` - Find thread by site/page
- `POST /create/threads?Instance=41300_indie_comments_v2` - Create thread
- `GET /read/comments?Instance=41300_indie_comments_v2&thread_id={id}&visible=true` - Get approved comments
- `POST /create/comments?Instance=41300_indie_comments_v2` - Submit comment
- `GET /read/comments?Instance=41300_indie_comments_v2&visible=false` - Get pending comments (moderation)
- `PUT /update/comments/{id}?Instance=41300_indie_comments_v2` - Approve comment
- `DELETE /delete/comments/{id}?Instance=41300_indie_comments_v2` - Reject comment

## Frontend Setup

### Dashboard (painel/)
1. Host the `painel/` folder on a static hosting service (Netlify, Vercel, etc.)
2. Update `API_BASE_URL` and `INSTANCE_NAME` in `js/api.js` if needed
3. For production, implement bcrypt on the backend instead of frontend

### Widget (widget/indie_comments.js)
1. Host `indie_comments.js` on a CDN or static hosting
2. Update `API_BASE_URL` and `INSTANCE_NAME` if needed
3. Replace `https://SEU_DOMINIO/widget.js` in dashboard embed code

## Security Notes
- Passwords are hashed with bcrypt (implement on backend for production)
- Comments are created with `visible=false` by default (moderation required)
- API keys are generated securely
- Email validation is implemented
- Rate limiting on comment submission (3-second cooldown)

## Known Limitations (MVP)
- Widget fetches all sites to find by API key (will add API endpoint later)
- Cached for 5 minutes to reduce load
- Acceptable for <1000 sites
- Password hashing done in frontend (temporary for MVP)
- IP address fetched from external service (ipify.org)

## Business Model
- Free: 1 site
- Paid: 3 sites ($6/year via Buy Me a Coffee)
- Supporter badge on widget for paid users

## Testing
- Dashboard: Open `index.html` in browser (requires local server for CORS)
- Widget: Create test HTML page with embed code

## Deployment Checklist
- [ ] NocodeBackEnd instance created
- [ ] Tables created with correct schema
- [ ] CORS configured
- [ ] Dashboard hosted
- [ ] Widget hosted
- [ ] API URLs updated in code
- [ ] Buy Me a Coffee account created
- [ ] Test signup/login flow
- [ ] Test site creation and embed code generation
- [ ] Test widget loading and comment submission

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

## Recent Tasks Summary

### Git History Summary

- bdebaa9: Initial commit: Indie Comments project setup
- 6448296: Merge remote changes and resolve README.md conflict
- 0228198: Fix registration functionality by storing passwords in plain text for MVP compatibility
- 76fa496: Initial commit

### Cloud Deployment Preparation Summary

#### Backend Setup (NocodeBackEnd)
- Instance created: `41300_indie_comments_v2`
- CORS enabled for all domains (*)
- Tables created: users, sites, threads, comments
- API endpoints configured for authentication, site management, and comments

#### Frontend Setup
- Dashboard (painel/): Ready for hosting on static services (Netlify, Vercel)
- Widget (widget/indie_comments.js): Ready for CDN hosting
- API URLs need updating for production

#### Security Notes
- MVP uses plain text passwords (temporary)
- Comments require moderation (visible=false by default)
- Rate limiting implemented (3-second cooldown)

#### Deployment Checklist
- [ ] NocodeBackEnd instance created
- [ ] Tables created with correct schema
- [ ] CORS configured
- [ ] Dashboard hosted
- [ ] Widget hosted
- [ ] API URLs updated in code
- [ ] Buy Me a Coffee account created
- [ ] Test signup/login flow
- [ ] Test site creation and embed code generation
- [ ] Test widget loading and comment submission

#### Testing Status
- Local servers configured for testing
- Test user created: renato.mugrabi@gmail.com / 12345678
- Widget demo page available
- Moderation workflow tested

#### Next Steps
- Phase 1: Local testing (completed)
- Phase 2: Deploy to cloud platforms
- Phase 3: Production security improvements
