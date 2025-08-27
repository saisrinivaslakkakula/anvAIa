# Environment Variables

## Required for Production Deployment

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database_name`
  - Example: `postgresql://user:pass@localhost:5432/jobagents`

### Environment
- `NODE_ENV`: Set to `production` for production deployment

### Server Configuration
- `PORT`: Server port (Render will set this automatically)

## Local Development
Copy these variables to a `.env` file in the server directory for local development.
