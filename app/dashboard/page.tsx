"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Subscriber {
  id: number
  email: string
  opt_in: boolean
  timestamp: string
  created_at: string
}

export default function Dashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [importing, setImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)

  // Only show admin tools (DB setup + import) during development by default
  const showAdminTools = process.env.NODE_ENV !== 'production'

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)

      // Fetch count
      const countResponse = await fetch('/api/subscribers?count=true')
      const countData = await safeJson(countResponse)
      setCount(Number(countData?.count) || 0)

      // Fetch all subscribers
      const subscribersResponse = await fetch('/api/subscribers')
      const subscribersData = await safeJson(subscribersResponse)
      const list: Subscriber[] = Array.isArray(subscribersData?.subscribers) ? subscribersData.subscribers : []
      setSubscribers(list)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load subscribers')
      setCount(0)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }

  const safeJson = async (res: Response) => {
    try {
      if (!res.ok) {
        return {}
      }
      return await res.json()
    } catch {
      return {}
    }
  }

  const setupDatabase = async () => {
    try {
      const response = await fetch('/api/setup-db', { method: 'POST' })
      const data = await safeJson(response)

      if ((data as any)?.success) {
        alert('Database setup successful!')
        fetchSubscribers()
      } else {
        alert('Database setup failed')
      }
    } catch (error) {
      console.error('Setup error:', error)
      alert('Database setup failed')
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setImporting(true)
      setImportResults(null)

      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      
      // Skip header row if it exists
      const dataLines = lines[0]?.toLowerCase().includes('email') ? lines.slice(1) : lines
      
      const subscribers = dataLines.map(line => {
        const [email, optIn] = line.split(',').map(field => field.trim())
        return {
          email: email || '',
          optIn: optIn === 'true' || optIn === 'yes' || optIn === '1'
        }
      }).filter(sub => sub.email && sub.email.includes('@'))

      if (subscribers.length === 0) {
        alert('No valid email addresses found in CSV')
        return
      }

      const response = await fetch('/api/import-subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscribers })
      })

      const result = await response.json()
      setImportResults(result)

      if (result.success) {
        alert(`Import completed! ${result.results.imported} imported, ${result.results.skipped} skipped.`)
        fetchSubscribers() // Refresh the list
      } else {
        alert('Import failed: ' + result.error)
      }

    } catch (error) {
      console.error('Import error:', error)
      alert('Failed to import CSV file')
    } finally {
      setImporting(false)
      // Reset file input
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  // Derived metrics with safety
  const optedIn = subscribers.filter((s) => Boolean(s?.opt_in)).length
  const optedOut = subscribers.filter((s) => !Boolean(s?.opt_in)).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Matees Dashboard</h1>
          <p className="text-gray-600">Manage your early access subscribers</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number.isFinite(count) ? count : 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opted In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optedIn}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opted Out</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{optedOut}</div>
            </CardContent>
          </Card>
        </div>

        {showAdminTools && (
          <>
            {/* Database Setup */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Database Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <button
                  onClick={setupDatabase}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Setup Database Tables
                </button>
                <p className="text-sm text-gray-600 mt-2">
                  Run this if you haven't set up the database tables yet.
                </p>
              </CardContent>
            </Card>

            {/* Import Subscribers */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Import Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV File
                    </label>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      disabled={importing}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>CSV format: <code>email,optIn</code></p>
                    <p>Example: <code>user@example.com,true</code></p>
                    <p>• First column: Email address (required)</p>
                    <p>• Second column: Opt-in status (true/false, optional, defaults to true)</p>
                  </div>
                  {importing && (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Importing subscribers...
                    </div>
                  )}
                  {importResults && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Import Results:</h4>
                      <p>Total: {importResults.results?.total}</p>
                      <p>Imported: {importResults.results?.imported}</p>
                      <p>Skipped: {importResults.results?.skipped}</p>
                      {importResults.results?.errors?.length > 0 && (
                        <div className="mt-2">
                          <p className="font-medium text-red-600">Errors:</p>
                          <ul className="text-sm text-red-600 list-disc list-inside">
                            {importResults.results.errors.slice(0, 5).map((error: string, index: number) => (
                              <li key={index}>{error}</li>
                            ))}
                            {importResults.results.errors.length > 5 && (
                              <li>... and {importResults.results.errors.length - 5} more errors</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Subscribers List */}
        <Card>
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-600">{error}</div>
            ) : subscribers.length === 0 ? (
              <div className="text-gray-500 text-center py-8">No subscribers yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Opt In</th>
                      <th className="text-left py-2">Created</th>
                      <th className="text-left py-2">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b">
                        <td className="py-2">{subscriber.email}</td>
                        <td className="py-2">
                          {subscriber.opt_in ? (
                            <span className="text-green-600">✓ Yes</span>
                          ) : (
                            <span className="text-red-600">✗ No</span>
                          )}
                        </td>
                        <td className="py-2">
                          {subscriber.created_at ? new Date(subscriber.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-2">
                          {subscriber.timestamp ? new Date(subscriber.timestamp).toLocaleDateString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
