#!/bin/bash

# Demo script to view Job Agents API Documentation
# This script opens the generated documentation in your default browser

echo "🌐 Opening Job Agents API Documentation..."

# Check if documentation exists
if [ ! -f "./docs/openapi-html/index.html" ]; then
    echo "❌ Documentation not found. Please run ./generate-docs.sh first."
    exit 1
fi

echo "📚 Available documentation formats:"
echo "  1. OpenAPI Generator HTML (Interactive)"
echo "  2. Redoc HTML (Modern, responsive)"
echo "  3. Markdown files"
echo "  4. Postman collection"
echo ""

# Open the main HTML documentation
echo "🚀 Opening interactive API documentation..."
if command -v open &> /dev/null; then
    # macOS
    open ./docs/openapi-html/index.html
elif command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open ./docs/openapi-html/index.html
elif command -v start &> /dev/null; then
    # Windows
    start ./docs/openapi-html/index.html
else
    echo "⚠️  Could not automatically open browser. Please manually open:"
    echo "   ./docs/openapi-html/index.html"
fi

echo ""
echo "🎯 Documentation Features:"
echo "  ✅ Interactive API explorer"
echo "  ✅ Request/response examples"
echo "  ✅ Schema definitions"
echo "  ✅ Try-it-out functionality"
echo "  ✅ Mobile-responsive design"
echo ""
echo "📖 Other documentation formats:"
echo "  - Redoc version: ./docs/api-docs-redoc.html"
echo "  - Markdown files: ./docs/markdown/"
echo "  - Postman collection: ./docs/postman/postman.json"
echo ""
echo "🔄 To regenerate documentation: ./generate-docs.sh"
echo "📄 To convert to PDF/Word: ./convert-to-pdf-word.sh"
