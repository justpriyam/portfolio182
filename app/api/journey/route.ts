import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'journey.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'journey');

interface JourneyItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  createdAt: string;
}

interface JourneyData {
  items: JourneyItem[];
}

function readData(): JourneyData {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { items: [] };
  }
}

function writeData(data: JourneyData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// GET — return all journey items
export async function GET() {
  const data = readData();
  return NextResponse.json(data.items);
}

// POST — upload a new journey item (multipart form)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const title = (formData.get('title') as string) || 'Untitled Achievement';
    const description = (formData.get('description') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF, AVIF' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueId = `journey-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${uniqueId}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Ensure upload directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Save to JSON database
    const data = readData();
    const newItem: JourneyItem = {
      id: uniqueId,
      title,
      description,
      imagePath: `/images/journey/${fileName}`,
      createdAt: new Date().toISOString(),
    };
    data.items.push(newItem);
    writeData(data);

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE — remove a journey item by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const data = readData();
    const itemIndex = data.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = data.items[itemIndex];

    // Delete the image file from disk if it's in the journey folder
    if (item.imagePath.startsWith('/images/journey/')) {
      const fullPath = path.join(process.cwd(), 'public', item.imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Remove from JSON database
    data.items.splice(itemIndex, 1);
    writeData(data);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
