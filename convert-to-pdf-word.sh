#!/bin/bash

# Convert Job Agents API Documentation to PDF and Word formats
# This script provides multiple options for converting HTML documentation

set -e

echo "🔄 Converting Job Agents API Documentation to PDF and Word formats..."

# Check if we have the HTML files
if [ ! -f "./docs/api-docs-redoc.html" ]; then
    echo "❌ HTML documentation not found. Please run ./generate-docs.sh first."
    exit 1
fi

# Create output directory
mkdir -p ./docs/converted

echo "📄 Converting to PDF..."

# Option 1: Using wkhtmltopdf (if available)
if command -v wkhtmltopdf &> /dev/null; then
    echo "  Using wkhtmltopdf..."
    wkhtmltopdf --page-size A4 --margin-top 20 --margin-bottom 20 --margin-left 20 --margin-right 20 \
        --header-html <(echo '<!DOCTYPE html><html><head><style>body{margin:0;padding:10px;font-family:Arial,sans-serif;font-size:12px;color:#666;}</style></head><body>Job Agents API Documentation</body></html>') \
        --footer-html <(echo '<!DOCTYPE html><html><head><style>body{margin:0;padding:10px;font-family:Arial,sans-serif;font-size:10px;color:#999;text-align:center;}</style></head><body>Page [page] of [topage]</body></html>') \
        ./docs/api-docs-redoc.html ./docs/converted/job-agents-api-redoc.pdf
    
    echo "  ✅ PDF generated: ./docs/converted/job-agents-api-redoc.pdf"
else
    echo "  ⚠️  wkhtmltopdf not found. Install with: brew install wkhtmltopdf (macOS) or apt-get install wkhtmltopdf (Ubuntu)"
fi

# Option 2: Using pandoc (if available)
if command -v pandoc &> /dev/null; then
    echo "  Using pandoc..."
    pandoc ./docs/api-docs-redoc.html -o ./docs/converted/job-agents-api-pandoc.pdf \
        --pdf-engine=wkhtmltopdf \
        --variable geometry:margin=1in \
        --variable fontsize=11pt
    
    echo "  ✅ PDF generated: ./docs/converted/job-agents-api-pandoc.pdf"
else
    echo "  ⚠️  pandoc not found. Install with: brew install pandoc (macOS) or apt-get install pandoc (Ubuntu)"
fi

echo ""
echo "📝 Converting to Word document..."

# Option 1: Using pandoc for Word
if command -v pandoc &> /dev/null; then
    echo "  Using pandoc..."
    pandoc ./docs/api-docs-redoc.html -o ./docs/converted/job-agents-api.docx \
        --from html \
        --to docx \
        --reference-doc <(echo '<!DOCTYPE html><html><head><style>body{font-family:"Calibri",sans-serif;font-size:11pt;}</style></head><body></body></html>')
    
    echo "  ✅ Word document generated: ./docs/converted/job-agents-api.docx"
else
    echo "  ⚠️  pandoc not found. Install with: brew install pandoc (macOS) or apt-get install pandoc (Ubuntu)"
fi

echo ""
echo "🌐 Manual conversion options:"
echo "  1. Open ./docs/api-docs-redoc.html in your browser"
echo "     - Print → Save as PDF"
echo "     - Or use browser's 'Save as PDF' option"
echo ""
echo "  2. Open ./docs/api-docs-redoc.html in Microsoft Word"
echo "     - File → Save As → Word Document (.docx)"
echo ""
echo "  3. Online converters:"
echo "     - HTML to PDF: https://www.ilovepdf.com/html-to-pdf"
echo "     - HTML to Word: https://convertio.co/html-docx/"
echo ""
echo "📁 Generated files:"
ls -la ./docs/converted/ 2>/dev/null || echo "  No converted files yet. Use manual conversion options above."

echo ""
echo "🎯 Next steps:"
echo "  - Open ./docs/openapi-html/index.html for interactive API documentation"
echo "  - Use the converted files for sharing or printing"
echo "  - The OpenAPI spec (openapi-spec.yaml) can be imported into tools like Postman or Swagger UI"
