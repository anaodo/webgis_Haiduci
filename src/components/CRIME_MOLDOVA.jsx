import { useEffect, useState } from "react";
import { GeoJSON, Pane } from "react-leaflet";
import L from "leaflet";

export default function CRIME_MOLDOVA() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadGeoJSON() {
      try {
        console.log("Încep încărcarea fișierului: /data/CRIME_MOLDOVA.geojson");
        const res = await fetch("./data/CRIME_MOLDOVA.geojson");
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

  const pointStyle = {
    radius: 2,
    fillColor: "#cc7722", // ocru
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    pane: "crime-moldova-pane"
  };

  const pointToLayer = (feature, latlng) => {
    const marker = L.circleMarker(latlng, pointStyle);

    const nume = feature.properties.Name || "Fără nume";
    const sigle = feature.properties["Sigle în LIST of PRIMARY SOURCES"] || "N/A";
    const source = feature.properties["Primary Source"] || "N/A";
    const address = feature.properties.Address || "Nespecificat";
    const observations = feature.properties.Observations || "N/A";
    const longitude = feature.properties.Longitude?.toFixed(6) || latlng.lng.toFixed(6);
    const latitude = feature.properties.Latitude?.toFixed(6) || latlng.lat.toFixed(6);

    const popupContent = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h3 style="margin: 0; color: #b71c1c; border-bottom: 1px solid #ccc;">
          ${nume}
        </h3>
        <div style="margin-top: 8px;">
          <b>Sigle:</b> ${sigle}<br/>
          <b>Sursă:</b> ${source}<br/>
          <b>Adresă:</b> ${address}<br/>
          <b>Observații:</b> ${observations}<br/>
          <hr/>
          <small>Coordonate: ${latitude}, ${longitude}</small>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent);

    marker.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ radius: 4, fillColor: "#996633", fillOpacity: 1 });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(pointStyle);
      }
    });

    return marker;
  };

  return (
    <Pane name="crime-moldova-pane" style={{ zIndex: 650 }}>
      <GeoJSON data={data} pointToLayer={pointToLayer} />
    </Pane>
  );
}