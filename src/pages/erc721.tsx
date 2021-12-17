import React from 'react';
import {
  Card,
  Row,
  AutoComplete,
  Button,
  Col,
  List,
  Typography,
  Tag,
} from 'antd';
import storage from '@/storage';
import { isValidAddress } from '@/utils/web3';
import { unique } from '@/utils/array';
import ABI from '@/abis/ERC721Enumerable.json';
import TopSideContent from '@/components/Layouts/TopSideContent';
import Query, {
  generateQueryOption,
  QueryOption,
} from '@/components/Query/Query';
import { AbiItem } from 'web3-utils';
import { useAccount } from '@/hooks/web3';
import ContractDebugProvider from '@/providers/ContractDebugProvider';
import MethodList from '@/components/ContractDebug/MethodList';
import QueryGroup from '@/components/ContractDebug/QueryGroup';
import ERC721Info from '@/components/ContractDebug/ERC721/ERC721Info';
const _STORE_ERC721_ADDRESS = '_store_erc721_address';

interface Props {}

const ERC721: React.FC<Props> = (props) => {
  // 设置合约地址
  // 最近使用地址 (下拉列表)
  // 方法列表(通过ABI映射)
  // 最近访问记录

  const account = useAccount();

  const [address, setAddress] = React.useState('');
  const [addressLocked, setAddressLocked] = React.useState(false);
  const [cachedAddresses, setCachedAddresses] = React.useState(() =>
    storage.get<string[]>(_STORE_ERC721_ADDRESS, []),
  );

  const [queryOptions, setQueryOptions] = React.useState<QueryOption[]>([]);

  const options = cachedAddresses
    .filter((c) => c.includes(address))
    .map((v) => ({ value: v }));

  const lockAddress = () => {
    setAddressLocked(true);
    storage.set(_STORE_ERC721_ADDRESS, unique([address, ...cachedAddresses]));
    setCachedAddresses(unique([address, ...cachedAddresses]));
  };

  const unlockAddress = () => {
    setAddressLocked(false);
  };

  const createQuery = (abi: AbiItem) => {
    setQueryOptions([
      ...queryOptions,
      {
        id: generateQueryOption(),
        from: account,
        contractAddress: address,
        abi,
      },
    ]);
  };
  const removeQuery = (id: string) => {
    const idx = queryOptions.findIndex((q) => q.id === id);
    if (idx >= 0) {
      queryOptions.splice(idx, 1);
    }
    setQueryOptions([...queryOptions]);
  };

  return (
    <ContractDebugProvider abi={ABI as any} address={address}>
      <TopSideContent
        style={{ width: '100%', height: '100%' }}
        sidePosition="right"
        top={
          <Card>
            <Row>
              <Col flex={1}>
                <AutoComplete
                  disabled={addressLocked}
                  placeholder="Contract Address"
                  options={options}
                  value={address}
                  style={{ width: '100%' }}
                  onChange={(e) => setAddress(e)}
                  onSelect={(e) => setAddress(e)}
                />
              </Col>
              <Col>
                {addressLocked ? (
                  <Button
                    style={{ width: 120 }}
                    type="default"
                    onClick={unlockAddress}
                  >
                    Reset
                  </Button>
                ) : (
                  <Button
                    style={{ width: 120 }}
                    type="primary"
                    disabled={!isValidAddress(address)}
                    onClick={lockAddress}
                  >
                    Interact
                  </Button>
                )}
              </Col>
            </Row>
          </Card>
        }
        side={
          addressLocked && (
            <Card size="small" style={{ height: '100%', overflow: 'auto' }}>
              <MethodList />
            </Card>
          )
        }
        content={
          addressLocked && (
            <TopSideContent
              style={{ width: '100%', height: '100%' }}
              top={<ERC721Info />}
              side={false}
              content={<QueryGroup />}
            />
          )
        }
      />
    </ContractDebugProvider>
  );
};

export default ERC721;
