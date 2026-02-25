import { MapContainer, TileLayer } from "react-leaflet"; // Am adăugat TileLayer pentru siguranță
import LayerToggle from "./components/LayerToggle";

// FOARTE IMPORTANT: Importă CSS-ul Leaflet aici!
import "leaflet/dist/leaflet.css";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}> 
      <MapContainer
        center={[45.9432, 24.9668]}
        zoom={7}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }} // Acum 100% va funcționa pentru că părintele are 100vh
      >
        {/* Asigură-te că în LayerToggle ai un <TileLayer />. 
            Dacă nu ești sigur, adaugă-l pe acesta de test: */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayerToggle />
      </MapContainer>
    </div>
  );
}