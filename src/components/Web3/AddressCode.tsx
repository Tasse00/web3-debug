import { useAddressCode, useWeb3State } from '@/hooks/web3';
import React from 'react';
import { Input, Tag } from 'antd';
import { AbiItem } from 'web3-utils';
import { getPromiseWithAbort } from '@/utils/async';
import ABIs from '@/abis';
import { formatAbi, getAbiKey } from '@/utils/web3';

const abi = [
  // ...ABIs.ERC721Enumerable,
  {
    inputs: [],
    name: 'purchase',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'p',
        type: 'uint256',
      },
    ],
    name: 'setPrice',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const AddressCode: React.FC<{
  address: string;
}> = ({ address }) => {
  const state = useMethodDetect(abi as any, address);

  return (
    <>
      {state.map((s) => (
        <div key={getAbiKey(s.abi)} style={{ display: 'flex' }}>
          <Tag>{s.status}</Tag>
          <div>{formatAbi(s.abi)}</div>
        </div>
      ))}
    </>
  );
};

function useMethodDetect(abi: AbiItem[], address: string): CheckState[] {
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

            const result = await contract.methods[item.name || '']().call();

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
              )
            ) {
              dispatch({
                type: 'UPDATE_CHECK_STATE',
                payload: {
                  abiKey: getAbiKey(item),
                  status: 'not-existed',
                },
              });
            } else if (
              /Invalid number of parameters for "[a-zA-Z0-9]+". Got [0-9]+ expected [0-9]+!/.test(
                errStr,
              )
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

interface CheckState {
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
// interface ActStartChecking {
//   type: 'START_CHECKING';
//   payload: string[];
// }

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

    // case 'START_CHECKING':
    //   for (let method of action.payload) {
    //     const idx = state.findIndex((cs) => cs.abi.name === method);
    //     if (idx > -1) {
    //       state[idx] = { ...state[idx], status: 'checking' };
    //     }
    //   }
    //   return [...state];

    default:
      return state;
  }
}

export default AddressCode;
