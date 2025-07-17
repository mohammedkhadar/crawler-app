# Web Crawler Dashboard

## Overview

This is a full-stack web application for website analysis and crawling. The system allows users to add URLs for analysis, crawl them to extract various metrics, and view the results through a responsive dashboard with charts and detailed reports.

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
- **Database**: MySQL 8.0 for persistent data storage
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
- **Users**: Authentication and user management
- **URLs**: Stores URL information and crawl results
- **Broken Links**: Tracks broken links found during crawling

## External Dependencies

### Frontend Dependencies
- React and React DOM for UI framework
- TypeScript for type safety
- Tailwind CSS for styling
- Chart.js for data visualization
- Webpack for bundling and development server
- Testing libraries (Jest, React Testing Library)

### Backend Dependencies
- Go Gin framework for HTTP server
- MySQL driver for database connectivity
- JWT library for authentication
- goquery for HTML parsing
- CORS middleware for cross-origin requests

## Deployment Strategy

### Development Environment
- Frontend: Webpack dev server on port 5000 with hot reload
- Backend: Go server on port 8000 with API endpoints
- Database: MySQL 8.0 instance
- Proxy configuration routes `/api` requests to backend

### Production Considerations
- Static file serving for built frontend assets
- Environment-based configuration for database and JWT secrets
- CORS configuration for production domains
- Database connection pooling and optimization

### Build Process
- Frontend: Webpack builds to `public/` directory
- Backend: Go build creates executable binary
- Database: MySQL schema setup and migrations
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