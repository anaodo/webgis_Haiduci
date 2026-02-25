import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";

export default function TOPONIME_PADURI() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadGeoJSON() {
      try {
        console.log("Încep încărcarea fișierului: /data/TOPONIME_PADURI.geojson");
        const res = await fetch("/data/TOPONIME_PADURI.geojson");
        if (!res.ok) {
          throw new Error(`Eroare HTTP! Status: ${res.status}`);
        }
        const json = await res.json();
        console.log("Fișierul GeoJSON a fost încărcat cu succes:", json);
        setData(json);
      } catch (err) {
        console.error("EROARE la încărcarea GeoJSON:", err);
      }
    }

    loadGeoJSON();
  }, []);

  if (!data) return null;

  // Stilul markerului fucsia
  const pointStyle = {
    radius: 2,
    fillColor: "#ff00ff", // fucsia
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    pane: "toponime-paduri-pane"
  };

  // Funcția care transformă fiecare punct în marker cu popup
  const pointToLayer = (feature, latlng) => {
    const marker = L.circleMarker(latlng, pointStyle);

    // Extragem atributele
    const nume = feature.properties.Name || "Fără nume";
    const sigle = feature.properties["Sigle in LIST of PRIMARY SOURCES"] || "N/A";
    const source = feature.properties["Primary Source"] || "N/A";
    const address = feature.properties.Address || "Nespecificat";
    const longitude = feature.properties.Longitude?.toFixed(6) || latlng.lng.toFixed(6);
    const latitude = feature.properties.Latitude?.toFixed(6) || latlng.lat.toFixed(6);

    const popupContent = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h3 style="margin: 0; color: #b71c1c; border-bottom: 1px solid #ccc;">
          ${nume}
        </h3>
        <div style="margin-top: 8px;">
          <b>Sigle:</b> ${sigle}<br/>
          <b>Sursa:</b> ${source}<br/>
          <b>Adresă:</b> ${address}<br/>
          <hr/>
          <small>Coordonate: ${latitude}, ${longitude}</small>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    // Efecte mouseover și mouseout
    marker.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ radius: 10, fillColor: "#ff007f", fillOpacity: 1 });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(pointStyle);
      }
    });

    return marker;
  };

  return (
    <Pane name="toponime-paduri-pane" style={{ zIndex: 650 }}>
      <GeoJSON data={data} pointToLayer={pointToLayer} />
    </Pane>
  );
}