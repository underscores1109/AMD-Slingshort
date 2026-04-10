// src/engine/Calculations.js
/**
 * Calculates BMI (Body Mass Index)
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @returns {number} BMI value
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return +(weight / (heightInMeters * heightInMeters)).toFixed(1);
};

/**
 * Calculates BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * @param {number} weight - Weight in kg
 * @param {number} height - Height in cm
 * @param {number} age - Age in years
 * @param {string} gender - 'male' or 'female'
 * @returns {number} BMR value
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0;
  // Mifflin-St Jeor
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? bmr + 5 : bmr - 161;
};

/**
 * Calculates TDEE (Total Daily Energy Expenditure) based on activity level
 * @param {number} bmr - Basal Metabolic Rate
 * @param {string} activityLevel - 'sedentary', 'moderate', 'active'
 * @returns {number} TDEE value
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.725
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
};

/**
 * Calculates recommended daily calories based on BMI goal
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {number} bmi - Body Mass Index
 * @returns {number} Recommended Calorie Intake
 */
export const calculateCalorieGoal = (tdee, bmi) => {
  if (bmi < 18.5) {
    // Underweight - caloric surplus
    return tdee + 500;
  } else if (bmi >= 25) {
    // Overweight/Obese - caloric deficit
    return tdee - 500;
  }
  // Normal - maintenance
  return tdee;
};

/**
 * Calculate basic Macro split based on total calories and goals
 */
export const calculateMacros = (calories, bmi) => {
  let carbsPercent, proteinPercent, fatPercent;
  
  if (bmi >= 25) {
    // Weight loss focus - higher protein, lower carbs
    proteinPercent = 0.35;
    carbsPercent = 0.40;
    fatPercent = 0.25;
  } else if (bmi < 18.5) {
    // Weight gain focus - higher carbs, moderate protein
    carbsPercent = 0.50;
    proteinPercent = 0.25;
    fatPercent = 0.25;
  } else {
    // Maintenance
    carbsPercent = 0.45;
    proteinPercent = 0.30;
    fatPercent = 0.25;
  }

  return {
    protein: Math.round((calories * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((calories * carbsPercent) / 4), // 4 cal/g
    fats: Math.round((calories * fatPercent) / 9), // 9 cal/g
  };
};
