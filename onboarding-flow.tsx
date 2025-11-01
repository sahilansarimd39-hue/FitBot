"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Target, Activity, Clock, Utensils } from "lucide-react"

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

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    age: "",
    goal: "",
    fitnessLevel: "",
    timeAvailable: [30],
    equipment: [],
    restrictions: [],
    dietaryPreferences: [],
  })

  const totalSteps = 6
  const progress = ((currentStep + 1) / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(profile)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateProfile = (key: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayItem = (key: keyof UserProfile, item: string) => {
    const currentArray = profile[key] as string[]
    const newArray = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
    updateProfile(key, newArray)
  }

  const steps = [
    {
      title: "Welcome to FitBot!",
      description: "Let's get to know you better",
      icon: <Target className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">What's your name?</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => updateProfile("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">How old are you?</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={profile.age}
              onChange={(e) => updateProfile("age", e.target.value)}
            />
          </div>
        </div>
      ),
    },
    {
      title: "What's your main goal?",
      description: "This helps us tailor your experience",
      icon: <Target className="w-8 h-8 text-primary" />,
      content: (
        <RadioGroup value={profile.goal} onValueChange={(value) => updateProfile("goal", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weight-loss" id="weight-loss" />
            <Label htmlFor="weight-loss">Weight Loss</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="muscle-gain" id="muscle-gain" />
            <Label htmlFor="muscle-gain">Muscle Gain</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="strength" id="strength" />
            <Label htmlFor="strength">Build Strength</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="endurance" id="endurance" />
            <Label htmlFor="endurance">Improve Endurance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general-fitness" id="general-fitness" />
            <Label htmlFor="general-fitness">General Fitness</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flexibility" id="flexibility" />
            <Label htmlFor="flexibility">Flexibility & Mobility</Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      title: "What's your fitness level?",
      description: "Be honest - this helps us create safe workouts",
      icon: <Activity className="w-8 h-8 text-primary" />,
      content: (
        <RadioGroup value={profile.fitnessLevel} onValueChange={(value) => updateProfile("fitnessLevel", value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner">Beginner - New to exercise</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate">Intermediate - Exercise regularly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced">Advanced - Very experienced</Label>
          </div>
        </RadioGroup>
      ),
    },
    {
      title: "How much time do you have?",
      description: "Minutes per workout session",
      icon: <Clock className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Workout Duration: {profile.timeAvailable[0]} minutes</Label>
            <Slider
              value={profile.timeAvailable}
              onValueChange={(value) => updateProfile("timeAvailable", value)}
              max={120}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>15 min</span>
              <span>60 min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "What equipment do you have?",
      description: "Select all that apply",
      icon: <Activity className="w-8 h-8 text-primary" />,
      content: (
        <div className="grid grid-cols-2 gap-4">
          {[
            "None (Bodyweight)",
            "Dumbbells",
            "Resistance Bands",
            "Pull-up Bar",
            "Kettlebells",
            "Barbell",
            "Gym Access",
            "Yoga Mat",
          ].map((equipment) => (
            <div key={equipment} className="flex items-center space-x-2">
              <Checkbox
                id={equipment}
                checked={profile.equipment.includes(equipment)}
                onCheckedChange={() => toggleArrayItem("equipment", equipment)}
              />
              <Label htmlFor={equipment} className="text-sm">
                {equipment}
              </Label>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Any restrictions or preferences?",
      description: "Help us keep you safe and motivated",
      icon: <Utensils className="w-8 h-8 text-primary" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Physical Restrictions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["Back Issues", "Knee Problems", "Shoulder Issues", "Heart Condition", "Other Injuries"].map(
                (restriction) => (
                  <div key={restriction} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction}
                      checked={profile.restrictions.includes(restriction)}
                      onCheckedChange={() => toggleArrayItem("restrictions", restriction)}
                    />
                    <Label htmlFor={restriction} className="text-sm">
                      {restriction}
                    </Label>
                  </div>
                ),
              )}
            </div>
          </div>
          <div>
            <Label className="text-base font-medium">Dietary Preferences</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["Vegetarian", "Vegan", "Keto", "Paleo", "Gluten-Free", "Dairy-Free"].map((diet) => (
                <div key={diet} className="flex items-center space-x-2">
                  <Checkbox
                    id={diet}
                    checked={profile.dietaryPreferences.includes(diet)}
                    onCheckedChange={() => toggleArrayItem("dietaryPreferences", diet)}
                  />
                  <Label htmlFor={diet} className="text-sm">
                    {diet}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return profile.name.trim() !== "" && profile.age.trim() !== ""
      case 1:
        return profile.goal !== ""
      case 2:
        return profile.fitnessLevel !== ""
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">{currentStepData.icon}</div>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>
          <CardTitle className="text-2xl font-heading">{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">{currentStepData.content}</div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()} className="font-heading">
              {currentStep === totalSteps - 1 ? "Complete Setup" : "Next"}
              {currentStep !== totalSteps - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
