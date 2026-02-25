import { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";

export default function MOLDOVAlayer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ✅ async function inside useEffect
    async function loadGeoJSON() {
      try {
        const res = await fetch("./data/MOLDOVA.geojson");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load GeoJSON:", err);
      }
    }

    loadGeoJSON(); // call the async function
  }, []);

  if (!data) return null;

  const styleFeature = (feature) => ({
    color: "#ff9151",
    weight: 2,
    fillColor: "#ff7700",
    fillOpacity: 0.1,
    dashArray: "3",
  });

  const onEachFeature = (feature, layer) => {
    layer.bindPopup(
      `<b>${feature.properties.name || "No name"}</b><br>
       ${feature.properties.addr_street || ""} ${feature.properties.addr_housenumber || ""}`
    );

    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: 4,
          color: "#1000ba",
          fillOpacity: 0.2,
        });
      },
      mouseout: (e) => {
        e.target.setStyle(styleFeature(feature));
      },
    });
  };

  return <GeoJSON data={data} style={styleFeature} onEachFeature={onEachFeature} />;
}