import { readFile } from "node:fs/promises";

// Read and parse JSON data from a file
async function readJsonData<T = unknown>(filePath: string): Promise<T> {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
}

// Example usage
readJsonData<{ name: string; age: number }>("data.json")
    .then((jsonData) => console.log(jsonData))
    .catch((error) => console.error("Unable to read JSON data:", error));
