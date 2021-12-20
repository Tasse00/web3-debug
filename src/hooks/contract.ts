import React from 'react';
import { getAbiKey } from '@/utils/web3';
import { AbiItem } from 'web3-utils';
import { useWeb3State } from './web3';
import { getPromiseWithAbort } from '@/utils/async';

export function useAbiDetect(abi: AbiItem[], address: string): CheckState[] {
  const [state, dispatch] = React.useReducer(reducer, []);
  const { getContract } = useWeb3State();
  const cancells = React.useRef<((reason: any) => void)[]>([]);

  React.useEffect(() => {
    for (let cancel of cancells.current) {
      cancel('reset');
    }
    cancells.current = [];

    dispatch({
      type: 'RESET_ABI',
      payload: abi,
    });

    for (let item of abi.filter((a) => a.type === 'function')) {
      const { abort } = getPromiseWithAbort(
        (async () => {
          try {
            const contract = getContract([item], address);

            // const options: Record<string, string> = {};

            const options = (item.inputs || []).map((ipt) => {
              return {
                uint256: '0',
                address: '0x0000000000000000000000000000000000000001',
                bytes: '0x00',
                bytes4: '0x00',
              }[ipt.type];
            });
            // console.log(options);

            const result = await contract.methods[item.name || ''](
              ...options,
            ).call();

            dispatch({
              type: 'UPDATE_CHECK_STATE',
              payload: {
                abiKey: getAbiKey(item),
                status: 'existed',
              },
            });
          } catch (err) {
            let errStr = (err as any).message as string;
            if (
              /Provided address 0x[0-9A-Fa-f]{40} is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted./.test(
                errStr,
              ) ||
              /^Returned error: VM Exception while processing transaction: revert$/.test(
                errStr,
              ) ||
              /^Returned error: execution reverted$/.test(errStr)
            ) {
              dispatch({
                type: 'UPDATE_CHECK_STATE',
                payload: {
                  abiKey: getAbiKey(item),
                  status: 'not-existed',
                },
              });
            } else if (
              // /Invalid number of parameters for "[a-zA-Z0-9]+". Got [0-9]+ expected [0-9]+!/.test(
              //   errStr,
              // ) ||
              /^Returned error: VM Exception while processing transaction: revert .+$/.test(
                errStr,
              ) ||
              /^Returned error: execution reverted: .+$/.test(errStr)
            ) {
              dispatch({
                type: 'UPDATE_CHECK_STATE',
                payload: {
                  abiKey: getAbiKey(item),
                  status: 'existed',
                },
              });
            } else {
              console.log(errStr);
              console.log('unknown');
            }
          }
        })(),
      );
      cancells.current.push(abort);
    }
  }, [abi, address, getContract]);

  return state;
}

export interface CheckState {
  status: 'checking' | 'existed' | 'not-existed' | 'failed';
  abi: AbiItem;
}

interface ActResetAbi {
  type: 'RESET_ABI';
  payload: AbiItem[];
}

interface ActUpdateCheckState {
  type: 'UPDATE_CHECK_STATE';
  payload: {
    abiKey: string;
    status: CheckState['status'];
  };
}

type Action = ActResetAbi | ActUpdateCheckState;

function reducer(state: CheckState[], action: Action): CheckState[] {
  switch (action.type) {
    case 'RESET_ABI':
      return action.payload
        .filter((abi) => abi.type === 'function')
        .map((abi) => ({
          abi,
          status: 'checking',
        }));

    case 'UPDATE_CHECK_STATE': {
      const idx = state.findIndex(
        (cs) => getAbiKey(cs.abi) === action.payload.abiKey,
      );
      if (idx > -1) {
        state[idx] = { ...state[idx], status: action.payload.status };
      }
      return [...state];
    }

    default:
      return state;
  }
}
