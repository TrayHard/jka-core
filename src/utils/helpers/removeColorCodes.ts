export const removeColorCodes = (str: string) => {
    if (typeof str !== "string") throw new TypeError('Accepts only string');
    return str.replaceAll(/\^\d/g, '');
}
