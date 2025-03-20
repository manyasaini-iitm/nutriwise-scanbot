
import { useState } from "react";
import { 
  FitnessGoal,
  useUser 
} from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Activity, Dumbbell, Weight, Heart,
  BarChart4, Save, ChevronRight
} from "lucide-react";

const fitnessGoalOptions: {
  value: FitnessGoal;
  label: string;
  icon: any;
  description: string;
  benefits: string[];
}[] = [
  {
    value: "weight loss",
    label: "Weight Loss",
    icon: Weight,
    description: "Focusing on calorie deficit and healthier food choices",
    benefits: [
      "Lower calorie options",
      "Higher protein, lower fat",
      "Lower sugar content",
      "Higher fiber foods"
    ]
  },
  {
    value: "muscle gain",
    label: "Muscle Gain",
    icon: Dumbbell,
    description: "Prioritizing protein intake and nutrient-dense foods",
    benefits: [
      "Higher protein options",
      "Adequate healthy carbs",
      "Essential nutrients",
      "Calorie sufficient meals"
    ]
  },
  {
    value: "maintenance",
    label: "Maintenance",
    icon: BarChart4,
    description: "Balanced nutrition to maintain current body composition",
    benefits: [
      "Balanced macronutrients",
      "Moderate calorie options",
      "Nutritionally complete foods",
      "Sustainable eating patterns"
    ]
  },
  {
    value: "endurance",
    label: "Endurance",
    icon: Activity,
    description: "Supporting long-duration activities with proper fueling",
    benefits: [
      "Complex carbohydrates",
      "Electrolyte balance",
      "Sustained energy options",
      "Anti-inflammatory foods"
    ]
  },
  {
    value: "general health",
    label: "General Health",
    icon: Heart,
    description: "Focus on overall nutrition and wellbeing",
    benefits: [
      "Nutrient-dense whole foods",
      "Lower processed ingredients",
      "Variety of food groups",
      "Balanced approach to eating"
    ]
  }
];

const FitnessGoals = () => {
  const { userProfile, updateUserProfile } = useUser();
  const { toast } = useToast();
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>(userProfile.fitnessGoals);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleGoal = (goal: FitnessGoal) => {
    let newGoals: FitnessGoal[];
    
    if (selectedGoals.includes(goal)) {
      // Remove goal if it exists, but ensure at least one goal remains selected
      if (selectedGoals.length > 1) {
        newGoals = selectedGoals.filter(g => g !== goal);
      } else {
        return; // Prevent removing the last goal
      }
    } else {
      // Add goal
      newGoals = [...selectedGoals, goal];
    }
    
    setSelectedGoals(newGoals);
    setHasChanges(true);
  };

  const saveChanges = () => {
    updateUserProfile({ fitnessGoals: selectedGoals });
    setHasChanges(false);
    toast({
      title: "Fitness Goals Updated",
      description: "Your fitness goals have been saved successfully.",
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-scale-in">
      <Card className="glass-card overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Fitness Goals
            </span>
          </CardTitle>
          <CardDescription>
            Select your fitness goals to get personalized nutrition recommendations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pb-6">
          <div className="grid grid-cols-1 gap-4">
            {fitnessGoalOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedGoals.includes(option.value);
              
              return (
                <div 
                  key={option.value}
                  onClick={() => toggleGoal(option.value)}
                  className={`relative flex flex-col md:flex-row md:items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? "bg-primary/5 border border-primary/20" 
                      : "bg-card hover:bg-background/80 border border-border"
                  }`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                    isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-medium text-lg ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {option.label}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {option.description}
                        </p>
                      </div>
                      
                      <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                        isSelected 
                          ? "border-primary bg-primary text-primary-foreground" 
                          : "border-muted-foreground"
                      }`}>
                        {isSelected && <ChevronRight className="h-4 w-4" />}
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {option.benefits.map((benefit, index) => (
                        <div 
                          key={index}
                          className={`flex items-center text-xs px-2 py-1 rounded ${
                            isSelected 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <span>• {benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
        
        {hasChanges && (
          <CardFooter className="border-t border-border/50 p-4 bg-background/20">
            <div className="flex justify-end w-full">
              <Button 
                onClick={saveChanges}
                className="bg-primary hover:bg-primary/90"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default FitnessGoals;
