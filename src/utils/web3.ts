export function isValidPrivateKey(pk: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(pk);
}
export function isValidNodeUrl(url: string): boolean {
  return /^(http|https|ws|wss):\/\/[a-zA-Z0-9.:]+$/.test(url);
}
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}
