#!/bin/bash

# Job Agents API Documentation Generator
# This script generates HTML documentation from the OpenAPI specification

set -e

echo "🚀 Generating Job Agents API Documentation..."

# Check if OpenAPI Generator is installed
if ! command -v openapi-generator-cli &> /dev/null; then
    echo "📦 Installing OpenAPI Generator..."
    npm install -g @openapitools/openapi-generator-cli
fi

# Check if Redoc is installed
if ! command -v redoc-cli &> /dev/null; then
    echo "📦 Installing Redoc..."
    npm install -g redoc-cli
fi

# Create docs directory
mkdir -p docs

echo "📄 Generating HTML documentation with OpenAPI Generator..."
openapi-generator-cli generate \
    -i openapi-spec.yaml \
    -g html2 \
    -o ./docs/openapi-html

echo "📄 Generating HTML documentation with Redoc..."
redoc-cli bundle openapi-spec.yaml -o ./docs/api-docs-redoc.html

echo "📄 Generating Markdown documentation..."
openapi-generator-cli generate \
    -i openapi-spec.yaml \
    -g markdown \
    -o ./docs/markdown

echo "📄 Generating Postman collection..."
openapi-generator-cli generate \
    -i openapi-spec.yaml \
    -g postman-collection \
    -o ./docs/postman

echo "✅ Documentation generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  - ./docs/openapi-html/ - HTML documentation (OpenAPI Generator)"
echo "  - ./docs/api-docs-redoc.html - HTML documentation (Redoc)"
echo "  - ./docs/markdown/ - Markdown documentation"
echo "  - ./docs/postman/ - Postman collection"
echo ""
echo "🔄 To convert to other formats:"
echo "  - PDF: Open HTML files in browser and print to PDF"
echo "  - Word: Open HTML files in Microsoft Word and save as .docx"
echo "  - Or use online converters for HTML to PDF/Word conversion"
echo ""
echo "🌐 View documentation:"
echo "  - Open ./docs/openapi-html/index.html in your browser"
echo "  - Or open ./docs/api-docs-redoc.html for Redoc version"
