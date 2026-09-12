import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    return NextResponse.json({
        status: 'API is guarded',
        time: new Date().toISOString()
    });
}

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

export async function POST(request: Request) {
    // 1. Authentication Check (NextAuth v5)
    const session = await auth();

    if (!session || !session.user) {
        console.warn('>>> API/UPLOAD: Unauthorized access attempt (No Session)');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('>>> API/UPLOAD: No file found in FormData');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 2. File Type Validation
        const rawExt = file.name.split('.').pop()?.toLowerCase() || '';
        if (!ALLOWED_EXTENSIONS.includes(rawExt)) {
            console.error(`>>> API/UPLOAD: Blocked forbidden file extension: .${rawExt}`);
            return NextResponse.json({ error: 'Invalid file type. Only images and PDFs allowed.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine upload directory
        let uploadDir: string;
        if (process.env.UPLOAD_DIR) {
            uploadDir = process.env.UPLOAD_DIR;
        } else {
            uploadDir = join(process.cwd(), 'public', 'uploads');
        }

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Folder exists
        }

        // Generate unique filename
        const filename = `${uuidv4()}.${rawExt}`;
        const path = join(uploadDir, filename);

        await writeFile(path, buffer);

        const url = `/uploads/${filename}`;
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('>>> API/UPLOAD: CRITICAL ERROR:', error);
        return NextResponse.json({
            error: 'Upload failed internal server error',
            details: error.message
        }, { status: 500 });
    }
}
