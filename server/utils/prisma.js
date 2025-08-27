// Helper function to convert BigInt values to regular numbers for JSON serialization
export function convertBigInts(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigInts);
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigInts(value);
    }
    return converted;
  }
  return obj;
}
