import { useCachedState } from '@/hooks/cache';
import React from 'react';
import { Card, AutoComplete } from 'antd';
import AutoCompleteWithCache from '@/components/Input/AutoCompleteWithCache';
import AddressCode from '@/components/Web3/AddressCode';
// View Block

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
      {address && (
        <>
          <div>{address}</div>
          <AddressCode address={address} />
        </>
      )}
    </Card>
  );
};

export default DetectContract;
