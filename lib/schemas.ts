export const fitnessGoals = [
  "Weight Loss",
  "Muscle Gain",
  "Endurance Training",
  "General Fitness",
  "Flexibility & Mobility",
] as const;

export const fitnessLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const workoutLocations = [
  "Gym",
  "Home (No Equipment)",
  "Home (Dumbbells/Bands)",
  "Outdoor",
] as const;

export const dietaryPreferences = [
  "Vegetarian",
  "Non-Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "No Preference",
] as const;

import { z } from "zod";

export const userProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.coerce.number().min(10).max(100, { message: "Please enter a valid age." }),
  gender: z.enum(["Male", "Female", "Other"]),
  

  height: z.coerce.number().min(50, { message: "Height in cm is required." }), 
  weight: z.coerce.number().min(20, { message: "Weight in kg is required." }), 

  goal: z.enum(fitnessGoals),
  level: z.enum(fitnessLevels),
  location: z.enum(workoutLocations),
  dietaryPreference: z.enum(dietaryPreferences),
  

  medicalHistory: z.string().optional(), 
  stressLevel: z.enum(["Low", "Medium", "High"]).optional(),
  daysPerWeek: z.coerce.number().min(1).max(7).default(3),
});


export type UserProfile = z.infer<typeof userProfileSchema>;


export const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.string(), 
  rest: z.string(), 
  notes: z.string().optional(), 
});

export const mealSchema = z.object({
  name: z.string(),
  calories: z.string(), 
  ingredients: z.array(z.string()),
  macros: z.string(), 
});


export const fitnessPlanSchema = z.object({
  workoutPlan: z.array(
    z.object({
      day: z.string(), 
      focus: z.string(), 
      exercises: z.array(exerciseSchema),
    })
  ),
  dietPlan: z.object({
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
    snacks: z.array(mealSchema),
  }),
  motivation: z.object({
    quote: z.string(),
    tips: z.array(z.string()), 
  }),
});

export type FitnessPlan = z.infer<typeof fitnessPlanSchema>;