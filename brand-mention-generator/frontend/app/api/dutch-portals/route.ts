import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the Dutch portals search results JSON file
    const filePath = path.join(process.cwd(), '../backend/data/dutch-portals-search-results.json');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Dutch portals data not found. Please run the extraction script first.' },
        { status: 404 }
      );
    }

    // Read and parse the JSON file
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading Dutch portals data:', error);
    return NextResponse.json(
      { error: 'Failed to load Dutch portals data' },
      { status: 500 }
    );
  }
}
