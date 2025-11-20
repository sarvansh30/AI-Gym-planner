"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Camera, Dumbbell, Utensils, Sparkles, Volume2, StopCircle } from "lucide-react";
import { generateImageAction, generateMotivationAction, generateSpeechAction } from "@/app/actions/generate";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const formatWorkoutForSpeech = (plan: any[]) => {

  if (!plan || !Array.isArray(plan) || plan.length === 0) return "You have no workouts scheduled.";
  
  const day = plan[0];
  
  if (!day) return "Workout data is incomplete.";

  let script = `Here is your workout plan for ${day.day || "Day 1"}. The focus is ${day.focus || "General Fitness"}. `;
  
  if (day.exercises && Array.isArray(day.exercises)) {
    day.exercises.forEach((ex: any, i: number) => {
      script += `Exercise ${i + 1}: ${ex.name}. Do ${ex.sets} sets of ${ex.reps} repetitions. `;
      if (ex.notes) script += `Tip: ${ex.notes}. `;
    });
  }
  
  return script;
};


const formatDietForSpeech = (plan: any) => {
  if (!plan) return "No diet plan available.";
  
  let script = "Here is your nutrition plan. ";
  if (plan.breakfast) script += `For Breakfast, have ${plan.breakfast.name}. `;
  if (plan.lunch) script += `For Lunch, have ${plan.lunch.name}. `;
  if (plan.dinner) script += `For Dinner, have ${plan.dinner.name}. `;
  
  if (plan.snacks && Array.isArray(plan.snacks) && plan.snacks.length > 0) {
    script += `For snacks, you can have ${plan.snacks.map((s:any) => s.name).join(" or ")}. `;
  }
  
  return script;
};

