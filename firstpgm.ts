// Create a Function To Convert first Letter Of Each Word in a string in caps   
function capitalizeWords(str: string): string {
    let words = str.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(' ');
}
//example usage
const inputString = "hello world from typescript";
const capitalizedString = capitalizeWords(inputString);
console.log(capitalizedString); // Output: "Hello World From Typescript"
   

//example usage
const inputString2 = "this is a test string";
const capitalizedString2 = capitalizeWords(inputString2);
console.log(capitalizedString2); // Output: "This Is A Test String"

// Create a Function To Add Two Strings
function addStrings(firstString: string, secondString: string): string {
    return firstString + secondString;
}

// Create a Function To Add Two Numbers From An Array
function addNumbers(numbers: [number, number]): number {
    return numbers[0] + numbers[1];
}

// example usage
const sum = addNumbers([5, 3]);
console.log(sum); // Output: 8

// example usage
const combinedString = addStrings("Hello, ", "TypeScript!");
console.log(combinedString); // Output: "Hello, TypeScript!"
