// fixed Top & Side
// scroll in Content
import React from 'react';
import styles from '@/theme.less';
const TopSideContent: React.FC<{
  style?: React.CSSProperties;
  sidePosition?: 'left' | 'right';
  panelStyle?: React.CSSProperties;
  top?: React.ReactElement | false | React.ReactNode;
  side?: React.ReactElement | false | React.ReactNode;
  content?: React.ReactElement | false | React.ReactNode;
}> = ({ top, side, content, style, sidePosition = 'left', panelStyle }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      <div className={styles.panel} style={panelStyle}>{!!top ? top : undefined}</div>
      <div style={{ flex: '1 1 1px', display: 'flex', overflow: 'hidden' }}>
        {sidePosition === 'left' && (
          <div className={styles.panel} style={panelStyle}>{!!side ? side : undefined}</div>
        )}
        <div
          className={styles.panel}
          style={{ flex: '1 1 1px', overflow: 'auto', ...panelStyle }}
        >
          {!!content ? content : undefined}
        </div>
        {sidePosition === 'right' && (
          <div className={styles.panel} style={panelStyle}>{!!side ? side : undefined}</div>
        )}
      </div>
    </div>
  );
};

export default TopSideContent;
