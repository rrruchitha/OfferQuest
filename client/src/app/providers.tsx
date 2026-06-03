import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111820',
            color: '#e8edf2',
            border: '1px solid #243040',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: '"DM Sans", sans-serif',
          },
          success: {
            iconTheme: { primary: '#34d399', secondary: '#111820' },
          },
          error: {
            iconTheme: { primary: '#f87171', secondary: '#111820' },
          },
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}