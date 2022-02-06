/**
 *
 * @param promise Promise to execute
 * @param timeout Time in secs after which execution is interrupted (default: 1)
 * @param errorMessage Message for error in case of timeout
 * @returns promise or throws error
 */
export function executeOrTimeout<T>(promise: Promise<T>, timeout = 1, errorMessage?: string) {
  return Promise.race<T>([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => {
      reject(new Error(errorMessage || 'Timeout!'))
    }, 1000 * timeout))
  ])
}

export function snakeToCamel(str: string): string {
  return str
    .replace(
      /[_][a-z]/g,
      (group) => group.slice(-1).toUpperCase()
    );
}

export function kebabToCamel(str: string): string {
  return str
    .replace(
      /[-][a-z]/g,
      (group) => group.slice(-1).toUpperCase()
    );
}

export const parseIntOtherwiseZero = (str: string): number => {
  return isNaN(parseInt(str)) ? 0 : parseInt(str);
}

export const parseIntOtherwiseNull = (str: string): number | null => {
  return isNaN(parseInt(str)) ? null : parseInt(str);
}

export const parseFloatOtherwiseNull = (str: string): number | null => {
  return isNaN(parseFloat(str)) ? null : parseFloat(str);
}

export const parseBooleanOtherwiseNull = (str: string): boolean | null => {
  const num = parseIntOtherwiseNull(str);
  // TODO: Check if negative values can be the case and how they work
  if (num !== null) return num > 0 ? true : false;
  else return null;
}