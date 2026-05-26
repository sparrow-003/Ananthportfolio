import { memo } from 'react';

const ThemedBackground = memo(() => (
  <div
    aria-hidden="true"
    className="fixed inset-0 pointer-events-none z-0"
    style={{ background: '#000000' }}
  />
));

export default ThemedBackground;