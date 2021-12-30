/*
 * Stolen from another project that @allejo wrote because he doesn't believe in
 * dependencies (he's just lazy).
 *
 *   MIT - https://git.io/JyyzG
 */

/**
 * Accepted data types for the `classList` function.
 *
 * @see classList
 */
export type ClassList = ([string, boolean] | boolean | string | undefined)[];

/**
 * Build a list CSS classes that is acceptable to `className`.
 *
 * @param {ClassList} classes A list of CSS classes
 *
 * @return {string}
 */
export function classList(classes: ClassList): string {
  return classes
    .map((value) => {
      if (Array.isArray(value)) {
        const [cls, shouldRender] = value;

        return shouldRender ? cls : '';
      }

      if (value === true || value === false) {
        return '';
      }

      return value;
    })
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
