import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// FIXED version — no _getIconUrl error
L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl: icon2x,
  shadowUrl
});

createRoot(document.getElementById("root")!).render(<App />);
