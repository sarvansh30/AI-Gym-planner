"use client";


import { UserInputForm } from "@/components/form/user-input-form";
import { PlanDashboard } from "@/components/plans/plan-dashboard";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useState,useEffect } from "react";

export default function Home() {
  const [plan, setPlan] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedPlan = localStorage.getItem("fitnessPlan");
    const savedUser = localStorage.getItem("userProfile");
    if (savedPlan && savedUser) {
      setPlan(JSON.parse(savedPlan));
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  const handlePlanGenerated = (planData: any, userProfile: any) => {
    setPlan(planData);
    setUserData(userProfile);
    localStorage.setItem("fitnessPlan", JSON.stringify(planData));
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
  };

  const handleReset = () => {
    localStorage.removeItem("fitnessPlan");
    localStorage.removeItem("userProfile");
    setPlan(null);
    setUserData(null);
  };

  return (
     <main className="min-h-screen bg-slate-50 p-4 md:p-12">
      <div className="max-w-4xl mx-auto">
  
        {plan && userData ? (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleReset} className="text-xs">
                <RefreshCcw className="w-3 h-3 mr-2"/>
                New Plan
              </Button>
            </div>
            <PlanDashboard planData={plan} userData={userData} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                AI Fitness Coach
              </h1>
              <p className="text-lg text-slate-600">
                Tell us about yourself, and we'll build your perfect routine.
              </p>
            </div>

            <UserInputForm onSuccess={handlePlanGenerated} />
          </div>
        )}

      </div>
    </main>
  );
}