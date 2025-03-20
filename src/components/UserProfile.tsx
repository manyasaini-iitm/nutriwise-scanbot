import { useState } from "react";
import { 
  Save, Trash2, Plus, Edit, CircleAlert, X,
  Salad, Apple, Scissors, Thermometer
} from "lucide-react";
import { 
  Allergen, DietaryRestriction, 
  HealthCondition, useUser 
} from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const allergenOptions: { value: Allergen; label: string }[] = [
  { value: "peanuts", label: "Peanuts" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "shellfish", label: "Shellfish" },
  { value: "eggs", label: "Eggs" },
  { value: "soy", label: "Soy" },
  { value: "tree nuts", label: "Tree Nuts" },
  { value: "fish", label: "Fish" },
];

const dietaryOptions: { value: DietaryRestriction; label: string; icon: any }[] = [
  { value: "vegan", label: "Vegan", icon: Salad },
  { value: "vegetarian", label: "Vegetarian", icon: Apple },
  { value: "keto", label: "Keto", icon: Scissors },
  { value: "paleo", label: "Paleo", icon: Apple },
  { value: "low carb", label: "Low Carb", icon: Scissors },
  { value: "low fat", label: "Low Fat", icon: Scissors },
  { value: "low sugar", label: "Low Sugar", icon: Scissors },
  { value: "low sodium", label: "Low Sodium", icon: Thermometer },
];

const healthConditionOptions: { value: HealthCondition; label: string }[] = [
  { value: "none", label: "None" },
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
  { value: "high cholesterol", label: "High Cholesterol" },
  { value: "heart disease", label: "Heart Disease" },
  { value: "celiac", label: "Celiac Disease" },
  { value: "IBS", label: "Irritable Bowel Syndrome (IBS)" },
];

