import { AbiItem } from 'web3-utils';
export function isValidPrivateKey(pk: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(pk);
}
export function isValidNodeUrl(url: string): boolean {
  return /^(http|https|ws|wss):\/\/[a-zA-Z0-9.:/]+$/.test(url);
}
export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}

export function getAbiKey(abi: AbiItem): string {
  return (
    abi.name + (abi.inputs || []).map((i) => `${i.name}|${i.type}`).join(';')
  );
}

export function formatAbi(abi: AbiItem, withReturn?: boolean): string {
  const args = (abi.inputs || [])
    .map((ipt) => `${ipt.type} ${ipt.name}`)
    .join(', ');
  if (withReturn) {
    const outputs = (abi.outputs || []).map((opt) => opt.type).join(',');
    return `${abi.name}(${args}) -> (${outputs})`;
  } else {
    return `${abi.name}(${args})`;
  }
}
