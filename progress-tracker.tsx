"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Target, Award, Flame, Dumbbell, Scale, Plus, Trophy } from "lucide-react"

interface ProgressEntry {
  id: string
  date: string
  weight?: number
  bodyFat?: number
  measurements?: {
    chest?: number
    waist?: number
    hips?: number
    arms?: number
    thighs?: number
  }
  workoutCompleted: boolean
  caloriesBurned?: number
  duration?: number
  notes?: string
}

interface UserProfile {
  name: string
  age: string
  goal: string
  fitnessLevel: string
  timeAvailable: number[]
  equipment: string[]
  restrictions: string[]
  dietaryPreferences: string[]
}

interface ProgressTrackerProps {
  userProfile: UserProfile
  onClose: () => void
}

export function ProgressTracker({ userProfile, onClose }: ProgressTrackerProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState<Partial<ProgressEntry>>({
    date: new Date().toISOString().split("T")[0],
    workoutCompleted: false,
  })

  // Mock progress data - in a real app, this would come from a database
  const [progressData, setProgressData] = useState<ProgressEntry[]>([
    {
      id: "1",
      date: "2024-01-01",
      weight: 180,
      bodyFat: 18,
      measurements: { chest: 42, waist: 34, hips: 38, arms: 15, thighs: 24 },
      workoutCompleted: true,
      caloriesBurned: 350,
      duration: 45,
      notes: "Great start to the year!",
    },
    {
      id: "2",
      date: "2024-01-08",
      weight: 179,
      bodyFat: 17.5,
      measurements: { chest: 42.5, waist: 33.5, hips: 38, arms: 15.2, thighs: 24.2 },
      workoutCompleted: true,
      caloriesBurned: 420,
      duration: 50,
      notes: "Feeling stronger",
    },
    {
      id: "3",
      date: "2024-01-15",
      weight: 178,
      bodyFat: 17,
      measurements: { chest: 43, waist: 33, hips: 37.5, arms: 15.5, thighs: 24.5 },
      workoutCompleted: true,
      caloriesBurned: 380,
      duration: 48,
      notes: "Visible muscle definition",
    },
    {
      id: "4",
      date: "2024-01-22",
      weight: 177,
      bodyFat: 16.5,
      measurements: { chest: 43.5, waist: 32.5, hips: 37, arms: 15.8, thighs: 25 },
      workoutCompleted: true,
      caloriesBurned: 450,
      duration: 52,
      notes: "Hit new PR on bench press!",
    },
  ])

  const addProgressEntry = () => {
    const entry: ProgressEntry = {
      id: Date.now().toString(),
      date: newEntry.date || new Date().toISOString().split("T")[0],
      weight: newEntry.weight,
      bodyFat: newEntry.bodyFat,
      measurements: newEntry.measurements,
      workoutCompleted: newEntry.workoutCompleted || false,
      caloriesBurned: newEntry.caloriesBurned,
      duration: newEntry.duration,
      notes: newEntry.notes,
    }

    setProgressData([...progressData, entry])
    setNewEntry({ date: new Date().toISOString().split("T")[0], workoutCompleted: false })
    setShowAddEntry(false)
  }

  // Calculate statistics
  const latestEntry = progressData[progressData.length - 1]
  const firstEntry = progressData[0]
  const weightChange = latestEntry?.weight && firstEntry?.weight ? latestEntry.weight - firstEntry.weight : 0
  const totalWorkouts = progressData.filter((entry) => entry.workoutCompleted).length
  const totalCalories = progressData.reduce((sum, entry) => sum + (entry.caloriesBurned || 0), 0)
  const avgDuration = progressData.reduce((sum, entry) => sum + (entry.duration || 0), 0) / progressData.length

  // Chart data
  const weightData = progressData
    .filter((entry) => entry.weight)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      weight: entry.weight,
      bodyFat: entry.bodyFat,
    }))

  const workoutData = progressData.map((entry) => ({
    date: new Date(entry.date).toLocaleDateString(),
    calories: entry.caloriesBurned || 0,
    duration: entry.duration || 0,
  }))

  const measurementData = progressData
    .filter((entry) => entry.measurements)
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString(),
      chest: entry.measurements?.chest || 0,
      waist: entry.measurements?.waist || 0,
      arms: entry.measurements?.arms || 0,
    }))

  const goalProgress = () => {
    switch (userProfile.goal) {
      case "weight-loss":
        return (Math.abs(weightChange) / 10) * 100 // Assuming 10lb goal
      case "muscle-gain":
        return (Math.abs(weightChange) / 5) * 100 // Assuming 5lb goal
      case "strength":
        return (totalWorkouts / 20) * 100 // Assuming 20 workout goal
      default:
        return (totalWorkouts / 15) * 100
    }
  }

  const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7"]

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Progress Tracker</h1>
            <p className="text-muted-foreground">Track your fitness journey and celebrate your achievements</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddEntry(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="body">Body Metrics</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(goalProgress())}%</div>
                  <Progress value={goalProgress()} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Weight Change</CardTitle>
                  <Scale className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {weightChange > 0 ? "+" : ""}
                    {weightChange.toFixed(1)} lbs
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.goal === "weight-loss" ? "Lost" : "Gained"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalWorkouts}</div>
                  <p className="text-xs text-muted-foreground">Avg {avgDuration.toFixed(0)} min/session</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Total burned</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Weight Progress</CardTitle>
                <CardDescription>Your weight and body fat percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} />
                    <Line type="monotone" dataKey="bodyFat" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="body" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Body Measurements</CardTitle>
                  <CardDescription>Track changes in your body composition</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={measurementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="chest" stroke="#059669" strokeWidth={2} />
                      <Line type="monotone" dataKey="waist" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="arms" stroke="#34d399" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Latest Measurements</CardTitle>
                  <CardDescription>Most recent body measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestEntry?.measurements && (
                    <div className="space-y-4">
                      {Object.entries(latestEntry.measurements).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="capitalize">{key}</span>
                          <Badge variant="secondary">{value}"</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Workout Performance</CardTitle>
                <CardDescription>Calories burned and workout duration over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#059669" />
                    <Bar dataKey="duration" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {progressData
                .filter((entry) => entry.workoutCompleted)
                .map((entry) => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">
                        {new Date(entry.date).toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Duration</span>
                          <span className="font-medium">{entry.duration} min</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Calories</span>
                          <span className="font-medium">{entry.caloriesBurned}</span>
                        </div>
                        {entry.notes && <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-primary" />
                    <CardTitle className="font-heading">First Workout</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Completed your first workout session</p>
                  <Badge className="mt-2">Unlocked</Badge>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-primary" />
                    <CardTitle className="font-heading">Consistency King</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Worked out 4 times in a row</p>
                  <Badge className="mt-2">Unlocked</Badge>
                </CardContent>
              </Card>

              <Card className="border-muted">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Flame className="w-6 h-6 text-muted-foreground" />
                    <CardTitle className="font-heading text-muted-foreground">Calorie Crusher</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Burn 2000 calories in total</p>
                  <div className="mt-2">
                    <Progress value={(totalCalories / 2000) * 100} />
                    <p className="text-xs text-muted-foreground mt-1">{totalCalories}/2000 calories</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Entry Modal */}
        {showAddEntry && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="font-heading">Add Progress Entry</CardTitle>
                <CardDescription>Record your latest measurements and workout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="180"
                      value={newEntry.weight || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, weight: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bodyFat">Body Fat (%)</Label>
                    <Input
                      id="bodyFat"
                      type="number"
                      placeholder="15"
                      value={newEntry.bodyFat || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, bodyFat: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories Burned</Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="350"
                      value={newEntry.caloriesBurned || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, caloriesBurned: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="45"
                      value={newEntry.duration || ""}
                      onChange={(e) => setNewEntry({ ...newEntry, duration: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="How did you feel today?"
                    value={newEntry.notes || ""}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addProgressEntry}>Add Entry</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
