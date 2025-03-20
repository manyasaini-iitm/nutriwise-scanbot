
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Allergen = 'peanuts' | 'dairy' | 'gluten' | 'shellfish' | 'eggs' | 'soy' | 'tree nuts' | 'fish';
export type DietaryRestriction = 'vegan' | 'vegetarian' | 'keto' | 'paleo' | 'low carb' | 'low fat' | 'low sugar' | 'low sodium';
export type FitnessGoal = 'weight loss' | 'muscle gain' | 'maintenance' | 'endurance' | 'general health';
export type HealthCondition = 'diabetes' | 'hypertension' | 'high cholesterol' | 'heart disease' | 'celiac' | 'IBS' | 'none';

export interface UserProfile {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  allergens: Allergen[];
  dietaryRestrictions: DietaryRestriction[];
  fitnessGoals: FitnessGoal[];
  healthConditions: HealthCondition[];
  additionalNotes: string;
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultUserProfile: UserProfile = {
  name: '',
  age: 30,
  height: 170,
  weight: 70,
  allergens: [],
  dietaryRestrictions: [],
  fitnessGoals: ['general health'],
  healthConditions: [],
  additionalNotes: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) return JSON.parse(savedProfile);
    }
    return defaultUserProfile;
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setUserProfile(defaultUserProfile);
  };

  return (
    <UserContext.Provider value={{ userProfile, updateUserProfile, resetProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
