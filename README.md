# Web Crawler Dashboard

A full-stack web application for website analysis and crawling built with React/TypeScript frontend and Go/SQLite backend.

## Features

- **URL Management**: Add, edit, and delete URLs for analysis
- **Web Crawling**: Automated crawling with real-time status updates
- **Data Analysis**: Extract HTML version, page title, heading counts, link analysis, and login form detection
- **Dashboard**: Responsive table with sorting, filtering, and pagination
- **Detail View**: Charts and detailed reports for each crawled URL
- **Bulk Actions**: Re-crawl or delete multiple URLs at once
- **Authentication**: JWT-based authentication system

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Chart.js for data visualization
- Jest and React Testing Library for testing
- Webpack for bundling

### Backend
- Go 1.21 with Gin framework
- SQLite database
- JWT authentication
- goquery for HTML parsing
- CORS middleware

## Local Development

### Prerequisites
- Go 1.21 or higher
- Node.js 18 or higher
- npm or yarn

### Running the Application Locally

#### Method 1: Using Replit (Recommended)
If you're running this on Replit, simply click the "Run" button to start both servers automatically.

#### Method 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-crawler
   ```

2. **Install dependencies**
   ```bash
   # Install Go dependencies
   go mod tidy
   
   # Install Node.js dependencies
   npm install
   ```

3. **Start the backend server**
   ```bash
   # In one terminal window
   CGO_ENABLED=1 go run main.go
   ```
   The backend server will start on port 8000 and automatically create the SQLite database file.

4. **Start the frontend development server**
   ```bash
   # In another terminal window
   npx webpack serve --mode development
   ```
   The frontend development server will start on port 5000.

5. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:8000
   - The frontend automatically proxies API requests to the backend

### Database
The application uses SQLite for data storage. The database file (`web_crawler.db`) is automatically created when you first run the backend server. No manual database setup is required.

### Development Workflow

#### Testing
Run the frontend tests:
```bash
npm test
```

#### Building for Production
Build the frontend for production:
```bash
npm run build
```

#### Environment Variables
The application works with default settings, but you can customize behavior with these environment variables:

- `GIN_MODE`: Set to "release" for production mode
- `DATABASE_URL`: Custom database path (defaults to `web_crawler.db`)
- `JWT_SECRET`: Custom JWT secret (defaults to a built-in secret)

### Troubleshooting

#### Port Conflicts
If you encounter port conflicts:
- Backend (port 8000): Kill any process using port 8000
- Frontend (port 5000): Kill any process using port 5000
- Use `pkill -f "go run main.go"` and `pkill -f "webpack serve"` to stop servers

#### Database Issues
- If you encounter database issues, delete the `web_crawler.db` file and restart the backend server
- The database schema will be automatically recreated

#### Common Issues
1. **CGO_ENABLED error**: Make sure you have a C compiler installed (gcc on Linux/Mac, or use CGO_ENABLED=1)
2. **Module not found**: Run `go mod tidy` to install Go dependencies
3. **npm command not found**: Install Node.js and npm
4. **Webpack build errors**: Delete `node_modules` and run `npm install` again

### Project Structure
```
├── main.go              # Go backend entry point
├── handlers/            # HTTP request handlers
├── models/              # Database models
├── services/            # Business logic services
├── middleware/          # HTTP middleware
├── src/                 # React frontend source
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service functions
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
├── webpack.config.js   # Webpack configuration
└── package.json        # Node.js dependencies
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/verify` - Verify JWT token

#### URL Management
- `GET /api/urls` - Get all URLs
- `POST /api/urls` - Create new URL
- `PUT /api/urls/:id` - Update URL
- `DELETE /api/urls/:id` - Delete URL
- `POST /api/urls/:id/crawl` - Start crawling URL
- `POST /api/urls/:id/stop` - Stop crawling URL
- `GET /api/urls/:id/status` - Get crawling status
- `GET /api/urls/:id/broken-links` - Get broken links
- `POST /api/urls/bulk` - Bulk operations (re-crawl/delete multiple URLs)

## Deployment

### Replit Deployment
This application is configured for deployment on Replit with Google Cloud Run:

1. Click the "Deploy" button in Replit
2. The application will be automatically built and deployed
3. You'll receive a public URL ending with `.replit.app`
4. Optional: Configure a custom domain

### Production Configuration
The application is production-ready with:
- Automatic SQLite database creation
- CORS configuration for cross-origin requests
- Static file serving for the frontend
- JWT authentication system
- Environment-based configuration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
