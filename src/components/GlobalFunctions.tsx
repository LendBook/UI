export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + "B";
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  } else if (num >= 1000) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Ajoute une virgule après les trois premiers chiffres
  } else {
    return num.toFixed(2);
  }
};
