"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Apple, Plus, Flame, Droplets, Zap, ChefHat, Search } from "lucide-react"

interface NutritionGoals {
  calories: number
  protein: number
  carbs: number
  fat: number
  water: number
}

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  serving: string
}

interface MealEntry {
  id: string
  foodId: string
  foodName: string
  servings: number
  calories: number
  protein: number
  carbs: number
  fat: number
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
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

interface NutritionPlannerProps {
  userProfile: UserProfile
  onClose: () => void
}

export function NutritionPlanner({ userProfile, onClose }: NutritionPlannerProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [showAddFood, setShowAddFood] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [searchQuery, setSearchQuery] = useState("")
  const [waterIntake, setWaterIntake] = useState(6) // glasses

  // Calculate nutrition goals based on user profile
  const calculateGoals = (): NutritionGoals => {
    const age = Number.parseInt(userProfile.age)
    const baseCalories = userProfile.goal === "weight-loss" ? 1800 : userProfile.goal === "muscle-gain" ? 2400 : 2100

    return {
      calories: baseCalories,
      protein: Math.round((baseCalories * 0.25) / 4), // 25% of calories from protein
      carbs: Math.round((baseCalories * 0.45) / 4), // 45% from carbs
      fat: Math.round((baseCalories * 0.3) / 9), // 30% from fat
      water: 8, // glasses
    }
  }

  const goals = calculateGoals()

  // Sample food database
  const foodDatabase: FoodItem[] = [
    { id: "1", name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: "100g" },
    { id: "2", name: "Brown Rice", calories: 112, protein: 2.6, carbs: 23, fat: 0.9, serving: "100g" },
    { id: "3", name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4, serving: "100g" },
    { id: "4", name: "Salmon", calories: 208, protein: 22, carbs: 0, fat: 13, serving: "100g" },
    { id: "5", name: "Sweet Potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1, serving: "100g" },
    { id: "6", name: "Greek Yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4, serving: "100g" },
    { id: "7", name: "Oatmeal", calories: 68, protein: 2.4, carbs: 12, fat: 1.4, serving: "100g" },
    { id: "8", name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3, serving: "1 medium" },
    { id: "9", name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50, serving: "100g" },
    { id: "10", name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, serving: "100g" },
  ]

  // Sample meal entries for today
  const [todaysMeals, setTodaysMeals] = useState<MealEntry[]>([
    {
      id: "1",
      foodId: "7",
      foodName: "Oatmeal",
      servings: 1.5,
      calories: 102,
      protein: 3.6,
      carbs: 18,
      fat: 2.1,
      mealType: "breakfast",
    },
    {
      id: "2",
      foodId: "8",
      foodName: "Banana",
      servings: 1,
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      mealType: "breakfast",
    },
    {
      id: "3",
      foodId: "1",
      foodName: "Chicken Breast",
      servings: 1.2,
      calories: 198,
      protein: 37.2,
      carbs: 0,
      fat: 4.3,
      mealType: "lunch",
    },
    {
      id: "4",
      foodId: "2",
      foodName: "Brown Rice",
      servings: 0.8,
      calories: 90,
      protein: 2.1,
      carbs: 18.4,
      fat: 0.7,
      mealType: "lunch",
    },
  ])

  // Calculate totals
  const totals = todaysMeals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  // Macro distribution data for pie chart
  const macroData = [
    { name: "Protein", value: totals.protein * 4, color: "#059669" },
    { name: "Carbs", value: totals.carbs * 4, color: "#10b981" },
    { name: "Fat", value: totals.fat * 9, color: "#34d399" },
  ]

  // Weekly nutrition data for chart
  const weeklyData = [
    { day: "Mon", calories: 1950, protein: 145, carbs: 220, fat: 65 },
    { day: "Tue", calories: 2100, protein: 155, carbs: 240, fat: 70 },
    { day: "Wed", calories: 1850, protein: 140, carbs: 200, fat: 62 },
    { day: "Thu", calories: 2050, protein: 150, carbs: 230, fat: 68 },
    { day: "Fri", calories: 2200, protein: 160, carbs: 250, fat: 75 },
    { day: "Sat", calories: 1900, protein: 142, carbs: 210, fat: 64 },
    { day: "Sun", calories: totals.calories, protein: totals.protein, carbs: totals.carbs, fat: totals.fat },
  ]

  const addFoodToMeal = (food: FoodItem, servings: number) => {
    const newMeal: MealEntry = {
      id: Date.now().toString(),
      foodId: food.id,
      foodName: food.name,
      servings,
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings * 10) / 10,
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fat: Math.round(food.fat * servings * 10) / 10,
      mealType: selectedMealType,
    }

    setTodaysMeals([...todaysMeals, newMeal])
    setShowAddFood(false)
    setSearchQuery("")
  }

  const filteredFoods = foodDatabase.filter((food) => food.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const getMealsByType = (type: string) => todaysMeals.filter((meal) => meal.mealType === type)

  const getMealTotals = (type: string) => {
    const meals = getMealsByType(type)
    return meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  // Generate meal suggestions based on user preferences
  const getMealSuggestions = () => {
    const isVegetarian = userProfile.dietaryPreferences.includes("Vegetarian")
    const isVegan = userProfile.dietaryPreferences.includes("Vegan")

    const suggestions = [
      {
        name: "High Protein Breakfast",
        foods: isVegan ? ["Oatmeal", "Almonds", "Banana"] : ["Greek Yogurt", "Oatmeal", "Banana"],
        calories: 350,
        protein: 20,
      },
      {
        name: "Balanced Lunch",
        foods: isVegetarian ? ["Sweet Potato", "Spinach", "Almonds"] : ["Chicken Breast", "Brown Rice", "Broccoli"],
        calories: 450,
        protein: 35,
      },
      {
        name: "Light Dinner",
        foods: isVegetarian ? ["Spinach", "Sweet Potato", "Greek Yogurt"] : ["Salmon", "Broccoli", "Sweet Potato"],
        calories: 400,
        protein: 30,
      },
    ]

    return suggestions
  }

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-heading font-bold">Nutrition Planner</h1>
            <p className="text-muted-foreground">
              Track your nutrition and reach your {userProfile.goal?.replace("-", " ")} goals
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="goals">Goals & Macros</TabsTrigger>
            <TabsTrigger value="suggestions">Meal Ideas</TabsTrigger>
            <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Daily Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calories</CardTitle>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totals.calories}</div>
                  <Progress value={(totals.calories / goals.calories) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{goals.calories - totals.calories} remaining</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Protein</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(totals.protein)}g</div>
                  <Progress value={(totals.protein / goals.protein) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(goals.protein - totals.protein)}g remaining
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbs</CardTitle>
                  <Apple className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(totals.carbs)}g</div>
                  <Progress value={(totals.carbs / goals.carbs) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(goals.carbs - totals.carbs)}g remaining
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water</CardTitle>
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{waterIntake}</div>
                  <Progress value={(waterIntake / goals.water) * 100} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">{goals.water - waterIntake} glasses left</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 w-full bg-transparent"
                    onClick={() => setWaterIntake(Math.min(waterIntake + 1, goals.water))}
                  >
                    +1 Glass
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Meals */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
                  const mealTotals = getMealTotals(mealType)
                  const meals = getMealsByType(mealType)

                  return (
                    <Card key={mealType}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="capitalize font-heading">{mealType}</CardTitle>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedMealType(mealType as any)
                              setShowAddFood(true)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                        </div>
                        <CardDescription>
                          {mealTotals.calories} cal • {Math.round(mealTotals.protein)}g protein
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {meals.length === 0 ? (
                          <p className="text-muted-foreground text-sm">No foods added yet</p>
                        ) : (
                          <div className="space-y-2">
                            {meals.map((meal) => (
                              <div key={meal.id} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{meal.foodName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {meal.servings}x serving • {meal.calories} cal
                                  </p>
                                </div>
                                <Badge variant="secondary">{Math.round(meal.protein)}g protein</Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Macro Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Macro Distribution</CardTitle>
                  <CardDescription>Today's macronutrient breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-4 mt-4">
                    {macroData.map((entry) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Daily Nutrition Goals</CardTitle>
                  <CardDescription>Based on your {userProfile.goal?.replace("-", " ")} goal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Calories</span>
                    <Badge variant="secondary">{goals.calories} kcal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Protein</span>
                    <Badge variant="secondary">{goals.protein}g</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Carbohydrates</span>
                    <Badge variant="secondary">{goals.carbs}g</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fat</span>
                    <Badge variant="secondary">{goals.fat}g</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Water</span>
                    <Badge variant="secondary">{goals.water} glasses</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Dietary Preferences</CardTitle>
                  <CardDescription>Your current dietary restrictions and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.dietaryPreferences.length === 0 ? (
                      <p className="text-muted-foreground">No dietary preferences set</p>
                    ) : (
                      userProfile.dietaryPreferences.map((pref) => (
                        <Badge key={pref} className="mr-2">
                          {pref}
                        </Badge>
                      ))
                    )}
                  </div>
                  {userProfile.restrictions.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-medium">Restrictions:</Label>
                      <div className="mt-2">
                        {userProfile.restrictions.map((restriction) => (
                          <Badge key={restriction} variant="destructive" className="mr-2">
                            {restriction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getMealSuggestions().map((suggestion, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-primary" />
                      <CardTitle className="font-heading">{suggestion.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {suggestion.calories} cal • {suggestion.protein}g protein
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestion.foods.map((food, foodIndex) => (
                        <div key={foodIndex} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{food}</span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      Add to Meal Plan
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Weekly Nutrition Overview</CardTitle>
                <CardDescription>Your nutrition intake over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calories" fill="#059669" />
                    <Bar dataKey="protein" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Food Modal */}
        {showAddFood && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md max-h-[80vh] overflow-auto">
              <CardHeader>
                <CardTitle className="font-heading">Add Food to {selectedMealType}</CardTitle>
                <CardDescription>Search and add foods to your meal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Foods</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search for foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2 max-h-60 overflow-auto">
                  {filteredFoods.map((food) => (
                    <div key={food.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{food.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {food.calories} cal per {food.serving}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => addFoodToMeal(food, 1)}>
                          Add
                        </Button>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>P: {food.protein}g</span>
                        <span>C: {food.carbs}g</span>
                        <span>F: {food.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddFood(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
