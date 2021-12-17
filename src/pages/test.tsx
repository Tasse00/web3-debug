import React from 'react';
import styles from '@/theme.less';
import TopSideContent from '@/components/Layouts/TopSideContent';

const test: React.FC<{}> = (props) => {
  return (
    // <div style={{width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column'}}>
    //   <div className={styles.panel}>Top</div>
    //   <div style={{ flex: '1 1 1px', display: 'flex', overflow: 'hidden'}}>
    //     <div className={styles.panel}>Side</div>
    //     <div className={styles.panel} style={{flex: '1 1 1px', overflow: 'auto'}}>
    //       Content
    //       <div style={{height: 1200}}>g</div>
    //     </div>
    //   </div>
    // </div>
    <TopSideContent
      style={{ width: '100vw', height: '100vh' }}
      top={<div>top</div>}
      side={<div>side</div>}
      content={
        <TopSideContent 
          style={{ width: '100%', height: '100%' }}
          top={<div>Inner Top</div>}
          side={<div>Inner Side</div>}
          sidePosition='right'
          content={<div style={{height: 4000}}>123</div>}
        />
      }
    />
  );
};

export default test;
