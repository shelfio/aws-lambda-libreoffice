export function getConvertedFilePath(logs: string): string {
  return logs.match(/\/tmp\/.+->\s(\/tmp\/.+) using/)[1];
}
