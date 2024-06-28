export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export function camelCaseToWords(s: string) {
  // Process camelCase strings
  const result = s.replace(/([A-Z])/g, " $1");

  if(result.trim().split(" ").length<=1){
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  // Capitalize the first letter and keep the rest as is
  return result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
}
