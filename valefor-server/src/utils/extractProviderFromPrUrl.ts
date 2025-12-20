export function extractProviderFromPrUrl(prUrl: string): string {
  const prUrlObj = new URL(prUrl);

  const host = prUrlObj.host;
  const hostSplitted = host.split('.');

  return hostSplitted[0];
}
