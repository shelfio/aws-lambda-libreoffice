export function getConvertedFilePath(logs: string): string {
  try {
    return logs.match(/\/tmp\/.+->\s(\/tmp\/.+) using/)[1];
  } catch (e) {
    const ErrorWithExtendedMessage: Error = new Error(e);
    ErrorWithExtendedMessage.message += `;\tTried to parse string: "${logs}"`;

    throw ErrorWithExtendedMessage;
  }
}
