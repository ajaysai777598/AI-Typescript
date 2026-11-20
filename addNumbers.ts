export function addNumbers(firstNumber: number, secondNumber: number): number {
    return firstNumber + secondNumber;
}

// Example 1: Add two numbers directly
console.log(addNumbers(5, 3)); // Output: 8

// Example 2: Add numbers stored in variables
const firstValue = 10;
const secondValue = 20;
console.log(addNumbers(firstValue, secondValue)); // Output: 30

// Example 3: Add a negative number
console.log(addNumbers(-4, 9)); // Output: 5
