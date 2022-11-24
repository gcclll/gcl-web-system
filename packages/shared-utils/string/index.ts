/**
 * 去重 class names
 * @param className {string}
 * @param names {string[]}
 * @return {string[]}
 */
export function uniqueClassNames(
  className: string,
  ...names: string[]
): string {
  const allNames = [className, ...names].join(' ').split(' ');
  return Array.from(new Set(allNames)).join(' ');
}

export const classnames = uniqueClassNames
