
import { Allergen, DietaryRestriction, FitnessGoal, HealthCondition } from '../contexts/UserContext';

interface Product {
  name: string;
  brand: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    sugar: number;
    sodium: number;
  }
}

export type Classification = 'healthy' | 'ok' | 'risky';

interface ClassificationResult {
  classification: Classification;
  reasons: string[];
  alternatives?: string[];
  warnings?: string[];
  fitnessCompatibility?: {
    compatible: boolean;
    reasons: string[];
  };
}

// Map of known problematic ingredients
const problematicIngredients = new Map<string, { issue: string, severity: 'high' | 'medium' | 'low' }>([
  ['high fructose corn syrup', { issue: 'May contribute to obesity and metabolic syndrome', severity: 'high' }],
  ['artificial sweeteners', { issue: 'May affect gut microbiome', severity: 'medium' }],
  ['sodium benzoate', { issue: 'May cause allergic reactions in some individuals', severity: 'medium' }],
  ['msg', { issue: 'May cause headaches in sensitive individuals', severity: 'medium' }],
  ['trans fats', { issue: 'Increases risk of heart disease', severity: 'high' }],
  ['yellow 5', { issue: 'May cause allergic reactions or hyperactivity', severity: 'medium' }],
  ['red 40', { issue: 'May cause allergic reactions or hyperactivity', severity: 'medium' }],
  ['bha', { issue: 'Potential carcinogen', severity: 'high' }],
  ['bht', { issue: 'Potential endocrine disruptor', severity: 'high' }],
  ['partially hydrogenated oils', { issue: 'Contains trans fats which increase heart disease risk', severity: 'high' }],
]);

// Map of common allergens
const allergenMap = new Map<Allergen, string[]>([
  ['peanuts', ['peanuts', 'peanut oil', 'peanut flour', 'arachis oil']],
  ['dairy', ['milk', 'cream', 'butter', 'cheese', 'yogurt', 'whey', 'casein', 'lactose']],
  ['gluten', ['wheat', 'barley', 'rye', 'malt', 'seitan', 'triticale']],
  ['shellfish', ['shrimp', 'crab', 'lobster', 'crayfish', 'prawn']],
  ['eggs', ['egg', 'albumin', 'globulin', 'ovomucin', 'vitellin']],
  ['soy', ['soy', 'soya', 'edamame', 'tofu', 'miso', 'tempeh']],
  ['tree nuts', ['almond', 'hazelnut', 'walnut', 'cashew', 'pecan', 'pistachio']],
  ['fish', ['fish', 'cod', 'salmon', 'trout', 'tuna', 'bass', 'flounder']]
]);

// Map of dietary restrictions
const dietaryRestrictionMap = new Map<DietaryRestriction, string[]>([
  ['vegan', ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'dairy', 'eggs', 'honey', 'gelatin', 'whey', 'casein']],
  ['vegetarian', ['meat', 'chicken', 'beef', 'pork', 'fish', 'seafood', 'gelatin']],
  ['keto', ['sugar', 'high fructose corn syrup', 'honey', 'agave', 'maple syrup', 'flour', 'rice', 'potato']],
  ['paleo', ['dairy', 'grains', 'legumes', 'refined sugar', 'refined oils']],
  ['low carb', ['sugar', 'flour', 'corn syrup', 'rice', 'potato', 'bread', 'pasta']],
  ['low fat', ['oil', 'butter', 'lard', 'cream', 'full fat']],
  ['low sugar', ['sugar', 'corn syrup', 'fructose', 'sucrose', 'dextrose', 'maltose', 'honey']],
  ['low sodium', ['salt', 'sodium chloride', 'monosodium glutamate', 'baking soda', 'sodium nitrite']]
]);

