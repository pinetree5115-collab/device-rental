'use client';

import QueryProvider from './QueryProvider';

function Providers({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
