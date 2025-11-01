"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, MessageCircle, Target, TrendingUp, Apple, Calendar } from "lucide-react"
import { OnboardingFlow } from "@/components/onboarding-flow"
import EnhancedChatInterface from "@/components/chat-interface"
import { WorkoutPlanner } from "@/components/workout-planner"
import { ProgressTracker } from "@/components/progress-tracker"
import { NutritionPlanner } from "@/components/nutrition-planner"

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

export default function HomePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [showWorkoutPlanner, setShowWorkoutPlanner] = useState(false)
  const [showProgressTracker, setShowProgressTracker] = useState(false)
  const [showNutritionPlanner, setShowNutritionPlanner] = useState(false)

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile)
    setShowOnboarding(false)
  }

  const handleOpenChat = () => {
    setShowChat(true)
    setIsChatMinimized(false)
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setIsChatMinimized(false)
  }

  const handleMinimizeChat = () => {
    setIsChatMinimized(!isChatMinimized)
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />
  }

  if (showWorkoutPlanner && userProfile) {
    return <WorkoutPlanner userProfile={userProfile} onClose={() => setShowWorkoutPlanner(false)} />
  }

  if (showProgressTracker && userProfile) {
    return <ProgressTracker userProfile={userProfile} onClose={() => setShowProgressTracker(false)} />
  }

  if (showNutritionPlanner && userProfile) {
    return <NutritionPlanner userProfile={userProfile} onClose={() => setShowNutritionPlanner(false)} />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-heading font-bold">FitBot</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome back, {userProfile?.name}!</span>
            <Button variant="outline" size="sm" onClick={handleOpenChat}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Personalized Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold mb-2">
            Ready to achieve your {userProfile?.goal?.replace("-", " ")} goals?
          </h2>
          <p className="text-muted-foreground">
            Based on your {userProfile?.fitnessLevel} fitness level, we've prepared a personalized plan for you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle className="font-heading">Quick Actions</CardTitle>
              <CardDescription>Get started with your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2 bg-transparent">
                  <Target className="w-6 h-6 text-primary" />
                  <span className="font-heading">Update Goals</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col gap-2 bg-transparent"
                  onClick={() => setShowWorkoutPlanner(true)}
                >
                  <Calendar className="w-6 h-6 text-primary" />
                  <span className="font-heading">Plan Workout</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col gap-2 bg-transparent"
                  onClick={() => setShowProgressTracker(true)}
                >
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="font-heading">Track Progress</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col gap-2 bg-transparent"
                  onClick={() => setShowNutritionPlanner(true)}
                >
                  <Apple className="w-6 h-6 text-primary" />
                  <span className="font-heading">Nutrition</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Today's Workout */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Today's Workout</CardTitle>
              <CardDescription>
                {userProfile?.goal === "weight-loss"
                  ? "HIIT Cardio"
                  : userProfile?.goal === "muscle-gain"
                    ? "Upper Body Strength"
                    : userProfile?.goal === "strength"
                      ? "Compound Movements"
                      : userProfile?.goal === "endurance"
                        ? "Cardio Endurance"
                        : "Full Body Workout"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Duration</span>
                  <span className="font-medium">{userProfile?.timeAvailable[0]} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Equipment</span>
                  <span className="font-medium">
                    {userProfile?.equipment.length === 0
                      ? "Bodyweight"
                      : userProfile?.equipment.includes("None (Bodyweight)")
                        ? "Bodyweight"
                        : userProfile?.equipment[0]}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Level</span>
                  <span className="font-medium capitalize">{userProfile?.fitnessLevel}</span>
                </div>
              </div>
              <Button className="w-full mt-4 font-heading" onClick={() => setShowWorkoutPlanner(true)}>
                Start Workout
              </Button>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">This Week</CardTitle>
              <CardDescription>Your progress summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Workouts</span>
                  <span className="font-medium">3/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Calories Burned</span>
                  <span className="font-medium">1,240</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Active Days</span>
                  <span className="font-medium">4/7</span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: "60%" }}></div>
              </div>
            </CardContent>
          </Card>

          {/* AI Chat Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading">Ask FitBot</CardTitle>
              <CardDescription>Get instant fitness advice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded-lg text-sm">"How can I improve my squat form?"</div>
                <div className="bg-primary/10 p-3 rounded-lg text-sm">
                  Focus on keeping your chest up, knees tracking over toes, and engaging your core throughout the
                  movement.
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 font-heading bg-transparent" onClick={handleOpenChat}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Open Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Chat Interface */}
      {showChat && <EnhancedChatInterface onClose={handleCloseChat} />}
    </div>
  )
}