// Map of health conditions and problematic ingredients
const healthConditionMap = new Map<HealthCondition, string[]>([
  ['diabetes', ['sugar', 'high fructose corn syrup', 'corn syrup', 'honey', 'agave nectar', 'white flour']],
  ['hypertension', ['salt', 'sodium', 'msg', 'baking soda', 'sodium nitrite', 'sodium benzoate']],
  ['high cholesterol', ['trans fats', 'saturated fats', 'hydrogenated oils', 'lard', 'butter', 'full fat dairy']],
  ['heart disease', ['trans fats', 'sodium', 'hydrogenated oils', 'artificial flavors', 'high fructose corn syrup']],
  ['celiac', ['wheat', 'barley', 'rye', 'malt', 'seitan', 'triticale']],
  ['IBS', ['dairy', 'gluten', 'fructose', 'caffeine', 'alcohol', 'artificial sweeteners']]
]);

// Map of fitness goals and nutritional considerations
const fitnessGoalMap = new Map<FitnessGoal, {
  good: string[],
  avoid: string[],
  nutritionTarget: {
    protein?: { min: number, max: number }, // g
    carbs?: { min: number, max: number },  // g
    fat?: { min: number, max: number },    // g
    sugar?: { max: number },               // g
    calories?: { min?: number, max?: number } // kcal
  }
}>([
  ['weight loss', {
    good: ['protein', 'fiber', 'water'],
    avoid: ['added sugar', 'high fructose corn syrup', 'trans fats', 'refined carbs'],
    nutritionTarget: {
      sugar: { max: 25 },
      calories: { max: 300 }
    }
  }],
  ['muscle gain', {
    good: ['protein', 'complete proteins', 'creatine', 'amino acids'],
    avoid: ['added sugar', 'trans fats'],
    nutritionTarget: {
      protein: { min: 20, max: 50 },
      calories: { min: 200 }
    }
  }],
  ['maintenance', {
    good: ['balanced nutrients', 'protein', 'fiber', 'healthy fats'],
    avoid: ['excessive sugar', 'trans fats'],
    nutritionTarget: {
      sugar: { max: 30 }
    }
  }],
  ['endurance', {
    good: ['complex carbs', 'electrolytes', 'protein'],
    avoid: ['excessive fat', 'fiber before exercise'],
    nutritionTarget: {
      carbs: { min: 30 }
    }
  }],
  ['general health', {
    good: ['whole foods', 'fruits', 'vegetables', 'lean protein', 'fiber'],
    avoid: ['artificial ingredients', 'high sugar', 'trans fats'],
    nutritionTarget: {
      sugar: { max: 25 }
    }
  }]
]);

