// src/engine/DietaryRules.js

export const applyConditionRules = (conditions, baseMacros) => {
  let adjustedMacros = { ...baseMacros };
  let restrictions = [];
  let recommendations = [];
  let insights = [];

  const knownConditions = ['diabetes', 'hypertension', 'pcos', 'thyroid', 'anemia', 'obesity'];
  
  // Handled specialized rules
  if (conditions.includes('diabetes')) {
    restrictions.push('refined sugars', 'high-GI foods', 'sweetened beverages', 'white bread');
    recommendations.push('complex carbohydrates', 'cinnamon', 'fenugreek', 'high-fiber foods');
    insights.push('Diabetes Rule: Carbohydrates should have a Low Glycemic Index to prevent glucose spikes.');
    adjustedMacros.carbs = Math.max(adjustedMacros.carbs - 20, 100); 
    adjustedMacros.protein += 10;
  }

  if (conditions.includes('hypertension')) {
    restrictions.push('high sodium foods', 'processed meats', 'pickles', 'excess caffeine');
    recommendations.push('potassium-rich foods (bananas, spinach)', 'DASH diet foods', 'garlic');
    insights.push('Hypertension Rule: Sodium intake limited to under 1500mg/day.');
  }

  if (conditions.includes('pcos')) {
    restrictions.push('refined carbs', 'sugar', 'excess dairy (often)');
    recommendations.push('omega-3 rich foods', 'flaxseeds', 'low-GI fruits');
    insights.push('PCOS Rule: Focus on anti-inflammatory and low-GI foods to manage insulin resistance.');
  }
  
  if (conditions.includes('thyroid')) {
    restrictions.push('excessive raw cruciferous vegetables', 'unfermented soy');
    recommendations.push('iodine-rich foods', 'brazil nuts (selenium)', 'zinc-rich foods');
    insights.push('Thyroid Rule: Monitor goitrogen intake and ensure adequate selenium and zinc.');
  }

  if (conditions.includes('anemia')) {
    restrictions.push('tea/coffee with meals');
    recommendations.push('iron-rich foods', 'vitamin C with iron sources');
    insights.push('Anemia Rule: Pair iron-rich foods with Vitamin C to boost absorption.');
  }

  // Handle Unknown/Custom Conditions
  conditions.forEach(cond => {
    if (!knownConditions.includes(cond.toLowerCase())) {
      insights.push(`Custom Condition Warning: For ${cond}, we recommend consulting a specialist for specific micronutrient requirements.`);
    }
  });

  return { adjustedMacros, restrictions, recommendations, insights };
};

export const applyAllergyRules = (allergies) => {
  let finalRestrictions = [];
  
  if (allergies.includes('lactose')) {
    finalRestrictions.push('dairy', 'milk', 'cheese', 'butter', 'cream');
  }
  if (allergies.includes('gluten')) {
    finalRestrictions.push('wheat', 'barley', 'rye', 'seitan', 'regular bread', 'pasta');
  }
  if (allergies.includes('nut')) {
    finalRestrictions.push('peanuts', 'tree nuts', 'almonds', 'walnuts', 'cashews', 'nut butters');
  }

  return finalRestrictions;
};
