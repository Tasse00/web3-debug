import { useWeb3Control } from '@/hooks/web3';
import React from 'react';
import styles from '@/theme.less';
import { Button, Card, Tag } from 'antd';
import Connect from '@/components/Connect/Connect';
import Wallet from '@/components/Wallet/Wallet';
// import { useHistory } from 'umi';
// import {
//   LeftOutlined,
//   PropertySafetyFilled,
//   RightOutlined,
// } from '@ant-design/icons';
import TopSideContent from '@/components/Layouts/TopSideContent';
import Web3Provider from '@/providers/Web3Provider';
import Notebook from '@/components/Notebook/Notebook';

interface Props {}

const MainLayout: React.FC<Props> = ({ children }) => {
  const { web3, providerType, disconnect, state } = useWeb3Control();

  // const his = useHistory();

  const inner = (
    <>
      <TopSideContent
        style={{ width: '100vw', height: '100vh' }}
        top={
          web3 &&
          providerType && (
            <div className={styles.panel} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {/* Debug */}
                  {/* <Button.Group>
                  <Button
                    icon={<LeftOutlined />}
                    disabled={his.length <= 0}
                    onClick={his.goBack}
                  />
                  <Button icon={<RightOutlined />} onClick={his.goForward} />
                </Button.Group> */}
                </div>
                <div>
                  <Tag>{providerType}</Tag>
                  <Button onClick={disconnect}>Reset</Button>
                </div>
              </div>
            </div>
          )
        }
        side={
          web3 &&
          providerType && (
            <div className={styles.panel} style={{ width: 240 }}>
              <Wallet />
            </div>
          )
        }
        content={
          state ? (
            children
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card style={{ width: 400, transition: 'all 0.3s' }}>
                <Connect />
              </Card>
            </div>
          )
        }
      />
      <Notebook />
    </>
  );

  return state ? <Web3Provider {...state}>{inner}</Web3Provider> : inner;
};

export default MainLayout;
