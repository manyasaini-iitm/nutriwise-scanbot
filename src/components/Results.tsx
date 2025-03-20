
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, CheckCircle2, 
  AlarmClock, ArrowRight, ArrowLeft,
  ShieldAlert, ShieldCheck, Info
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { classifyProduct, Classification } from "@/utils/classification";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ResultsProps {
  productData?: any;
}

const Results = ({ productData: propProductData }: ResultsProps) => {
  const { userProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [productData, setProductData] = useState<any>(null);
  const [classification, setClassification] = useState<{
    classification: Classification;
    reasons: string[];
    warnings?: string[];
    alternatives?: string[];
    fitnessCompatibility?: {
      compatible: boolean;
      reasons: string[];
    };
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load product data from props or session storage
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let data;
        
        if (propProductData) {
          data = propProductData;
        } else {
          const storedData = sessionStorage.getItem('scannedProduct');
          if (storedData) {
            data = JSON.parse(storedData);
          } else {
            // No data available, redirect to scanner
            toast({
              title: "No Product Data",
              description: "Please scan a product first.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
        }
        
        setProductData(data);
        
        // Classify the product
        const result = classifyProduct(
          data,
          userProfile.allergens,
          userProfile.dietaryRestrictions,
          userProfile.healthConditions,
          userProfile.fitnessGoals
        );
        
        setClassification(result);
        
      } catch (error) {
        console.error("Error processing results:", error);
        toast({
          title: "Processing Error",
          description: "Failed to analyze product data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [propProductData, userProfile, navigate, toast]);
  
  const getNutritionScore = (nutritionalInfo: any) => {
    // Simple scoring algorithm (would be more sophisticated in a real app)
    let score = 100;
    
    if (nutritionalInfo.sugar > 50) score -= 30;
    else if (nutritionalInfo.sugar > 25) score -= 15;
    
    if (nutritionalInfo.sodium > 300) score -= 20;
    else if (nutritionalInfo.sodium > 150) score -= 10;
    
    if (nutritionalInfo.fat > 20) score -= 20;
    else if (nutritionalInfo.fat > 10) score -= 10;
    
    // Add points for protein
    if (nutritionalInfo.protein > 20) score += 15;
    else if (nutritionalInfo.protein > 10) score += 10;
    
    // Ensure score stays between 0-100
    return Math.max(0, Math.min(100, score));
  };
  
  const getClassificationColor = (classification: Classification) => {
    switch (classification) {
      case 'healthy':
        return 'text-healthy';
      case 'ok':
        return 'text-ok';
      case 'risky':
        return 'text-risky';
      default:
        return 'text-foreground';
    }
  };
  
  const getClassificationBg = (classification: Classification) => {
    switch (classification) {
      case 'healthy':
        return 'bg-healthy/10 border-healthy/20';
      case 'ok':
        return 'bg-ok/10 border-ok/20';
      case 'risky':
        return 'bg-risky/10 border-risky/20';
      default:
        return 'bg-muted border-muted';
    }
  };
  
  const getClassificationIcon = (classification: Classification) => {
    switch (classification) {
      case 'healthy':
        return <ShieldCheck className="h-6 w-6 text-healthy" />;
      case 'ok':
        return <AlarmClock className="h-6 w-6 text-ok" />;
      case 'risky':
        return <ShieldAlert className="h-6 w-6 text-risky" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin-slow"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary border-b-transparent border-l-transparent animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
        </div>
        <p className="text-lg font-medium text-center">Analyzing product...</p>
        <p className="text-sm text-muted-foreground text-center mt-2">
          Checking ingredients and nutritional information against your profile
        </p>
      </div>
    );
  }
  
  if (!productData || !classification) {
    return (
      <div className="text-center p-6">
        <p>No product data available. Please scan a product first.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Go to Scanner
        </Button>
      </div>
    );
  }
  
  const {
    name,
    brand,
    ingredients,
    nutritionalInfo
  } = productData;
  
  const nutritionScore = getNutritionScore(nutritionalInfo);
  
  return (
    <div className="w-full max-w-3xl mx-auto animate-scale-in">
      <Card className="glass-card overflow-hidden">
        <CardHeader className={`${getClassificationBg(classification.classification)} transition-colors duration-300`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
              {getClassificationIcon(classification.classification)}
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Classification
              </p>
              <h3 className={`text-2xl font-bold ${getClassificationColor(classification.classification)}`}>
                {classification.classification === 'healthy' && 'Healthy Choice'}
                {classification.classification === 'ok' && 'Acceptable Option'}
                {classification.classification === 'risky' && 'Use Caution'}
              </h3>
            </div>
          </div>
          
          <div className="space-y-1">
            <CardTitle className="text-xl">{name}</CardTitle>
            <CardDescription>Brand: {brand}</CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-0 animate-fade-in">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-muted-foreground">Nutrition Score</p>
                    <div className="flex items-center gap-3">
                      <Progress value={nutritionScore} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{nutritionScore}%</span>
                    </div>
                  </div>
                  
                  {classification.fitnessCompatibility && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                      <div className={`flex-shrink-0 p-1 rounded-full ${
                        classification.fitnessCompatibility.compatible 
                          ? "bg-healthy/20 text-healthy" 
                          : "bg-risky/20 text-risky"
                      }`}>
                        {classification.fitnessCompatibility.compatible 
                          ? <CheckCircle2 className="h-5 w-5" /> 
                          : <AlertCircle className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="text-xs font-medium">Fitness Goals</p>
                        <p className="text-sm">{
                          classification.fitnessCompatibility.compatible 
                            ? "Compatible" 
                            : "Not Ideal"
                        }</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {classification.warnings && classification.warnings.length > 0 && (
                  <div className="p-4 rounded-lg border border-risky/30 bg-risky/5">
                    <h4 className="flex items-center gap-2 text-risky font-medium">
                      <AlertCircle className="h-4 w-4" />
                      <span>Warnings</span>
                    </h4>
                    <ul className="mt-2 space-y-1">
                      {classification.warnings.map((warning, index) => (
                        <li key={index} className="text-sm flex items-start gap-2">
                          <span className="inline-block h-4 w-4 text-risky">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <h4 className="font-medium">Analysis</h4>
                  <ul className="space-y-1.5">
                    {classification.reasons.map((reason, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="inline-block h-4 w-4 flex-shrink-0">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                    
                    {classification.fitnessCompatibility?.reasons.map((reason, index) => (
                      <li key={`fitness-${index}`} className="text-sm flex items-start gap-2 text-muted-foreground">
                        <span className="inline-block h-4 w-4 flex-shrink-0">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {classification.alternatives && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Healthier Alternatives</h4>
                    <ul className="space-y-1.5">
                      {classification.alternatives.map((alternative, index) => (
                        <li key={index} className="text-sm flex items-start gap-2 text-healthy">
                          <span className="inline-block h-4 w-4 flex-shrink-0">•</span>
                          <span>{alternative}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-0 animate-fade-in">
              <div className="space-y-4">
                <h4 className="font-medium">Ingredients List</h4>
                <div className="rounded-lg border border-border bg-card p-4">
                  <ul className="space-y-1">
                    {ingredients.map((ingredient: string, index: number) => {
                      // Check if ingredient is problematic
                      const isProblematic = classification.reasons.some(reason => 
                        reason.toLowerCase().includes(ingredient.toLowerCase())
                      );
                      const isWarning = classification.warnings?.some(warning => 
                        warning.toLowerCase().includes(ingredient.toLowerCase())
                      );
                      
                      return (
                        <li 
                          key={index} 
                          className={`text-sm px-2 py-1 rounded ${
                            isWarning 
                              ? "bg-risky/10 text-risky" 
                              : isProblematic 
                              ? "bg-ok/10 text-ok" 
                              : ""
                          }`}
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="flex items-center">
                                  {ingredient}
                                  {(isWarning || isProblematic) && (
                                    <span className="inline-block ml-2">
                                      {isWarning 
                                        ? <AlertCircle className="h-3.5 w-3.5 text-risky" /> 
                                        : <Info className="h-3.5 w-3.5 text-ok" />
                                      }
                                    </span>
                                  )}
                                </span>
                              </TooltipTrigger>
                              {(isWarning || isProblematic) && (
                                <TooltipContent>
                                  {isWarning 
                                    ? "This ingredient conflicts with your health profile" 
                                    : "This ingredient may be concerning"
                                  }
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nutrition" className="mt-0 animate-fade-in">
              <div className="space-y-4">
                <h4 className="font-medium">Nutritional Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card flex flex-col">
                    <span className="text-sm text-muted-foreground">Calories</span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.calories}</span>
                    <span className="text-xs text-muted-foreground">kcal</span>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-border bg-card flex flex-col">
                    <span className="text-sm text-muted-foreground">Protein</span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.protein}g</span>
                    <div className="mt-2">
                      <Progress value={(nutritionalInfo.protein / 50) * 100} className="h-1" />
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-border bg-card flex flex-col">
                    <span className="text-sm text-muted-foreground">Carbs</span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.carbs}g</span>
                    <div className="mt-2">
                      <Progress value={(nutritionalInfo.carbs / 300) * 100} className="h-1" />
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border border-border bg-card flex flex-col">
                    <span className="text-sm text-muted-foreground">Fat</span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.fat}g</span>
                    <div className="mt-2">
                      <Progress value={(nutritionalInfo.fat / 70) * 100} className="h-1" />
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    nutritionalInfo.sugar > 25 
                      ? "border-risky/30 bg-risky/5" 
                      : "border-border bg-card"
                  } flex flex-col`}>
                    <span className={`text-sm ${
                      nutritionalInfo.sugar > 25 ? "text-risky" : "text-muted-foreground"
                    }`}>
                      Sugar
                    </span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.sugar}g</span>
                    <div className="mt-2">
                      <Progress 
                        value={(nutritionalInfo.sugar / 50) * 100} 
                        className={`h-1 ${nutritionalInfo.sugar > 25 ? "bg-risky/30" : ""}`} 
                      />
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${
                    nutritionalInfo.sodium > 200 
                      ? "border-ok/30 bg-ok/5" 
                      : "border-border bg-card"
                  } flex flex-col`}>
                    <span className={`text-sm ${
                      nutritionalInfo.sodium > 200 ? "text-ok" : "text-muted-foreground"
                    }`}>
                      Sodium
                    </span>
                    <span className="text-2xl font-semibold">{nutritionalInfo.sodium}mg</span>
                    <div className="mt-2">
                      <Progress 
                        value={(nutritionalInfo.sodium / 500) * 100} 
                        className={`h-1 ${nutritionalInfo.sodium > 200 ? "bg-ok/30" : ""}`} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-border/50 p-4 bg-background/20">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Scan Another</span>
          </Button>
          
          <Button 
            onClick={() => navigate('/profile')}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <span>Update Profile</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Results;
