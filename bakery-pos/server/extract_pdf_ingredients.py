import PyPDF2
import re
import sys

# Get the PDF path from command line argument
pdf_path = sys.argv[1] if len(sys.argv) > 1 else None

if not pdf_path:
    print("Please provide PDF path as argument")
    sys.exit(1)

try:
    # Open and read the PDF
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        
        print(f"📄 PDF has {len(pdf_reader.pages)} page(s)\n")
        
        # Extract text from all pages
        full_text = ""
        for page_num, page in enumerate(pdf_reader.pages):
            text = page.extract_text()
            print(f"--- Page {page_num + 1} ---")
            print(text)
            print("\n" + "="*50 + "\n")
            full_text += text + "\n"
        
        # Try to find ingredients
        print("\n🔍 EXTRACTED TEXT (for ingredient identification):")
        print(full_text)
        
except FileNotFoundError:
    print(f"❌ File not found: {pdf_path}")
except Exception as e:
    print(f"❌ Error reading PDF: {e}")
