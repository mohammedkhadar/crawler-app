# Web Crawler Dashboard

A full-stack web application for website analysis and crawling built with React/TypeScript frontend and Go/MySQL backend.

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
- MySQL 8.0 database
- JWT authentication
- goquery for HTML parsing
- CORS middleware

## Quick Start

### Prerequisites
- Go 1.21 or higher
- MySQL 8.0 or higher
- Node.js 18 or higher
- npm or yarn

### Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE web_crawler;
