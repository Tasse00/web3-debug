import React from 'react';
import {
  Web3ConnectContext,
  Web3ConnectState,
} from '@/providers/Web3ConnectProvider';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import useRequest from '@ahooksjs/use-request';
import { BaseOptions } from '@ahooksjs/use-request/lib/types';
import { Web3Context, Web3State } from '@/providers/Web3Provider';
import { ContractDebugContext } from '@/providers/ContractDebugProvider';

export function useWeb3Control(): Web3ConnectState {
  return React.useContext(Web3ConnectContext);
}

export function useWeb3State(): Web3State {
  return React.useContext(Web3Context);
}

export function useAccounts(): string[] {
  return useWeb3State().accounts;
}

export function useAccount(): string {
  return useWeb3State().account;
}

export function useContract(abi: AbiItem[], address: string): Contract {
  const { getWeb3 } = useWeb3State();

  return React.useMemo(
    () => new (getWeb3().eth.Contract)(abi, address),
    [getWeb3, address, abi],
  );
}

export function useContractCall<T, P extends any[] = any>({
  contract,
  method,
  args = new Array<any>() as P,
  options,
  type = 'call',
}: {
  contract: Contract | null;
  method: string;
  args?: P;
  options?: BaseOptions<T, P>;
  type?: 'call' | 'query';
}) {
  return useRequest<T>(
    async () => {
      if (contract) {
        const mth = contract.methods[method](...args);
        const result = await (type == 'call' ? mth.call : mth.send)();
        if (result instanceof Array) {
          return result;
        } else {
          return [result];
        }
      } else {
        return null;
      }
    },
    { ...options, refreshDeps: [contract, method, type, ...args] },
  );
}

export function useContractDebug() {
  return React.useContext(ContractDebugContext);
}

export function useAddressCode(address: string) {
  const { getWeb3 } = useWeb3State();
  return useRequest(
    async () => {
      return await getWeb3().eth.getCode(address);
    },
    {
      refreshDeps: [getWeb3, address],
    },
  );
}
