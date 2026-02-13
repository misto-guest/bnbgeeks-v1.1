#!/bin/bash
# Setup script for SEO Query Manager

echo "🚀 Setting up SEO Query Manager..."

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    
    echo ""
    echo "⚠️  IMPORTANT: Edit .env file and add your SERPER_API_KEY"
    echo "   nano .env"
    echo ""
fi

# Copy .env from parent directory if it exists (for shared API key)
if [ -f "../.env" ] && [ ! -f ".env" ]; then
    echo "📋 Copying .env from parent directory..."
    cp ../.env .env
fi

# Initialize database
echo "🗄️  Initializing database..."
python3 -c "from models import Database; db = Database(); print('✓ Database initialized')"

# Create logs directory
mkdir -p logs

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env and add your SERPER_API_KEY"
echo "   2. Start the server: ./start.sh"
echo "   3. Open http://localhost:5001"
echo ""
