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

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      
      // Fetch count
      const countResponse = await fetch('/api/subscribers?count=true')
      const countData = await countResponse.json()
      setCount(countData.count)

      // Fetch all subscribers
      const subscribersResponse = await fetch('/api/subscribers')
      const subscribersData = await subscribersResponse.json()
      setSubscribers(subscribersData.subscribers)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load subscribers')
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    try {
      const response = await fetch('/api/setup-db', { method: 'POST' })
      const data = await response.json()
      
      if (data.success) {
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
              <div className="text-2xl font-bold">{count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opted In</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscribers.filter(s => s.opt_in).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Opted Out</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subscribers.filter(s => !s.opt_in).length}
              </div>
            </CardContent>
          </Card>
        </div>

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
                          {new Date(subscriber.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          {new Date(subscriber.timestamp).toLocaleDateString()}
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
