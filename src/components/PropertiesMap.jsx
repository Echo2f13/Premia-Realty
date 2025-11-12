import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Bed, Bath, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations";

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

// Component to lock map bounds to Bahrain and fit to portrait container
const BahrainBoundsLock = () => {
  const map = useMap();

  useEffect(() => {
    // Bahrain administrative boundary coordinates
    const bahrainBounds = L.latLngBounds(
      [25.55, 50.35], // Southwest corner
      [26.35, 50.85]  // Northeast corner
    );

    // Invalidate size to ensure map renders correctly after any layout changes
    map.invalidateSize();

    // Fit bounds to exactly fill the portrait container
    map.fitBounds(bahrainBounds, {
      padding: [0, 0],  // No padding - fill to edges
      maxZoom: 14       // Maximum zoom level
    });

    // Lock the bounds - user can zoom but cannot pan outside Bahrain
    map.setMaxBounds(bahrainBounds);
    map.on('drag', function() {
      map.panInsideBounds(bahrainBounds, { animate: false });
    });

    // Set zoom limits
    map.setMinZoom(10);  // Prevents zooming too far out
    map.setMaxZoom(18);  // Allows close-up zoom

    // Re-invalidate size after bounds are set
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

  }, [map]);

  return null;
};

const PropertiesMap = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const formatPrice = (price, cadence) => {
    if (!price) return "Contact for price";
    const formatted = new Intl.NumberFormat("en-US").format(price);
    return cadence ? `${formatted} BHD/${cadence}` : `${formatted} BHD`;
  };

  // Map tile URL - using Stadia Maps (English labels only)
  const tileLayerUrl = "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png";
  const tileLayerAttribution = '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

  // Bahrain center coordinates
  const bahrainCenter = [26.0667, 50.5577];

  return (
    <section
      className="relative isolate overflow-hidden py-20 bg-background"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-luxury-black/50 to-background" />
        <div className="absolute left-0 top-1/3 h-96 w-96 -translate-x-1/3 rounded-full bg-gold-primary/10 blur-[160px]" />
        <div className="absolute right-0 bottom-1/3 h-96 w-96 translate-x-1/3 rounded-full bg-gold-primary/10 blur-[160px]" />
      </div>

      <div className="relative container mx-auto px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="text-accent text-xs tracking-[0.3em] mb-4">{t(translations.home.map.subtitle)}</div>
          <h2 className="text-5xl lg:text-6xl mb-6">
            {t(translations.home.map.title)}
          </h2>
          <p className="mt-4 text-foreground/60 max-w-2xl mx-auto font-light leading-relaxed">
            {t(translations.home.map.description)}
          </p>
        </div>

        {/* Map Container - Portrait (3:4 aspect ratio) - Full Screen Size */}
        <div className="flex justify-center">
          <div
            className="relative rounded-2xl overflow-hidden shadow-2xl border-2 w-full max-w-4xl lg:max-w-6xl xl:max-w-7xl"
            style={{
              aspectRatio: '6 / 4',
              borderColor: 'rgba(212, 175, 55, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >

          {loading ? (
            <div className="flex items-center justify-center h-full bg-background-dark">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-gold-primary/20 border-t-gold-primary rounded-full animate-spin"></div>
                <div className="text-gold-primary font-semibold">{t(translations.home.map.loading)}</div>
              </div>
            </div>
          ) : (
            <MapContainer
              center={bahrainCenter}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              zoomControl={true}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution={tileLayerAttribution}
                url={tileLayerUrl}
              />

              <BahrainBoundsLock />

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
                  >
                    <Popup
                      maxWidth={320}
                      minWidth={280}
                      autoPan={true}
                      autoPanPaddingTopLeft={[50, 80]}
                      autoPanPaddingBottomRight={[50, 50]}
                      keepInView={true}
                    >
                      <div className="p-2">
                        {/* Property Image */}
                        {property.images && property.images[0] && (
                          <div className="relative h-40 overflow-hidden mb-3 rounded">
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                            {property.negotiable && (
                              <div className="absolute top-2 right-2 bg-accent text-background px-2 py-1 text-xs font-bold shadow-lg tracking-wider">
                                NEGOTIABLE
                              </div>
                            )}
                          </div>
                        )}

                        {/* Property Details */}
                        <h3 className="text-foreground font-bold text-base mb-2 line-clamp-2">
                          {property.title}
                        </h3>

                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-accent text-lg font-bold">
                            {formatPrice(property.price, property.priceCadence)}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 text-foreground/70 text-xs mb-2">
                          <MapPin className="h-4 w-4 flex-shrink-0 text-accent mt-0.5" strokeWidth={1} />
                          <span className="line-clamp-2">
                            {[
                              property.area,
                              property.city,
                              property.governorate
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </span>
                        </div>

                        {/* Bed/Bath */}
                        <div className="flex items-center gap-3 text-foreground/70 text-sm mb-3">
                          {property.bedrooms && (
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4 text-accent" strokeWidth={1} />
                              <span>{property.bedrooms} Bed</span>
                            </div>
                          )}
                          {property.bathrooms && (
                            <div className="flex items-center gap-1">
                              <Bath className="h-4 w-4 text-accent" strokeWidth={1} />
                              <span>{property.bathrooms} Bath</span>
                            </div>
                          )}
                        </div>

                        {/* View Property Button */}
                        <button
                          className="w-full bg-accent text-background py-2 text-sm font-semibold tracking-wider hover:bg-accent/90 transition-colors rounded"
                          onClick={() => navigate(`/property/${property.id}`)}
                        >
                          VIEW PROPERTY
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
          </div>
        </div>


      </div>

      {/* Custom CSS for map controls and popups styling */}
      <style>{`
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.9) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          color: #333 !important;
          transition: all 0.3s ease !important;
        }

        .leaflet-control-zoom a:hover {
          background: rgba(212, 175, 55, 0.1) !important;
          border-color: rgba(212, 175, 55, 0.5) !important;
        }

        .leaflet-bar {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .leaflet-popup-content-wrapper {
          background: hsl(var(--card)) !important;
          color: hsl(var(--foreground)) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .leaflet-popup-tip {
          background: hsl(var(--card)) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
        }

        .leaflet-popup-close-button {
          color: hsl(var(--foreground)) !important;
          font-size: 20px !important;
        }

        .leaflet-popup-close-button:hover {
          color: hsl(var(--accent)) !important;
        }
      `}</style>
    </section>
  );
};

export default PropertiesMap;
