import ReactDOM from 'react-dom/client';
import {
  initSentry,
  initTelegramFunctionality,
  normalizeCurrentUrl,
} from 'shared/lib';

import 'vite/modulepreload-polyfill';

import App from './app/App.tsx';

import './main.css';

initSentry();
initTelegramFunctionality();
normalizeCurrentUrl();

// Для фиксов отображения с клавиатурой
if ('virtualKeyboard' in navigator && navigator.virtualKeyboard) {
  (navigator.virtualKeyboard as any).overlaysContent = true;
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
