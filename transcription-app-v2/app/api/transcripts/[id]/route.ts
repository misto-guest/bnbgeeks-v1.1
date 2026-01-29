import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { TranscriptSchema } from '@/types'

/**
 * GET /api/transcripts/[id]
 * Get a single transcript by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transcript = await prisma.transcript.findUnique({
      where: { id: params.id },
    })

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript not found' },
        { status: 404 }
      )
    }

    // Parse timestamps if they exist
    const response = {
      ...transcript,
      timestamps: transcript.timestamps
        ? JSON.parse(transcript.timestamps)
        : null,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching transcript:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/transcripts/[id]
 * Update a transcript
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = TranscriptSchema.partial().parse(body)

    // Parse timestamps if provided
    const data: any = { ...validatedData }
    if (validatedData.timestamps) {
      data.timestamps = JSON.stringify(validatedData.timestamps)
    }

    const transcript = await prisma.transcript.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json(transcript)
  } catch (error) {
    console.error('Error updating transcript:', error)
    return NextResponse.json(
      { error: 'Failed to update transcript' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/transcripts/[id]
 * Delete a transcript
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.transcript.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting transcript:', error)
    return NextResponse.json(
      { error: 'Failed to delete transcript' },
      { status: 500 }
    )
  }
}
