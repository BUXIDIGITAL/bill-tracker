export const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.warn('Unsupported currency, falling back to CAD', error);
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      maximumFractionDigits: 2,
    }).format(amount);
  }
};
