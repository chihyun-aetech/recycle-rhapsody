import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start MSW
async function startApp() {
  // MSW는 개발환경 또는 VITE_ENABLE_MSW가 'true'일 때 활성화
  if (import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('MSW activated for mocking API calls');
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

startApp();
