/**
 * Calculate seller commission based on tiered structure
 * Buyer pays ZERO fees - only sellers pay commission
 */

export const calculateSellerCommission = (amount) => {
  const amountNum = parseFloat(amount);
  
  if (isNaN(amountNum) || amountNum <= 0) {
    return { commission: 0, sellerEarnings: 0, tier: 'invalid' };
  }
  
  let commission = 0;
  let tier = '';
  
  if (amountNum <= 100) {
    // ₹0-100: No commission
    commission = 0;
    tier = '₹0-100 (0%)';
  } else if (amountNum <= 300) {
    // ₹101-300: Flat ₹25
    commission = 25;
    tier = '₹101-300 (Flat ₹25)';
  } else if (amountNum <= 500) {
    // ₹301-500: 10%
    commission = amountNum * 0.10;
    tier = '₹301-500 (10%)';
  } else if (amountNum <= 2000) {
    // ₹501-2000: 13%
    commission = amountNum * 0.13;
    tier = '₹501-2000 (13%)';
  } else if (amountNum <= 5000) {
    // ₹2001-5000: 14%
    commission = amountNum * 0.14;
    tier = '₹2001-5000 (14%)';
  } else {
    // ₹5001+: 15%
    commission = amountNum * 0.15;
    tier = '₹5001+ (15%)';
  }
  
  const sellerEarnings = amountNum - commission;
  
  return {
    amount: amountNum,
    commission: Math.round(commission * 100) / 100, // Round to 2 decimals
    sellerEarnings: Math.round(sellerEarnings * 100) / 100,
    tier,
    percentage: commission > 0 ? Math.round((commission / amountNum) * 100) : 0
  };
};

/**
 * Format currency as INR
 */
export const formatINR = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₹0';
  
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Buyer pays ZERO fees
 */
export const calculateBuyerTotal = (amount) => {
  return {
    amount: parseFloat(amount),
    platformFee: 0,
    total: parseFloat(amount)
  };
};

// Test cases
if (require.main === module) {
  console.log('Testing Fee Structure:\n');
  
  const testAmounts = [50, 100, 150, 300, 400, 500, 1000, 2000, 3000, 5000, 10000];
  
  testAmounts.forEach(amt => {
    const result = calculateSellerCommission(amt);
    console.log(`${formatINR(amt)}: Commission ${formatINR(result.commission)} (${result.tier}), Seller gets ${formatINR(result.sellerEarnings)}`);
  });
}
