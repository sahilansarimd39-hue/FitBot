"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Clock, Dumbbell, Play, RotateCcw, CheckCircle, Target, Zap, Heart, Flame } from "lucide-react"

interface Exercise {
  id: string
  name: string
  sets: number
  reps: string
  duration?: string
  restTime: number
  instructions: string
  targetMuscles: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface Workout {
  id: string
  name: string
  description: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  type: "strength" | "cardio" | "flexibility" | "hiit"
  equipment: string[]
  exercises: Exercise[]
  caloriesBurned: number
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

interface WorkoutPlannerProps {
  userProfile: UserProfile
  onClose: () => void
}

export function WorkoutPlanner({ userProfile, onClose }: WorkoutPlannerProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isWorkoutActive, setIsWorkoutActive] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

  // Generate workouts based on user profile
  const generateWorkouts = (): Workout[] => {
    const { goal, fitnessLevel, timeAvailable, equipment } = userProfile
    const duration = timeAvailable[0]
    const hasEquipment = !equipment.includes("None (Bodyweight)")

    const workouts: Workout[] = []

    // Strength Training Workout
    if (goal === "muscle-gain" || goal === "strength") {
      workouts.push({
        id: "strength-1",
        name: "Upper Body Strength",
        description: "Build muscle and strength in your upper body",
        duration: duration,
        difficulty: fitnessLevel as any,
        type: "strength",
        equipment: hasEquipment ? equipment : ["None (Bodyweight)"],
        caloriesBurned: Math.round(duration * 6),
        exercises: [
          {
            id: "push-ups",
            name: hasEquipment && equipment.includes("Dumbbells") ? "Dumbbell Chest Press" : "Push-ups",
            sets: fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 4 : 5,
            reps: fitnessLevel === "beginner" ? "8-10" : fitnessLevel === "intermediate" ? "10-12" : "12-15",
            restTime: 60,
            instructions:
              hasEquipment && equipment.includes("Dumbbells")
                ? "Lie on bench, press dumbbells up from chest level"
                : "Keep body straight, lower chest to ground, push back up",
            targetMuscles: ["Chest", "Shoulders", "Triceps"],
            difficulty: fitnessLevel as any,
          },
          {
            id: "rows",
            name: hasEquipment && equipment.includes("Dumbbells") ? "Dumbbell Rows" : "Inverted Rows",
            sets: fitnessLevel === "beginner" ? 3 : fitnessLevel === "intermediate" ? 4 : 5,
            reps: fitnessLevel === "beginner" ? "8-10" : fitnessLevel === "intermediate" ? "10-12" : "12-15",
            restTime: 60,
            instructions:
              hasEquipment && equipment.includes("Dumbbells")
                ? "Bend over, pull dumbbell to hip, squeeze shoulder blades"
                : "Hang under bar, pull chest to bar",
            targetMuscles: ["Back", "Biceps"],
            difficulty: fitnessLevel as any,
          },
          {
            id: "shoulder-press",
            name: hasEquipment && equipment.includes("Dumbbells") ? "Dumbbell Shoulder Press" : "Pike Push-ups",
            sets: 3,
            reps: fitnessLevel === "beginner" ? "6-8" : fitnessLevel === "intermediate" ? "8-10" : "10-12",
            restTime: 60,
            instructions:
              hasEquipment && equipment.includes("Dumbbells")
                ? "Press dumbbells overhead, control the descent"
                : "In downward dog position, lower head toward ground",
            targetMuscles: ["Shoulders", "Triceps"],
            difficulty: fitnessLevel as any,
          },
        ],
      })
    }

    // Cardio/HIIT Workout
    if (goal === "weight-loss" || goal === "endurance") {
      workouts.push({
        id: "hiit-1",
        name: "HIIT Fat Burner",
        description: "High-intensity interval training for maximum calorie burn",
        duration: duration,
        difficulty: fitnessLevel as any,
        type: "hiit",
        equipment: ["None (Bodyweight)"],
        caloriesBurned: Math.round(duration * 8),
        exercises: [
          {
            id: "burpees",
            name: "Burpees",
            sets: 4,
            reps: "30 seconds",
            duration: "30",
            restTime: 30,
            instructions: "Squat down, jump back to plank, do push-up, jump forward, jump up",
            targetMuscles: ["Full Body"],
            difficulty: fitnessLevel as any,
          },
          {
            id: "mountain-climbers",
            name: "Mountain Climbers",
            sets: 4,
            reps: "30 seconds",
            duration: "30",
            restTime: 30,
            instructions: "In plank position, alternate bringing knees to chest rapidly",
            targetMuscles: ["Core", "Cardio"],
            difficulty: fitnessLevel as any,
          },
          {
            id: "jump-squats",
            name: "Jump Squats",
            sets: 4,
            reps: "30 seconds",
            duration: "30",
            restTime: 30,
            instructions: "Squat down, explode up into a jump, land softly",
            targetMuscles: ["Legs", "Glutes"],
            difficulty: fitnessLevel as any,
          },
        ],
      })
    }

    // Full Body Workout
    workouts.push({
      id: "full-body-1",
      name: "Full Body Blast",
      description: "Complete workout targeting all major muscle groups",
      duration: duration,
      difficulty: fitnessLevel as any,
      type: "strength",
      equipment: hasEquipment ? equipment : ["None (Bodyweight)"],
      caloriesBurned: Math.round(duration * 7),
      exercises: [
        {
          id: "squats",
          name: hasEquipment && equipment.includes("Dumbbells") ? "Goblet Squats" : "Bodyweight Squats",
          sets: fitnessLevel === "beginner" ? 3 : 4,
          reps: fitnessLevel === "beginner" ? "10-12" : fitnessLevel === "intermediate" ? "12-15" : "15-20",
          restTime: 45,
          instructions:
            hasEquipment && equipment.includes("Dumbbells")
              ? "Hold dumbbell at chest, squat down keeping chest up"
              : "Feet shoulder-width apart, squat down keeping chest up",
          targetMuscles: ["Legs", "Glutes"],
          difficulty: fitnessLevel as any,
        },
        {
          id: "push-ups-fb",
          name: "Push-ups",
          sets: 3,
          reps: fitnessLevel === "beginner" ? "5-8" : fitnessLevel === "intermediate" ? "8-12" : "12-15",
          restTime: 45,
          instructions: "Keep body straight, lower chest to ground, push back up",
          targetMuscles: ["Chest", "Shoulders", "Triceps"],
          difficulty: fitnessLevel as any,
        },
        {
          id: "plank",
          name: "Plank Hold",
          sets: 3,
          reps: fitnessLevel === "beginner" ? "20-30 sec" : fitnessLevel === "intermediate" ? "30-45 sec" : "45-60 sec",
          duration: fitnessLevel === "beginner" ? "25" : fitnessLevel === "intermediate" ? "37" : "52",
          restTime: 30,
          instructions: "Hold straight line from head to heels, engage core",
          targetMuscles: ["Core"],
          difficulty: fitnessLevel as any,
        },
      ],
    })

    return workouts
  }

  const workouts = generateWorkouts()

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout)
    setCurrentExercise(0)
    setIsWorkoutActive(true)
    setTimer(0)
    setCompletedExercises(new Set())
  }

  const completeExercise = () => {
    if (!selectedWorkout) return

    const exerciseId = selectedWorkout.exercises[currentExercise].id
    setCompletedExercises((prev) => new Set([...prev, exerciseId]))

    if (currentExercise < selectedWorkout.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setIsResting(true)
      // Auto-advance after rest time
      setTimeout(() => setIsResting(false), selectedWorkout.exercises[currentExercise].restTime * 1000)
    } else {
      // Workout complete
      setIsWorkoutActive(false)
    }
  }

  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Dumbbell className="w-4 h-4" />
      case "cardio":
        return <Heart className="w-4 h-4" />
      case "hiit":
        return <Zap className="w-4 h-4" />
      case "flexibility":
        return <RotateCcw className="w-4 h-4" />
      default:
        return <Target className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (selectedWorkout && isWorkoutActive) {
    const currentEx = selectedWorkout.exercises[currentExercise]
    const progress =
      ((currentExercise + (completedExercises.has(currentEx.id) ? 1 : 0)) / selectedWorkout.exercises.length) * 100

    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col">
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold">{selectedWorkout.name}</h1>
              <p className="text-muted-foreground">
                Exercise {currentExercise + 1} of {selectedWorkout.exercises.length}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsWorkoutActive(false)}>
              End Workout
            </Button>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>

        <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-heading">{currentEx.name}</CardTitle>
              <CardDescription className="text-lg">
                {currentEx.sets} sets × {currentEx.reps}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{currentEx.instructions}</p>
                <div className="flex justify-center gap-2 mb-4">
                  {currentEx.targetMuscles.map((muscle) => (
                    <Badge key={muscle} variant="secondary">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>

              {isResting ? (
                <div className="text-center">
                  <div className="text-4xl font-heading font-bold text-primary mb-2">Rest</div>
                  <p className="text-muted-foreground">
                    Next: {selectedWorkout.exercises[currentExercise + 1]?.name || "Workout Complete"}
                  </p>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <Button size="lg" onClick={completeExercise} className="font-heading">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Complete Set
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Workout Planner</h1>
            <p className="text-muted-foreground">
              Personalized workouts for your {userProfile.goal?.replace("-", " ")} goals
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs defaultValue="recommended" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="all">All Workouts</TabsTrigger>
          </TabsList>

          <TabsContent value="recommended" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getWorkoutTypeIcon(workout.type)}
                        <CardTitle className="font-heading">{workout.name}</CardTitle>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getDifficultyColor(workout.difficulty)}`} />
                    </div>
                    <CardDescription>{workout.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Duration
                        </span>
                        <span className="font-medium">{workout.duration} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          Calories
                        </span>
                        <span className="font-medium">~{workout.caloriesBurned}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Exercises</span>
                        <span className="font-medium">{workout.exercises.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {workout.equipment.slice(0, 2).map((eq) => (
                          <Badge key={eq} variant="outline" className="text-xs">
                            {eq === "None (Bodyweight)" ? "Bodyweight" : eq}
                          </Badge>
                        ))}
                        {workout.equipment.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{workout.equipment.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button className="w-full mt-4 font-heading" onClick={() => startWorkout(workout)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all">
            <div className="text-center py-12">
              <p className="text-muted-foreground">More workout categories coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
