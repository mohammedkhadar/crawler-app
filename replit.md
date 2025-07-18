# Web Crawler Dashboard

## Overview

This is a full-stack web application for website analysis and crawling. The system allows users to add URLs for analysis, crawl them to extract various metrics, and view the results through a responsive dashboard with charts and detailed reports.

## Recent Changes

**July 17, 2025**
- Successfully converted project from TypeScript to JavaScript to resolve compilation issues
- Switched database from PostgreSQL to SQLite for better compatibility and embedded deployment
- Fixed webpack configuration with proper host header handling (`allowedHosts: 'all'`)
- Resolved API response parsing issue in Dashboard component (data.urls vs data)
- Application now fully functional with login, URL management, and web crawling capabilities
- Both frontend (port 5000) and backend (port 8000) servers running successfully
- Added bulk selection functionality with checkboxes for individual and select-all operations
- Implemented intelligent bulk action buttons: Start/Delete always available, Stop only when active URLs selected
- Enhanced UX with proper click event separation between checkboxes and detail view navigation

**July 18, 2025**
- Enhanced stop functionality with multiple cancellation checkpoints and immediate status updates
- Added 5-second delays to crawling process to make stop functionality more testable
- Implemented duplicate URL prevention with backend validation using GetURLByURL function
- Added proper error handling for duplicate URLs with 409 Conflict status response
- Updated frontend to display user-friendly error messages for duplicate URL attempts
- Improved robustness of stop mechanism with forced status updates and job cleanup
- Added table column ellipsis functionality for large text values with hover tooltips
- Implemented fixed table layout with proper text truncation for URL, title, and HTML version columns
- Enhanced table styling with overflow handling and responsive column widths

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS for utility-first styling with custom CSS for animations
- **Data Visualization**: Chart.js for rendering charts and graphs
- **Build System**: Webpack with TypeScript loader, CSS processing, and development server
- **Testing**: Jest with React Testing Library for component testing

### Backend Architecture
- **Language**: Go 1.21 with Gin framework for HTTP server
- **Database**: SQLite 3 for embedded persistent data storage
- **Authentication**: JWT-based authentication system
- **Web Scraping**: goquery library for HTML parsing and analysis
- **API Design**: RESTful API with CORS middleware

## Key Components

### Frontend Components
- **App.tsx**: Main application component with authentication wrapper
- **Dashboard.tsx**: Primary dashboard displaying URL table and management
- **URLForm.tsx**: Form component for adding new URLs to crawl
- **URLTable.tsx**: Table component with sorting, filtering, and pagination
- **DetailView.tsx**: Detailed view showing charts and analysis results
- **Charts.tsx**: Reusable chart component for data visualization

### Backend Services
- **Authentication Service**: JWT token management and user verification
- **URL Management**: CRUD operations for URLs and crawl status
- **Web Crawler**: Automated crawling service with status tracking
- **Data Analysis**: HTML parsing to extract metrics (headings, links, forms)

### Authentication System
- JWT-based authentication with token storage in localStorage
- Protected routes requiring valid authentication
- Automatic token verification and refresh handling
- Login/logout functionality with error handling

## Data Flow

1. **User Authentication**: Users log in to receive JWT token
2. **URL Submission**: Users add URLs through the form component
3. **Crawling Process**: Backend queues URLs for crawling with status updates
4. **Data Analysis**: Crawler extracts HTML version, headings, links, and forms
5. **Results Display**: Dashboard shows crawl results with charts and tables
6. **Real-time Updates**: Status updates reflect crawling progress

### Database Schema
- **URLs**: Stores URL information and crawl results with status tracking
- **Broken Links**: Tracks broken links found during crawling
- **Authentication**: Simple JWT-based authentication (no user table needed)

## External Dependencies

### Frontend Dependencies
- React and React DOM for UI framework
- JavaScript (converted from TypeScript for compatibility)
- Tailwind CSS for styling (with inline CSS fallback)
- Chart.js for data visualization
- Webpack for bundling and development server
- Testing libraries (Jest, React Testing Library)

### Backend Dependencies
- Go Gin framework for HTTP server
- SQLite driver (go-sqlite3) for database connectivity
- JWT library for authentication
- goquery for HTML parsing
- CORS middleware for cross-origin requests

## Deployment Strategy

### Development Environment
- Frontend: Webpack dev server on port 5000 with hot reload and allowedHosts: 'all'
- Backend: Go server on port 8000 with API endpoints
- Database: SQLite embedded database file (web_crawler.db)
- Proxy configuration routes `/api` requests to backend

### Production Considerations
- Static file serving for built frontend assets
- Environment-based configuration for database path and JWT secrets
- CORS configuration for production domains
- SQLite database file persistence and backup

### Build Process
- Frontend: Webpack builds to `public/` directory with automatic HTML injection
- Backend: Go build creates executable binary with CGO_ENABLED=1 for SQLite
- Database: SQLite schema created automatically on first run
- Testing: Automated tests for frontend components

## Key Features

- **URL Management**: Add, edit, delete URLs with validation
- **Real-time Crawling**: Status updates during crawling process
- **Data Analysis**: Extract HTML metrics, link analysis, form detection
- **Responsive Design**: Mobile and desktop optimized interface
- **Charts and Visualization**: Interactive charts for data insights
- **Bulk Operations**: Multi-select actions for URL management
- **Authentication**: Secure JWT-based user authentication
- **Error Handling**: Comprehensive error handling and user feedback