import { test, expect } from './fixtures/test';
import { addNumbers } from './addNumbers';

test.describe('addNumbers', () => {
    test('adds two positive numbers', () => {
        expect(addNumbers(5, 3)).toBe(8);
    });

    test('adds a negative and a positive number', () => {
        expect(addNumbers(-4, 9)).toBe(5);
    });

    test('adds zero', () => {
        expect(addNumbers(0, 7)).toBe(7);
    });

    test('adds two negative numbers', () => {
        expect(addNumbers(-4, -6)).toBe(-10);
    });
});
