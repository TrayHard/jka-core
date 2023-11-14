import { removeColorCodes } from "./removeColorCodes";

describe('removeColorCodes', () => {
    test('works correctly', () => {
        expect(removeColorCodes('Hello^^1World')).toBe('Hello^World');
        expect(removeColorCodes('Hello^^1^2^^3^^4^5^6^^^7^8^9World')).toBe('Hello^^^^^World');
        expect(removeColorCodes('Hello^^')).toBe('Hello^^');
        expect(removeColorCodes('Hello^^^^^1')).toBe('Hello^^^^');
        expect(removeColorCodes('Hello^^World')).toBe('Hello^^World');
    })
    test('checks user input', () => {
        expect(() => removeColorCodes(2 as unknown as string)).toThrow();
        expect(() => removeColorCodes({} as unknown as string)).toThrow();
        expect(() => removeColorCodes([] as unknown as string)).toThrow();
        expect(() => removeColorCodes((() => {}) as unknown as string)).toThrow();
        expect(() => removeColorCodes(true as unknown as string)).toThrow();
    })

})
