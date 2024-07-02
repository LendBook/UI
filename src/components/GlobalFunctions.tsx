export const formatNumber = (num: string | number): string => {
  if (num === "") {
    return "";
  }
  if (typeof num === "string") {
    num = parseFloat(num);
  }
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

// /////////////////////////////////////////////////////////////
// function used to update some elements inside an object
// /////////////////////////////////////////////////////////////

export interface ObjectWithId {
  id: number;
  [key: string]: string | number; // Utiliser 'any' pour permettre n'importe quel type de valeur
}

export const mergeObjects = (
  objectA: ObjectWithId[],
  objectB: ObjectWithId[]
): ObjectWithId[] => {
  return objectA.map((itemA) => {
    const itemB = objectB.find((item) => item.poolId === itemA.poolId);
    return {
      ...itemA,
      ...itemB, // fusionne les propriétés de itemB dans itemA
    };
  });
};
