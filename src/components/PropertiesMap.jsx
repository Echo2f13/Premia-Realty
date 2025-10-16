import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Bed, Bath, MapPin, Sun, Moon } from "lucide-react";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom red marker icon with gold border
const redIcon = new L.Icon({
  iconUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'%3E%3Cpath fill='%23ef4444' stroke='%23d4af37' stroke-width='2' d='M12.5 0C5.6 0 0 5.6 0 12.5c0 8.5 12.5 28.5 12.5 28.5S25 21 25 12.5C25 5.6 19.4 0 12.5 0zm0 17.5c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z'/%3E%3C/svg%3E",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component to lock map bounds to Bahrain and apply custom styling
const BahrainBoundsLock = ({ isDarkTheme }) => {
  const map = useMap();

  useEffect(() => {
    // Bahrain coordinates (approximate bounds)
    const bahrainBounds = L.latLngBounds(
      [25.55, 50.35], // Southwest
      [26.35, 50.85]  // Northeast
    );

    // Set initial view
    map.fitBounds(bahrainBounds);

    // Lock the bounds - user can zoom but cannot pan outside Bahrain
    map.setMaxBounds(bahrainBounds);
    map.on('drag', function() {
      map.panInsideBounds(bahrainBounds, { animate: false });
    });

    // Set zoom limits
    map.setMinZoom(10);  // Prevents zooming too far out
    map.setMaxZoom(18);  // Allows close-up zoom

  }, [map]);

  // Apply subtle dark styling to map container
  useEffect(() => {
    const container = map.getContainer();
    if (isDarkTheme) {
      container.style.filter = 'brightness(0.9) contrast(1.1)';
    } else {
      container.style.filter = 'none';
    }
  }, [map, isDarkTheme]);

  return null;
};

const PropertiesMap = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesCollection = collection(db, "properties");
        const q = query(propertiesCollection, where("deletedAt", "==", null));
        const snapshot = await getDocs(q);

        const propertiesData = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter(property =>
            property.location?.lat &&
            property.location?.lng &&
            !property.deletedAt
          );

        setProperties(propertiesData);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMarkerMouseEnter = (property) => {
    setHoveredProperty(property);
  };

  const handleMarkerMouseLeave = () => {
    setHoveredProperty(null);
  };

  const formatPrice = (price, cadence) => {
    if (!price) return "Contact for price";
    const formatted = new Intl.NumberFormat("en-US").format(price);
    return cadence ? `${formatted} BHD/${cadence}` : `${formatted} BHD`;
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Map tile URLs - using dark CARTO for dark theme
  const tileLayerUrl = isDarkTheme
    ? "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const labelLayerUrl = isDarkTheme
    ? "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
    : null;

  const tileLayerAttribution = isDarkTheme
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  // Bahrain center coordinates
  const bahrainCenter = [26.0667, 50.5577];

  return (
    <section
      className="relative isolate overflow-hidden py-20 bg-background"
      onMouseMove={handleMouseMove}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/50 to-background" />
        <div className="absolute left-0 top-1/3 h-96 w-96 -translate-x-1/3 rounded-full bg-gold-primary/10 blur-[160px]" />
        <div className="absolute right-0 bottom-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/10 blur-[160px]" />
      </div>

      <div className="relative container px-4 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-serif font-bold text-platinum-pearl lg:text-5xl">
            Explore Properties in Bahrain
          </h2>
          <p className="mt-4 text-platinum-pearl/70 max-w-2xl mx-auto">
            Discover premium real estate locations across the Kingdom of Bahrain
          </p>
        </div>

        {/* Map Container with Gold Border */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-500"
          style={{
            height: "600px",
            borderColor: isDarkTheme ? 'rgba(212, 175, 55, 0.3)' : 'rgba(212, 175, 55, 0.1)',
            boxShadow: isDarkTheme
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.15)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="absolute top-4 right-4 z-[1000] bg-gradient-to-br from-background/95 to-luxury-black/95 backdrop-blur-sm border-2 border-gold-primary/30 rounded-full p-3 shadow-xl transition-all hover:border-gold-primary/60 hover:scale-110 hover:shadow-2xl"
            style={{
              boxShadow: '0 10px 25px rgba(212, 175, 55, 0.2), 0 0 20px rgba(212, 175, 55, 0.1)'
            }}
            title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDarkTheme ? (
              <Sun className="h-5 w-5 text-gold-primary drop-shadow-lg" />
            ) : (
              <Moon className="h-5 w-5 text-gold-primary drop-shadow-lg" />
            )}
          </button>

          {loading ? (
            <div className="flex items-center justify-center h-full bg-background-dark">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin"></div>
                <div className="text-gold-primary font-semibold">Loading map...</div>
              </div>
            </div>
          ) : (
            <MapContainer
              center={bahrainCenter}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
              scrollWheelZoom={true}
              key={isDarkTheme ? 'dark' : 'light'}
            >
              {/* Base map layer */}
              <TileLayer
                attribution={tileLayerAttribution}
                url={tileLayerUrl}
                className={isDarkTheme ? 'dark-theme-tiles' : ''}
              />

              {/* Labels layer for dark theme */}
              {isDarkTheme && labelLayerUrl && (
                <TileLayer
                  url={labelLayerUrl}
                  pane="shadowPane"
                />
              )}

              <BahrainBoundsLock isDarkTheme={isDarkTheme} />

              <MarkerClusterGroup
                chunkedLoading
                maxClusterRadius={60}
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                iconCreateFunction={(cluster) => {
                  const count = cluster.getChildCount();
                  return L.divIcon({
                    html: `<div style="
                      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                      color: #ffffff;
                      border-radius: 50%;
                      width: 45px;
                      height: 45px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-weight: bold;
                      font-size: 15px;
                      border: 3px solid #d4af37;
                      box-shadow: 0 4px 20px rgba(212, 175, 55, 0.4), 0 0 30px rgba(239, 68, 68, 0.3);
                    ">${count}</div>`,
                    className: "",
                    iconSize: L.point(45, 45),
                  });
                }}
              >
                {properties.map((property) => (
                  <Marker
                    key={property.id}
                    position={[property.location.lat, property.location.lng]}
                    icon={redIcon}
                    eventHandlers={{
                      mouseover: () => handleMarkerMouseEnter(property),
                      mouseout: handleMarkerMouseLeave,
                    }}
                  />
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>

        {/* Attribution */}
        <div className="mt-4 text-center text-xs text-platinum-pearl/50">
          {isDarkTheme ? (
            <>Map data © OpenStreetMap contributors • Dark theme by CARTO</>
          ) : (
            <>Map data © OpenStreetMap contributors</>
          )}
        </div>
      </div>

      {/* Custom CSS for dark theme styling */}
      <style>{`
        .dark-theme-tiles {
          filter: brightness(0.95) contrast(1.05);
        }

        .leaflet-control-zoom a {
          background: rgba(18, 18, 24, 0.95) !important;
          border: 2px solid rgba(212, 175, 55, 0.3) !important;
          color: #d4af37 !important;
          transition: all 0.3s ease !important;
          backdrop-filter: blur(10px);
        }

        .leaflet-control-zoom a:hover {
          background: rgba(212, 175, 55, 0.1) !important;
          border-color: rgba(212, 175, 55, 0.6) !important;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.3) !important;
        }

        .leaflet-bar {
          border: none !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.2) !important;
        }

        ${isDarkTheme ? `
          .leaflet-container {
            background: #0b0b10 !important;
          }
        ` : ''}
      `}</style>

      {/* Cursor-Following Hover Card with Smooth Transition */}
      <div
        className={`fixed z-[9999] pointer-events-none transition-all duration-300 ease-out ${
          hoveredProperty ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          left: `${mousePosition.x + 20}px`,
          top: `${mousePosition.y + 20}px`,
          transform: "translate(0, -50%)",
        }}
      >
        {hoveredProperty && (
          <div
            className="bg-gradient-to-br from-background via-luxury-black to-background-dark rounded-xl overflow-hidden w-80 transition-all duration-300 border-2"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.2)',
              borderColor: 'rgba(212, 175, 55, 0.3)'
            }}
          >
            {/* Property Image */}
            {hoveredProperty.images && hoveredProperty.images[0] && (
              <div className="relative h-40 overflow-hidden">
                <img
                  src={hoveredProperty.images[0]}
                  alt={hoveredProperty.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                {hoveredProperty.inclusive && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-gold-primary to-[#f5d37f] text-background px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                    Inclusive
                  </div>
                )}
              </div>
            )}

            {/* Property Details */}
            <div className="p-4">
              <h3 className="text-platinum-pearl font-bold text-base mb-2 line-clamp-2">
                {hoveredProperty.title}
              </h3>

              <div className="flex items-center gap-1 mb-3">
                <span className="text-gold-primary text-xl font-bold bg-gold-primary/10 px-3 py-1 rounded-lg border border-gold-primary/20">
                  {formatPrice(hoveredProperty.price, hoveredProperty.priceCadence)}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-platinum-pearl/70 text-xs mb-3 bg-platinum-pearl/5 rounded-lg px-3 py-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gold-primary" />
                <span className="line-clamp-1">
                  {[
                    hoveredProperty.area,
                    hoveredProperty.city,
                    hoveredProperty.governorate
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              {/* Bed/Bath */}
              <div className="flex items-center gap-4 text-platinum-pearl/70 text-sm">
                {hoveredProperty.bedrooms && (
                  <div className="flex items-center gap-2 bg-platinum-pearl/5 rounded-lg px-3 py-1.5">
                    <Bed className="h-4 w-4 text-gold-primary" />
                    <span>{hoveredProperty.bedrooms} Bed</span>
                  </div>
                )}
                {hoveredProperty.bathrooms && (
                  <div className="flex items-center gap-2 bg-platinum-pearl/5 rounded-lg px-3 py-1.5">
                    <Bath className="h-4 w-4 text-gold-primary" />
                    <span>{hoveredProperty.bathrooms} Bath</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertiesMap;
