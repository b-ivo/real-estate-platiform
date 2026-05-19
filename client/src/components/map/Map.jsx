import "./map.scss"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Pin from "../pin/Pin" 
import MarkerClusterGroup from "react-leaflet-cluster"

function Map({items}) {
  const center = items.length > 0 
    ? [items[0].latitude, items[0].longitude] 
    : [51.505, -0.09];

  return (
    <MapContainer 
      center={center} 
      zoom={items.length === 1 ? 12 : 6} 
      scrollWheelZoom={false} 
      className="map"
    >
        <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
            {items.map(item =>(
                <Pin key={item.id} item={item}/>
            ))}
        </MarkerClusterGroup>
    </MapContainer>
  )
}

export default Map