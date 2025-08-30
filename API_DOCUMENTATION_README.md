# Job Agents API Documentation

This repository contains the complete OpenAPI 3.0 specification for the Job Agents application backend API.

## Overview

The Job Agents API is a comprehensive system for managing job applications, automated job research, and application processing. It provides endpoints for:

- **Health Monitoring**: API and database health checks
- **Job Management**: Job listing, importing, and deduplication
- **Application Tracking**: Creating, updating, and monitoring job applications
- **Question Handling**: Managing application questions and responses
- **Automated Agents**: Running researcher and applier agents

## API Endpoints Summary

### Health
- `GET /health` - Check API and database health

### Jobs
- `GET /jobs` - Retrieve all available jobs
- `POST /jobs/import` - Import multiple jobs with deduplication

### Applications
- `GET /applications` - List applications with optional status filtering
- `POST /applications` - Create a new job application
- `PATCH /applications/{id}` - Update application status and notes
- `POST /applications/apply-next-batch` - Process application batches

### Questions
- `GET /questions` - List questions with optional status filtering
- `PATCH /questions/{id}` - Answer a question
- `POST /questions/create` - Create a new question

### Agents
- `POST /agents/run-researcher` - Execute researcher agent
- `POST /agents/run-applier` - Execute applier agent
- `GET /agents/runs` - Get agent execution history

## Data Models

The API includes comprehensive data models for:

- **Jobs**: Job postings with company, title, location, and metadata
- **Applications**: Job applications with status tracking
- **Questions**: Application questions requiring user responses
- **Agent Runs**: Automated agent execution records
- **Users**: User management and authentication

## Converting to Other Formats

### Option 1: Using Swagger UI (Web-based)

1. **View Online**: Upload the `openapi-spec.yaml` file to [Swagger Editor](https://editor.swagger.io/)
2. **Export**: Use the "Export" menu to save as HTML, JSON, or other formats

### Option 2: Using OpenAPI Generator (Command Line)

```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate HTML documentation
openapi-generator-cli generate -i openapi-spec.yaml -g html2 -o ./docs

# Generate Markdown documentation
openapi-generator-cli generate -i openapi-spec.yaml -g markdown -o ./docs

# Generate Postman collection
openapi-generator-cli generate -i openapi-spec.yaml -g postman-collection -o ./docs
```

### Option 3: Using Redoc (Modern Documentation)

```bash
# Install Redoc
npm install -g redoc-cli

# Generate HTML documentation
redoc-cli bundle openapi-spec.yaml -o api-docs.html

# Generate PDF (requires additional setup)
redoc-cli bundle openapi-spec.yaml -o api-docs.pdf --format pdf
```

### Option 4: Converting to Word Document

1. **Generate HTML first** using any of the above methods
2. **Open in Word**: Open the HTML file in Microsoft Word
3. **Save as Word**: Use "Save As" → "Word Document (.docx)"
4. **Alternative**: Use online converters like [Convertio](https://convertio.co/html-docx/) or [CloudConvert](https://cloudconvert.com/html-to-docx)

### Option 5: Converting to PDF

1. **Generate HTML first** using any of the above methods
2. **Browser Print**: Open HTML in browser → Print → Save as PDF
3. **Using wkhtmltopdf**:
   ```bash
   # Install wkhtmltopdf
   brew install wkhtmltopdf  # macOS
   
   # Convert HTML to PDF
   wkhtmltopdf api-docs.html api-docs.pdf
   ```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Prisma ORM

### Installation
```bash
cd server
npm install
npm run build  # Generate Prisma client
```

### Environment Variables
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/database"
NODE_ENV="development"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### Running the API
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Testing the API

### Health Check
```bash
curl http://localhost:4000/api/health
```

### Get Jobs
```bash
curl http://localhost:4000/api/jobs
```

### Create Application
```bash
curl -X POST http://localhost:4000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 1,
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "IN_PROGRESS"
  }'
```

## API Features

### Authentication
- Currently uses UUID-based user identification
- Future versions will include JWT authentication

### Error Handling
- Consistent error response format
- HTTP status codes for different error types
- Detailed error messages in development mode

### Data Validation
- Request body validation
- Path parameter validation
- Enum value validation for status fields

### Database Integration
- PostgreSQL with Prisma ORM
- Automatic BigInt handling
- Relationship management between entities

## Contributing

1. Update the OpenAPI specification in `openapi-spec.yaml`
2. Regenerate documentation using the tools above
3. Test API endpoints to ensure consistency
4. Update this README if needed

## License

ISC License - see package.json for details

## Support

For questions about the API specification or documentation generation, please refer to:
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger Tools](https://swagger.io/tools/)
- [Redoc Documentation](https://github.com/Redocly/redoc)
