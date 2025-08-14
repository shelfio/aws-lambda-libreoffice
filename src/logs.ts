export function getConvertedFilePath(logs: string): string {
  try {
    const match = logs.match(/\/tmp\/.+->\s(\/tmp\/.+) using/);

    if (!match) {
      throw new Error('No match found in logs');
    }

    return match[1];
  } catch (e) {
    const ErrorWithExtendedMessage: Error = new Error(e instanceof Error ? e.message : String(e));
    ErrorWithExtendedMessage.message += `;\tTried to parse string: "${logs}"`;

    throw ErrorWithExtendedMessage;
  }
}
