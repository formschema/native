export const Pattern = Object.freeze({
  /**
   * Escape a pattern for a Regex
   * @param str String to escape
   * @returns boolean The excaped string
   * @see https://stackoverflow.com/a/6969486
   */
  escape(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
});
