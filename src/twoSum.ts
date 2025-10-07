/**
 * Trouve les indices de deux nombres dans le tableau nums dont la somme est égale à target.
 * @param nums tableau d'entiers
 * @param target somme cible
 * @returns indices des deux nombres
 */
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>(); // valeur -> index
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  throw new Error("Aucune solution trouvée");
}

// Exemples de test
console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]
console.log(twoSum([3, 2, 4], 6)); // [1,2]
console.log(twoSum([3, 3], 6)); // [0,1]