export function PlanDashboard({ planData, userData }: { planData: any, userData: any }) {
  const [motivation, setMotivation] = useState<{ quote: string; tips: string[] } | null>(null);
  const [isUpdatingMotivation, setIsUpdatingMotivation] = useState(false);


  const fetchMotivation = async () => {
    setIsUpdatingMotivation(true);
    const res = await generateMotivationAction(userData.name, userData.goal);
    if (res.data) {
        setMotivation(res.data);
    }
    setIsUpdatingMotivation(false);
  };

  useEffect(() => {
    fetchMotivation(); 

    const intervalId = setInterval(() => {
      fetchMotivation();
    }, 60000); 

    return () => clearInterval(intervalId);
  }, [userData.name, userData.goal]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Your Personal Blueprint</h2>
        <p className="text-muted-foreground">Designed for {userData.goal} • {userData.level}</p>
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-100 relative overflow-hidden">
        {isUpdatingMotivation && (
            <div className="absolute top-2 right-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            </div>
        )}
        <CardContent className="pt-6 text-center min-h-[140px] flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
                {motivation ? (
                    <motion.div 
                        key={motivation.quote} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl md:text-2xl font-serif italic text-indigo-900 leading-relaxed">
                            "{motivation.quote}"
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                            {motivation.tips.map((tip, i) => (
                                <Badge key={i} variant="outline" className="bg-white/50 border-indigo-200 text-indigo-700">
                                    <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                                    {tip}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex justify-center items-center gap-2 text-sm text-indigo-400">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Coaching AI is thinking...</span>
                    </div>
                )}
            </AnimatePresence>
        </CardContent>
      </Card>

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout"><Dumbbell className="w-4 h-4 mr-2"/> Workout Plan</TabsTrigger>
          <TabsTrigger value="diet"><Utensils className="w-4 h-4 mr-2"/> Diet Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-4">
           <div className="flex justify-end">
            <AudioPlayerButton textToSpeak={formatWorkoutForSpeech(planData.workoutPlan)} label="Read Workout" />
          </div>
          <WorkoutView plan={planData.workoutPlan} />
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <div className="flex justify-end">
            <AudioPlayerButton textToSpeak={formatDietForSpeech(planData.dietPlan)} label="Read Diet" />
          </div>
          <DietView plan={planData.dietPlan} />
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Audio Player Component
function AudioPlayerButton({ textToSpeak, label }: { textToSpeak: string, label: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await generateSpeechAction(textToSpeak);
      
      if (res.success && res.audio) {
        if (!audioRef.current) {
          audioRef.current = new Audio(res.audio);
          audioRef.current.onended = () => setIsPlaying(false);
        } else {
          audioRef.current.src = res.audio;
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        console.error("Speech gen failed");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isPlaying ? "destructive" : "outline"} 
      size="sm" 
      onClick={handlePlay} 
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <StopCircle className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      {isLoading ? "Loading Audio..." : isPlaying ? "Stop Reading" : label}
    </Button>
  );
}

// Workout Components

  if (!plan || !Array.isArray(plan)) return <p className="text-center text-muted-foreground py-10">No workout data available.</p>;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
    >
      {plan.map((day: any, index: number) => (
        <motion.div variants={item} key={index}>
          <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className="bg-slate-50 pb-3 border-b">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>{day.day}</span>
                <Badge variant="secondary">{day.focus}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {day.exercises && day.exercises.map((exercise: any, i: number) => (
                  <ExerciseItem key={i} exercise={exercise} />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ExerciseItem({ exercise }: { exercise: any }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVisualize = async () => {
    if (imageUrl) return;
    setLoading(true);
    const res = await generateImageAction(exercise.name, "workout");
    if (res.success && res.image) {
        setImageUrl(res.image);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 hover:bg-slate-50 transition-colors group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-slate-900">{exercise.name}</h4>
          <p className="text-sm text-slate-500">{exercise.sets} Sets x {exercise.reps} • {exercise.rest}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-indigo-600 md:opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleVisualize}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Camera className="w-3 h-3 mr-1"/>}
          {imageUrl ? "View" : "Visualize"}
        </Button>
      </div>
      
      <p className="text-xs text-slate-400 italic">{exercise.notes}</p>

      {imageUrl && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 rounded-md overflow-hidden border shadow-sm relative bg-slate-100"
        >
          <img 
            src={imageUrl} 
            alt={exercise.name} 
            className="w-full h-48 object-cover" 
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </motion.div>
      )}
    </div>
  );
}

// Diet Components

function DietView({ plan }: { plan: any }) {
  if (!plan) return <p className="text-center text-muted-foreground py-10">No diet data available.</p>;

  const MealCard = ({ title, meal }: { title: string, meal: any }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleVisualize = async () => {
        if (imageUrl) return;
        setLoading(true);
        const res = await generateImageAction(meal.name, "food");
        if (res.success && res.image) setImageUrl(res.image);
        setLoading(false);
    };

    if (!meal) return null; 

    return (
        <Card className="mb-4 border-emerald-100/50 overflow-hidden">
        <CardHeader className="pb-2 bg-emerald-50/30">
            <CardTitle className="text-base text-emerald-800 flex justify-between items-center">
            <span>{title}</span>
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-emerald-600"
                onClick={handleVisualize}
                disabled={loading}
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin"/> : <Camera className="w-3 h-3"/>}
            </Button>
            </CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg mb-1">{meal.name}</h4>
                    <p className="text-xs text-slate-500 mb-2">{meal.calories} • {meal.macros}</p>
                </div>
            </div>
            
            {imageUrl && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="mb-3 rounded-md overflow-hidden"
                >
                    <img src={imageUrl} alt={meal.name} className="w-full h-32 object-cover" />
                </motion.div>
            )}

            <div className="flex flex-wrap gap-1">
            {meal.ingredients && meal.ingredients.map((ing: string, i: number) => (
                <span key={i} className="text-xs bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 shadow-sm">
                {ing}
                </span>
            ))}
            </div>
        </CardContent>
        </Card>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 mt-6 max-w-3xl mx-auto"
    >
      <motion.div variants={item}><MealCard title="Breakfast" meal={plan.breakfast} /></motion.div>
      <motion.div variants={item}><MealCard title="Lunch" meal={plan.lunch} /></motion.div>
      <motion.div variants={item}><MealCard title="Dinner" meal={plan.dinner} /></motion.div>
      
      {plan.snacks && plan.snacks.length > 0 && (
         <motion.div variants={item}>
           <h3 className="font-bold text-slate-700 mb-2 mt-6 px-1">Snacks</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {plan.snacks.map((snack: any, i: number) => (
               <MealCard key={i} title={`Snack ${i+1}`} meal={snack} />
             ))}
           </div>
         </motion.div>
      )}
    </motion.div>
  );
}