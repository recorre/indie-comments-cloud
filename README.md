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

  **Required JSON payload for user creation:**
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
