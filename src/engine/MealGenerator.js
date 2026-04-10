// src/engine/MealGenerator.js
import { FoodDatabase } from '../data/FoodDatabase';

/**
 * Filter foods based on user preferences, allergies, and disease restrictions
 */
const filterFoods = (foods, preference, restrictions) => {
  return foods.filter(food => {
    // Check Preference
    if (!food.pref.includes(preference)) return false;

    // Check Restrictions
    for (let i = 0; i < restrictions.length; i++) {
        // If the restriction word is in the avoid list of the food
        if (food.avoid.some(a => restrictions[i].toLowerCase().includes(a))) {
            return false;
        }
        // General checks for names containing restricted words
        if (food.name.toLowerCase().includes(restrictions[i].toLowerCase())) {
            return false;
        }
    }
    return true;
  });
};

/**
 * Select a random meal from a list
 */
const getRandomMeal = (mealList) => {
    if(!mealList || mealList.length === 0) return null;
    return mealList[Math.floor(Math.random() * mealList.length)];
};

/**
 * Generates a daily meal plan trying to closest match the calorie goal
 */
export const generateDailyPlan = (preference, restrictions, targetCalories, targetMacros) => {
  const allowedFoods = filterFoods(FoodDatabase, preference, restrictions);
  
  const breakfasts = allowedFoods.filter(f => f.type === 'breakfast');
  const lunches = allowedFoods.filter(f => f.type === 'lunch');
  const dinners = allowedFoods.filter(f => f.type === 'dinner');
  const snacks = allowedFoods.filter(f => f.type === 'snack');

  // Simple Algorithm: Pick one of each to form a plan
  // A robust algorithm would use Knapsack or Genetic algo to match macros perfectly, 
  // but for the frontend MVP, we select one of each and scale optionally if needed.
  
  // Try mapping up to a max attempts to get closest to target calories
  let bestPlan = null;
  let minDiff = Infinity;

  const maxAttempts = 10;
  for(let i=0; i < maxAttempts; i++) {
      let b = getRandomMeal(breakfasts);
      let l = getRandomMeal(lunches);
      let d = getRandomMeal(dinners);
      let s = getRandomMeal(snacks);

      // fallback
      if(!b) b = { name: "Safe Porridge", calories: 300, protein: 10, carbs: 50, fats: 5, tags: [] };
      if(!l) l = { name: "Safe Salad Bowl", calories: 400, protein: 15, carbs: 50, fats: 10, tags: [] };
      if(!d) d = { name: "Safe Soup", calories: 300, protein: 10, carbs: 40, fats: 10, tags: [] };
      if(!s) s = { name: "Apple", calories: 95, protein: 0, carbs: 25, fats: 0, tags: [] };

      const totalCals = b.calories + l.calories + d.calories + s.calories;
      const totalProt = b.protein + l.protein + d.protein + s.protein;
      const totalCarbs = b.carbs + l.carbs + d.carbs + s.carbs;
      const totalFats = b.fats + l.fats + d.fats + s.fats;

      const diff = Math.abs(targetCalories - totalCals);
      
      if (diff < minDiff) {
          minDiff = diff;
          bestPlan = {
              meals: { breakfast: b, lunch: l, dinner: d, snack: s },
              totalCalories: totalCals,
              totalProtein: totalProt,
              totalCarbs: totalCarbs,
              totalFats: totalFats
          };
      }
  }

  return bestPlan;
};
