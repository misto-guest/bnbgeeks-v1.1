import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { UserSettings } from '@/types'

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  defaultProvider: 'assemblyai',
  defaultModel: 'best',
  autoSave: true,
  maxTranscripts: 100,
}

/**
 * GET /api/settings
 * Get all user settings
 */
export async function GET() {
  try {
    const settings = await prisma.setting.findMany()

    const settingsMap = settings.reduce((acc, setting) => {
      try {
        acc[setting.key] = JSON.parse(setting.value)
      } catch {
        acc[setting.key] = setting.value
      }
      return acc
    }, {} as Record<string, any>)

    // Merge with defaults
    const userSettings = {
      ...DEFAULT_SETTINGS,
      ...settingsMap,
    }

    return NextResponse.json(userSettings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/settings
 * Update user settings
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updates: Record<string, any> = body

    // Create or update each setting
    const operations = Object.entries(updates).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: {
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        },
        update: {
          value: typeof value === 'object' ? JSON.stringify(value) : String(value),
        },
      })
    )

    await Promise.all(operations)

    // Return updated settings
    return NextResponse.json({ success: true, settings: updates })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
