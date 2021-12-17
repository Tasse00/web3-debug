import React from 'react';
import { useContract, useContractCall, useAccount, useContractDebug } from '@/hooks/web3';
import { Row, Col, Statistic, Card } from 'antd';
const ERC721Info: React.FC = () => {

  const { address, abi } = useContractDebug();

  const account = useAccount();

  const contract = useContract(abi, address);

  const { data: totalSupply } = useContractCall<string>({
    contract,
    method: 'totalSupply',
  });

  const { data: name } = useContractCall<string>({ contract, method: 'name' });
  const { data: symbol } = useContractCall<string>({
    contract,
    method: 'symbol',
  });
  const { data: myNfts } = useContractCall<string>({
    contract,
    method: 'balanceOf',
    args: [account],
  });


  return (
    <Row gutter={16}>
      <Col>
        <Card size="small">
          <Statistic title="Name" value={name || '--'} />
        </Card>
      </Col>
      <Col>
        <Card size="small">
          <Statistic title="Symbol" value={symbol || '--'} />
        </Card>
      </Col>
      <Col>
        <Card size="small">
          <Statistic
            title="Total Supply"
            value={totalSupply || '--'}
            suffix={(totalSupply || 0) > 1 ? 'NFTs' : 'NFT'}
          />
        </Card>
      </Col>
      <Col>
        <Card size="small">
          <Statistic
            title="My Nfts"
            value={myNfts || '--'}
            suffix={(myNfts || 0) > 1 ? 'NFTs' : 'NFT'}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default ERC721Info;