import Link from 'next/link'
import { ArrowRight, BarChart3, FileText, Settings } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Transcription App V2
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
            Modern transcription management with analytics, search, and powerful features
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Transcripts"
              description="Manage and search all your transcripts"
              href="/transcripts"
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Analytics"
              description="Track usage, costs, and insights"
              href="/dashboard"
            />
            <FeatureCard
              icon={<Settings className="w-8 h-8" />}
              title="Settings"
              description="Customize your experience"
              href="/settings"
            />
          </div>

          <Link
            href="/transcripts"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Link>
  )
}
