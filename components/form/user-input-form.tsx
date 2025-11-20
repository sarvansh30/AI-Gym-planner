"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { 
  userProfileSchema, 
  fitnessGoals, 
  fitnessLevels, 
  dietaryPreferences, 
  workoutLocations 
} from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { generatePlanAction } from "@/app/actions/generate"
import { Loader2 } from "lucide-react"

type UserProfileFormValues = z.infer<typeof userProfileSchema>

interface UserInputFormProps {
  onSuccess: (plan: any, userData: any) => void;
}

export function UserInputForm({ onSuccess }: UserInputFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  // FIX: Use <any> to silence the conflict between Zod's output (number) and Input's value (string/unknown)
  // This resolves both the "Resolver Mismatch" and "Value Unknown" errors.
  const form = useForm<any>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      age: 25,
      gender: undefined, 
      height: 170,
      weight: 70,
      goal: undefined, 
      level: undefined,
      location: undefined,
      dietaryPreference: undefined,
      daysPerWeek: 3,
      medicalHistory: "None",
      stressLevel: undefined,
    },
  })

  async function onSubmit(data: UserProfileFormValues) {
    setIsLoading(true)
    try {
      const result = await generatePlanAction(data)
      
      if (result.success && result.data) {
        onSuccess(result.data, data)
      } else {
        alert("Failed to generate plan. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("Something went wrong.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 border p-6 rounded-xl shadow-sm bg-card">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Personal Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
             <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 2: FITNESS PREFERENCES */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Fitness Goals & Preferences</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fitness Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fitnessGoals.map((goal) => (
                        <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fitnessLevels.map((level) => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Where do you workout?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workoutLocations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="daysPerWeek"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days/Week</FormLabel>
                  <FormControl>
                    <Input type="number" max={7} min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* SECTION 3: DIET & HEALTH */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Diet & Health</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dietaryPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {dietaryPreferences.map((diet) => (
                        <SelectItem key={diet} value={diet}>{diet}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stressLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stress Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stress level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="medicalHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical History / Injuries (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Knee pain, Asthma..." {...field} />
                </FormControl>
                <FormDescription>
                   We will adjust workouts based on this.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Your Plan... (This may take 10s)
            </>
          ) : (
            "Generate My Plan ✨"
          )}
        </Button>
      </form>
    </Form>
  )
}