'use client'

import { useEffect, useState } from 'react'

interface UsageData {
  date: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
  cost: number
}

export default function Home() {
  const [usage, setUsage] = useState<UsageData[]>([])
  const [totalCost, setTotalCost] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [remainingBudget, setRemainingBudget] = useState(100) // Default $100 budget

  // Load usage data from localStorage
  useEffect(() => {
    const savedUsage = localStorage.getItem('glm-usage')
    if (savedUsage) {
      const parsed = JSON.parse(savedUsage)
      setUsage(parsed)
      
      const total = parsed.reduce((sum: number, entry: UsageData) => sum + entry.cost, 0)
      setTotalCost(total)
      
      const tokens = parsed.reduce((sum: number, entry: UsageData) => sum + entry.totalTokens, 0)
      setTotalTokens(tokens)
    }

    const savedBudget = localStorage.getItem('glm-budget')
    if (savedBudget) {
      setRemainingBudget(parseFloat(savedBudget))
    }
  }, [])

  // Add new usage entry
  const addUsage = (input: number, output: number) => {
    // GLM 4.7 pricing (example - adjust based on actual rates)
    const inputCost = (input / 1000) * 0.0001 // $0.0001 per 1k input tokens
    const outputCost = (output / 1000) * 0.0002 // $0.0002 per 1k output tokens
    const total = inputCost + outputCost
    const entry: UsageData = {
      date: new Date().toISOString(),
      inputTokens: input,
      outputTokens: output,
      totalTokens: input + output,
      cost: total
    }

    const newUsage = [entry, ...usage]
    setUsage(newUsage)
    setTotalCost(totalCost + total)
    setTotalTokens(totalTokens + entry.totalTokens)
    setRemainingBudget(remainingBudget - total)

    localStorage.setItem('glm-usage', JSON.stringify(newUsage))
  }

  const budgetPercent = ((remainingBudget / 100) * 100)
  const isLow = budgetPercent < 20
  const isCritical = budgetPercent < 5

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GLM 4.7 Usage Dashboard</h1>
          <p className="text-gray-600">Track your API usage and costs</p>
        </div>

        {/* Budget Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Budget</h2>
              <p className="text-gray-600">${remainingBudget.toFixed(2)} remaining</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isCritical ? 'bg-red-100 text-red-800' :
              isLow ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {isCritical ? '⚠️ CRITICAL' : isLow ? '⚠️ Low' : '✅ Good'}
            </div>
          </div>

          {/* Budget Bar */}
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-300 ${
                isCritical ? 'bg-red-500' :
                isLow ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${budgetPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>$0</span>
            <span>${totalCost.toFixed(2)} spent</span>
            <span>$100 budget</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Tokens</h3>
            <p className="text-3xl font-bold text-blue-600">{totalTokens.toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Cost</h3>
            <p className="text-3xl font-bold text-green-600">${totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
            <p className="text-3xl font-bold text-purple-600">{usage.length}</p>
            <p className="text-sm text-gray-600 mt-1">API calls</p>
          </div>
        </div>

        {/* Usage Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Usage</h2>
          <div className="space-y-3">
            {usage.slice(0, 10).map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {entry.inputTokens.toLocaleString()} in / {entry.outputTokens.toLocaleString()} out
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.date).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${entry.cost.toFixed(4)}</p>
                  <p className="text-sm text-gray-600">{entry.totalTokens.toLocaleString()} tokens</p>
                </div>
              </div>
            ))}
            {usage.length === 0 && (
              <p className="text-gray-500 text-center py-8">No usage data yet</p>
            )}
          </div>
        </div>

        {/* Manual Entry */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Log Usage Manually</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Input Tokens</label>
              <input
                type="number"
                id="inputTokens"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 8600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Tokens</label>
              <input
                type="number"
                id="outputTokens"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 412"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const input = parseInt((document.getElementById('inputTokens') as HTMLInputElement).value)
                  const output = parseInt((document.getElementById('outputTokens') as HTMLInputElement).value)
                  if (input && output) {
                    addUsage(input, output)
                    ;(document.getElementById('inputTokens') as HTMLInputElement).value = ''
                    ;(document.getElementById('outputTokens') as HTMLInputElement).value = ''
                  }
                }}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
