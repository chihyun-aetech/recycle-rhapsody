import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Start MSW
async function startApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
    });
  }

  createRoot(document.getElementById("root")!).render(<App />);
}

startApp();
