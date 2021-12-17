import { Button, Card, Col, Row, Typography } from 'antd';
import styles from './index.less';
import { history } from 'umi';
export default function IndexPage() {

  return (
    <>

      <Card hoverable onClick={()=>history.push('./erc721')}>
        ERC721调试
      </Card>




    </>
  );
}
