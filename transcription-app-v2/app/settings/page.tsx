'use client'

import { useEffect, useState } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Monitor } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  defaultProvider: string
  defaultModel: string
  autoSave: boolean
  maxTranscripts: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'system',
    defaultProvider: 'openai',
    defaultModel: 'gpt-4',
    autoSave: true,
    maxTranscripts: 100,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      // Apply theme immediately
      applyTheme(settings.theme)
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Customize your transcription experience
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => {
                    const Icon = theme.icon
                    const isActive = settings.theme === theme.value
                    return (
                      <button
                        key={theme.value}
                        onClick={() => setSettings({ ...settings, theme: theme.value })}
                        className={`
                          flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
                          ${isActive
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                          }
                        `}
                      >
                        <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{theme.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Default Provider Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Provider</label>
              <select
                value={settings.defaultProvider}
                onChange={(e) => setSettings({ ...settings, defaultProvider: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default Model</label>
              <input
                type="text"
                value={settings.defaultModel}
                onChange={(e) => setSettings({ ...settings, defaultModel: e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Transcript Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto-save transcripts</div>
                <div className="text-sm text-muted-foreground">
                  Automatically save transcripts when created
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${settings.autoSave ? 'bg-primary' : 'bg-input'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${settings.autoSave ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Maximum transcripts to keep
              </label>
              <input
                type="number"
                value={settings.maxTranscripts}
                onChange={(e) => setSettings({ ...settings, maxTranscripts: parseInt(e.target.value) || 100 })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                min="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Oldest transcripts will be deleted when this limit is reached
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchSettings()}
            disabled={saving}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