const UserProfile = () => {
  const { userProfile, updateUserProfile, resetProfile } = useUser();
  const { toast } = useToast();
  const [editMode, setEditMode] = useState(false);
  const [localProfile, setLocalProfile] = useState({ ...userProfile });
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [newAllergen, setNewAllergen] = useState("");
  const [addAllergenOpen, setAddAllergenOpen] = useState(false);

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "age" || name === "height" || name === "weight") {
      setLocalProfile({
        ...localProfile,
        [name]: Number(value),
      });
    } else {
      setLocalProfile({
        ...localProfile,
        [name]: value,
      });
    }
  };

  const toggleAllergen = (allergen: Allergen) => {
    const currentAllergens = [...localProfile.allergens];
    const index = currentAllergens.indexOf(allergen);
    
    if (index === -1) {
      setLocalProfile({
        ...localProfile,
        allergens: [...currentAllergens, allergen],
      });
    } else {
      currentAllergens.splice(index, 1);
      setLocalProfile({
        ...localProfile,
        allergens: currentAllergens,
      });
    }
  };

  const addCustomAllergen = () => {
    if (!newAllergen.trim()) return;
    
    const customAllergen = newAllergen.trim().toLowerCase() as Allergen;
    
    if (!localProfile.allergens.includes(customAllergen)) {
      setLocalProfile({
        ...localProfile,
        allergens: [...localProfile.allergens, customAllergen],
      });
      
      if (!allergenOptions.some(option => option.value === customAllergen)) {
        allergenOptions.push({
          value: customAllergen,
          label: newAllergen.trim()
        });
      }
      
      setNewAllergen("");
      setAddAllergenOpen(false);
      
      toast({
        title: "Allergen Added",
        description: `${newAllergen.trim()} has been added to your allergens.`,
      });
    }
  };

  const toggleDietaryRestriction = (restriction: DietaryRestriction) => {
    const currentRestrictions = [...localProfile.dietaryRestrictions];
    const index = currentRestrictions.indexOf(restriction);
    
    if (index === -1) {
      setLocalProfile({
        ...localProfile,
        dietaryRestrictions: [...currentRestrictions, restriction],
      });
    } else {
      currentRestrictions.splice(index, 1);
      setLocalProfile({
        ...localProfile,
        dietaryRestrictions: currentRestrictions,
      });
    }
  };

  const handleHealthConditionChange = (condition: HealthCondition) => {
    if (condition === "none") {
      setLocalProfile({
        ...localProfile,
        healthConditions: [],
      });
    } else {
      const currentConditions = [...localProfile.healthConditions].filter(c => c !== "none");
      const index = currentConditions.indexOf(condition);
      
      if (index === -1) {
        setLocalProfile({
          ...localProfile,
          healthConditions: [...currentConditions, condition],
        });
      } else {
        currentConditions.splice(index, 1);
        setLocalProfile({
          ...localProfile,
          healthConditions: currentConditions.length ? currentConditions : ["none"],
        });
      }
    }
  };

  const saveChanges = () => {
    updateUserProfile(localProfile);
    setEditMode(false);
    toast({
      title: "Profile Updated",
      description: "Your health profile has been saved successfully.",
    });
  };

  const startEditing = () => {
    setLocalProfile({ ...userProfile });
    setEditMode(true);
  };

  const cancelEditing = () => {
    setLocalProfile({ ...userProfile });
    setEditMode(false);
  };

  const handleResetProfile = () => {
    resetProfile();
    setEditMode(false);
    setResetConfirmOpen(false);
    toast({
      title: "Profile Reset",
      description: "Your health profile has been reset to default values.",
    });
  };

  const removeAllergen = (allergen: Allergen) => {
    const updatedAllergens = localProfile.allergens.filter(a => a !== allergen);
    setLocalProfile({
      ...localProfile,
      allergens: updatedAllergens,
    });
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-scale-in">
      <Card className="glass-card overflow-hidden border-white/30 dark:border-white/10">
        <CardHeader className="relative">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Medical History & Preferences
            </span>
            {!editMode && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={startEditing}
                className="absolute right-4 top-4 p-2 rounded-full hover:bg-background/50"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile</span>
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Customize your health profile to get personalized nutrition recommendations
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="basic-info" className="border-b border-border/50">
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="text-base font-medium">Basic Information</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={localProfile.name}
                      onChange={handleBasicInfoChange}
                      placeholder="Your name"
                      disabled={!editMode}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={localProfile.age}
                      onChange={handleBasicInfoChange}
                      disabled={!editMode}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={localProfile.height}
                      onChange={handleBasicInfoChange}
                      disabled={!editMode}
                      className="transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={localProfile.weight}
                      onChange={handleBasicInfoChange}
                      disabled={!editMode}
                      className="transition-all duration-200"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="allergens" className="border-b border-border/50">
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="text-base font-medium">Allergens</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Select any allergens that you need to avoid
                    </p>
                    {editMode && (
                      <Dialog open={addAllergenOpen} onOpenChange={setAddAllergenOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 gap-1">
                            <Plus className="h-3.5 w-3.5" />
                            <span className="text-xs">Add Allergen</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Custom Allergen</DialogTitle>
                            <DialogDescription>
                              Enter the name of the allergen you want to add to your profile.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2 py-4">
                            <div className="grid flex-1 gap-2">
                              <Label htmlFor="allergen-name" className="sr-only">
                                Allergen Name
                              </Label>
                              <Input
                                id="allergen-name"
                                placeholder="Enter allergen name"
                                value={newAllergen}
                                onChange={(e) => setNewAllergen(e.target.value)}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setAddAllergenOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={addCustomAllergen}
                              disabled={!newAllergen.trim()}
                            >
                              Add
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allergenOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={localProfile.allergens.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => editMode && toggleAllergen(option.value)}
                        disabled={!editMode}
                        className={`rounded-full transition-all ${
                          localProfile.allergens.includes(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-background hover:bg-background/80"
                        }`}
                      >
                        {option.label}
                        {editMode && localProfile.allergens.includes(option.value) && (
                          <X
                            className="h-3.5 w-3.5 ml-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAllergen(option.value);
                            }}
                          />
                        )}
                      </Button>
                    ))}
                    
                    {localProfile.allergens
                      .filter(allergen => !allergenOptions.some(opt => opt.value === allergen))
                      .map(allergen => (
                        <Button
                          key={allergen}
                          type="button"
                          variant="default"
                          size="sm"
                          className="rounded-full bg-primary text-primary-foreground"
                        >
                          {allergen}
                          {editMode && (
                            <X
                              className="h-3.5 w-3.5 ml-1 cursor-pointer"
                              onClick={() => removeAllergen(allergen)}
                            />
                          )}
                        </Button>
                      ))
                    }
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="dietary" className="border-b border-border/50">
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="text-base font-medium">Dietary Restrictions</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select any dietary restrictions or preferences
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {dietaryOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={option.value}
                          type="button"
                          variant="outline"
                          onClick={() => editMode && toggleDietaryRestriction(option.value)}
                          disabled={!editMode}
                          className={`justify-start gap-2 h-auto py-3 transition-all ${
                            localProfile.dietaryRestrictions.includes(option.value)
                              ? "bg-primary/10 text-primary border-primary/30"
                              : "bg-background hover:bg-background/80"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="health" className="border-b border-border/50">
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="text-base font-medium">Health Conditions</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CircleAlert className="h-4 w-4 text-risky" />
                    <p className="text-sm text-muted-foreground">
                      Select any health conditions that affect your diet
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {healthConditionOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          option.value === "none"
                            ? localProfile.healthConditions.length === 0 || localProfile.healthConditions.includes("none")
                              ? "default"
                              : "outline"
                            : localProfile.healthConditions.includes(option.value)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => editMode && handleHealthConditionChange(option.value)}
                        disabled={!editMode}
                        className="rounded-full transition-all"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="notes" className="border-b-0">
              <AccordionTrigger className="py-4 hover:no-underline">
                <span className="text-base font-medium">Additional Notes</span>
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Medical Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={localProfile.additionalNotes}
                    onChange={handleBasicInfoChange}
                    placeholder="Add any additional notes about your health or dietary needs"
                    disabled={!editMode}
                    className="min-h-[100px] transition-all duration-200"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        
        {editMode && (
          <CardFooter className="flex justify-between border-t border-border/50 p-4 bg-background/20">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={cancelEditing}
                className="text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Button>
              <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-risky">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Profile</DialogTitle>
                    <DialogDescription>
                      This will reset all your health profile data to default values. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleResetProfile}>
                      Reset Profile
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Button 
              onClick={saveChanges}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default UserProfile;