export const classifyProduct = (
  product: Product, 
  userAllergens: Allergen[], 
  userDietaryRestrictions: DietaryRestriction[],
  userHealthConditions: HealthCondition[],
  userFitnessGoals: FitnessGoal[]
): ClassificationResult => {
  // Convert all ingredients to lowercase for easier matching
  const lowercaseIngredients = product.ingredients.map(i => i.toLowerCase());
  
  const reasons: string[] = [];
  const warnings: string[] = [];
  const problematicFound: { ingredient: string, issue: string, severity: 'high' | 'medium' | 'low' }[] = [];
  
  // Check for allergens
  userAllergens.forEach(allergen => {
    const allergenItems = allergenMap.get(allergen) || [];
    const foundAllergen = lowercaseIngredients.some(ingredient => 
      allergenItems.some(allergenItem => ingredient.includes(allergenItem))
    );
    
    if (foundAllergen) {
      warnings.push(`Contains ${allergen} allergen`);
      problematicFound.push({ 
        ingredient: allergen, 
        issue: `Contains ${allergen} which you are allergic to`, 
        severity: 'high'
      });
    }
  });
  
  // Check for dietary restrictions
  userDietaryRestrictions.forEach(restriction => {
    const restrictedItems = dietaryRestrictionMap.get(restriction) || [];
    restrictedItems.forEach(item => {
      const foundRestricted = lowercaseIngredients.some(ingredient => ingredient.includes(item));
      if (foundRestricted) {
        reasons.push(`Contains ${item} (not ${restriction} friendly)`);
        problematicFound.push({
          ingredient: item,
          issue: `Not compatible with ${restriction} diet`,
          severity: 'medium'
        });
      }
    });
  });
  
  // Check for health condition considerations
  userHealthConditions.forEach(condition => {
    if (condition === 'none') return;
    
    const problematicItems = healthConditionMap.get(condition) || [];
    problematicItems.forEach(item => {
      const foundProblematic = lowercaseIngredients.some(ingredient => ingredient.includes(item));
      if (foundProblematic) {
        warnings.push(`Contains ${item} (concern for ${condition})`);
        problematicFound.push({
          ingredient: item,
          issue: `Not recommended for people with ${condition}`,
          severity: 'high'
        });
      }
    });
  });
  
  // Check for generally problematic ingredients
  lowercaseIngredients.forEach(ingredient => {
    problematicIngredients.forEach((details, problematicIngredient) => {
      if (ingredient.includes(problematicIngredient)) {
        reasons.push(`Contains ${problematicIngredient}: ${details.issue}`);
        problematicFound.push({
          ingredient: problematicIngredient,
          issue: details.issue,
          severity: details.severity
        });
      }
    });
  });
  
  // Assess nutritional info for fitness goals
  const fitnessCompatibility = {
    compatible: true,
    reasons: [] as string[]
  };
  
  userFitnessGoals.forEach(goal => {
    const goalInfo = fitnessGoalMap.get(goal);
    if (!goalInfo) return;
    
    const { nutritionTarget } = goalInfo;
    
    // Check nutrition values
    if (nutritionTarget.protein && product.nutritionalInfo.protein < nutritionTarget.protein.min) {
      fitnessCompatibility.reasons.push(`Low in protein for ${goal}`);
      fitnessCompatibility.compatible = false;
    }
    
    if (nutritionTarget.carbs && product.nutritionalInfo.carbs < nutritionTarget.carbs.min) {
      fitnessCompatibility.reasons.push(`Low in carbs for ${goal}`);
      fitnessCompatibility.compatible = false;
    }
    
    if (nutritionTarget.sugar && product.nutritionalInfo.sugar > nutritionTarget.sugar.max) {
      fitnessCompatibility.reasons.push(`High in sugar for ${goal}`);
      fitnessCompatibility.compatible = false;
    }
    
    if (nutritionTarget.calories?.max && product.nutritionalInfo.calories > nutritionTarget.calories.max) {
      fitnessCompatibility.reasons.push(`High in calories for ${goal}`);
      fitnessCompatibility.compatible = false;
    }
    
    if (nutritionTarget.calories?.min && product.nutritionalInfo.calories < nutritionTarget.calories.min) {
      fitnessCompatibility.reasons.push(`Low in calories for ${goal}`);
      fitnessCompatibility.compatible = false;
    }
  });
  
  // Determine classification based on findings
  let classification: Classification;
  const highSeverityIssues = problematicFound.filter(p => p.severity === 'high').length;
  const mediumSeverityIssues = problematicFound.filter(p => p.severity === 'medium').length;
  
  // Suggest alternatives
  const alternatives: string[] = [];
  if (problematicFound.some(p => p.ingredient.includes('high fructose corn syrup'))) {
    alternatives.push('Products sweetened with natural sources like honey or monk fruit');
  }
  if (problematicFound.some(p => p.ingredient.includes('artificial'))) {
    alternatives.push('Products with natural ingredients');
  }
  if (problematicFound.some(p => p.ingredient.includes('sodium'))) {
    alternatives.push('Low-sodium alternatives');
  }
  
  if (warnings.length > 0 || highSeverityIssues > 0) {
    classification = 'risky';
  } else if (mediumSeverityIssues > 0 || reasons.length > 0) {
    classification = 'ok';
  } else {
    classification = 'healthy';
    reasons.push('No problematic ingredients detected');
  }
  
  return {
    classification,
    reasons,
    warnings: warnings.length > 0 ? warnings : undefined,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    fitnessCompatibility: fitnessCompatibility.reasons.length > 0 ? fitnessCompatibility : undefined
  };
};
