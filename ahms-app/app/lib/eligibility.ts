// lib/eligibility.ts

export interface ApplicantData {
  monthlyIncome: number;
  hasExistingProperty: boolean;
  isVictimOfLandDispute: boolean;
  familySize: number;
  yearsResidingInCambodia: number;
}

export const checkEligibility = (data: ApplicantData) => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Income Ceiling (MLMUPC Standard 2026)
  // Rejection if income is too high for "Affordable" status
  if (data.monthlyIncome > 800) { 
    return { eligible: false, message: "Income exceeds Affordable Housing limit ($800)." };
  }

  // 2. The "One-Family-One-House" Rule
  if (data.hasExistingProperty) {
    return { eligible: false, message: "Applicant already owns a registered property." };
  }

  // 3. Scoring for Priority Groups
  if (data.isVictimOfLandDispute) {
    score += 50; // Highest priority
    reasons.push("Victim/Displaced Status Priority (+50)");
  }

  if (data.familySize >= 4) {
    score += 20;
    reasons.push("Large Family Support (+20)");
  }

  return {
    eligible: true,
    totalScore: score,
    priorityLevel: score >= 50 ? "High" : "Standard",
    details: reasons
  };
};