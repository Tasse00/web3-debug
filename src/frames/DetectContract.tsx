import { useCachedState } from '@/hooks/cache';
import React from 'react';
import { Card, Tag } from 'antd';
import AutoCompleteWithCache from '@/components/Input/AutoCompleteWithCache';
import { CheckState, useAbiDetect } from '@/hooks/contract';
import { formatAbi, getAbiKey } from '@/utils/web3';
import ABIs from '@/abis';
import { unique } from '@/utils/array';
import { AbiItem } from 'web3-utils';
// View Block

const abi = [...ABIs.ERC721Enumerable, ...ABIs.ERC721, ...ABIs.ERC20];

const uniqueItems = unique(abi, getAbiKey);

const Detector: React.FC<{ address: string }> = ({ address }) => {
  const state = useAbiDetect(uniqueItems, address);

  return (
    <>
      {Object.keys(ABIs).map((name) => (
        <ERCGuess key={name} checkStates={state} name={name} abi={ABIs[name]} />
      ))}
      {/* {state.map((s) => (
        <div key={getAbiKey(s.abi)} style={{ display: 'flex' }}>
          <Tag>{s.status}</Tag>
          <div>{formatAbi(s.abi)}</div>
        </div>
      ))} */}
    </>
  );
};

const ERCGuess: React.FC<{
  checkStates: CheckState[];
  name: string;
  abi: AbiItem[];
}> = ({ checkStates, name, abi }) => {
  const abiKeys = abi.map(getAbiKey);
  const validStates = checkStates.filter((cs) =>
    abiKeys.includes(getAbiKey(cs.abi)),
  );
  const waitingNum = validStates.filter(
    (vs) => vs.status === 'checking',
  ).length;
  const existedNum = validStates.filter((vs) => vs.status === 'existed').length;
  const status = waitingNum > 0 ? 'checking' : 'done';
  const nonExistedNum = validStates.filter(
    (vs) => vs.status === 'not-existed',
  ).length;
  const detectPercent = Math.round(
    ((validStates.length - waitingNum) / validStates.length) * 100,
  );
  const correctPercent = Math.round((existedNum / validStates.length) * 100);
  return (
    <div>
      <Tag>{status}</Tag> {name} ${detectPercent}% ${correctPercent}%
    </div>
  );
};

const DetectContract: React.FC<{}> = (props) => {
  const [address, setAddress] = React.useState('');
  return (
    <Card>
      {!address && (
        <AutoCompleteWithCache
          storeKey="address"
          btnTxt="set"
          onConfirm={(v) => {
            setAddress(v);
          }}
        />
      )}
      {address && <Detector address={address} />}
    </Card>
  );
};

export default DetectContract;
