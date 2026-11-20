export function reverseEachWord(input: string): string {
    return input.replace(/\S+/g, (word) => [...word].reverse().join(""));
}

// Example
const sentence = "hello TypeScript world";
console.log(reverseEachWord(sentence)); // Output: "olleh tpircSepyT dlrow"
