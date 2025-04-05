#!/bin/bash

# ================================================
# Setup Lofts des Arts Building and Resident Data
# ================================================
# Prerequisites:
# 1. Supabase CLI installed
# 2. Already authenticated with Supabase
# ================================================

# Source environment variables if .env exists
if [ -f .env ]; then
  source .env
fi

# Check if Supabase URL and key are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Error: Supabase URL and/or key are not set. Make sure they are in your .env file."
  exit 1
fi

echo "Starting Lofts des Arts data setup..."

# Execute the Building Data Setup SQL
echo "Setting up building data..."
npx supabase db execute --file=sql/building_data_setup.sql

# Execute the Resident Data Setup SQL
echo "Setting up resident data..."
npx supabase db execute --file=sql/resident_data_setup.sql

# Execute data verification script
echo "Verifying data setup..."
npx supabase db execute --file=sql/verify_building_data.sql

echo "Data setup completed successfully!"

# Make this script executable by running: chmod +x scripts/setup_lda_data.sh
# Run this script with: ./scripts/setup_lda_data.sh 