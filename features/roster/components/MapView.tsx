'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Star, MapPin, Phone, Mail, CheckCircle, Crosshair } from 'lucide-react';
import type { StaffProfile } from '@/types/marketplace';

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom marker icons with booking status colors
const createCustomIcon = (isActive: boolean, isSelected: boolean, bookingStatus?: string | null) => {
  // Determine color based on booking status
  let color = '#10b981'; // Default green-500 for available
  if (bookingStatus === 'pending') {
    color = '#f59e0b'; // amber-500
  } else if (bookingStatus === 'accepted') {
    color = '#3b82f6'; // blue-500
  } else if (bookingStatus === 'declined') {
    color = '#ef4444'; // red-500
  } else if (!isActive) {
    color = '#6b7280'; // gray-500
  }

  const size = isSelected ? 48 : 40;
  const borderColor = isSelected ? '#0d9488' : '#ffffff';
  const borderWidth = isSelected ? 4 : 2;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: ${borderWidth}px solid ${borderColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        ${
          isActive
            ? `<div style="
          position: absolute;
          top: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border: 2px solid white;
          border-radius: 50%;
        "></div>`
            : ''
        }
      </div>
    `,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Create user location marker
const createUserIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #0ea5e9;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: pulse 2s infinite;
      ">
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2); }
          50% { box-shadow: 0 0 0 8px rgba(14, 165, 233, 0.1), 0 4px 12px rgba(0, 0, 0, 0.2); }
        }
      </style>
    `,
    className: 'user-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Component to recenter map when user location changes
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Component for recenter button
function RecenterButton({ center }: { center: [number, number] | null }) {
  const map = useMap();

  const handleRecenter = () => {
    if (center) {
      map.setView(center, 13, { animate: true });
    }
  };

  if (!center) return null;

  return (
    <button
      onClick={handleRecenter}
      className="leaflet-control-zoom-in"
      style={{
        position: 'absolute',
        top: '120px',
        right: '10px',
        zIndex: 1000,
        width: '30px',
        height: '30px',
        backgroundColor: 'white',
        border: '2px solid rgba(0,0,0,0.2)',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
      }}
      title="Re-center map"
    >
      <Crosshair className="w-4 h-4 text-gray-700" />
    </button>
  );
}

interface MapViewProps {
  staff: (StaffProfile & { distance?: number })[];
  userLocation: { lat: number; lng: number } | null;
  selectedStaff: StaffProfile | null;
  onSelectStaff: (staff: StaffProfile) => void;
}

export default function MapView({ staff, userLocation, selectedStaff, onSelectStaff }: MapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.5074, -0.1278]); // Default to London
  const [mapZoom, setMapZoom] = useState(12);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before rendering map
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(12);
    } else if (staff.length > 0 && staff[0].location?.coordinates) {
      // Default to first staff member's location
      setMapCenter([staff[0].location.coordinates.lat, staff[0].location.coordinates.lng]);
    }
  }, [userLocation, staff]);

  // Show loading state until mounted
  if (!isMounted) {
    return (
      <div className="relative h-full w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={10}
        maxZoom={16}
        style={{ height: '100%', width: '100%', background: '#e0f2fe' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <RecenterMap center={mapCenter} />
        <RecenterButton center={userLocation} />

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
            <Popup>
              <div className="p-2">
                <p className="font-semibold text-blue-600">Your Location</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Journey Line - Uber Style with outline effect */}
        {selectedStaff && userLocation && selectedStaff.location?.coordinates && (
          <>
            {/* Outer darker line for depth */}
            <Polyline
              positions={[
                [userLocation.lat, userLocation.lng],
                [selectedStaff.location.coordinates.lat, selectedStaff.location.coordinates.lng]
              ]}
              pathOptions={{
                color: '#0f766e',
                weight: 6,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Inner main line */}
            <Polyline
              positions={[
                [userLocation.lat, userLocation.lng],
                [selectedStaff.location.coordinates.lat, selectedStaff.location.coordinates.lng]
              ]}
              pathOptions={{
                color: '#14b8a6',
                weight: 3,
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </>
        )}

        {/* Staff Markers */}
        {staff.map((person) => {
          if (!person.location?.coordinates) return null;

          const isSelected = selectedStaff?.id === person.id;
          const bookingStatus = (person as any).bookingStatus || null;

          return (
            <Marker
              key={person.id}
              position={[person.location.coordinates.lat, person.location.coordinates.lng]}
              icon={createCustomIcon(person.isActive, isSelected, bookingStatus)}
              eventHandlers={{
                click: () => {
                  onSelectStaff(person);
                },
              }}
            >
              <Popup>
                <div className="p-3 min-w-[280px]">
                  {/* Profile Header */}
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                        {person.firstName?.[0] || ''}
                        {person.lastName?.[0] || ''}
                      </div>
                      {person.isActive && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="font-bold text-gray-900 text-base">
                          {person.firstName || ''} {person.lastName || ''}
                        </h3>
                        {person.verified && (
                          <CheckCircle className="w-4 h-4 text-teal-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{person.role}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-3 pb-3 border-b border-gray-200">
                    <div className="flex items-center space-x-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">
                        {person.performance?.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {person.yearsExperience} years exp
                    </span>
                    <span className="text-xs font-medium text-gray-700">{person.band}</span>
                  </div>

                  {/* Location */}
                  <div className="mb-3">
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium text-gray-900">{person.currentTrust}</p>
                        <p className="text-gray-500">{person.currentDepartment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Distance Badge */}
                  {person.distance !== undefined && (
                    <div className="mb-3">
                      <div className="inline-flex items-center px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                        <MapPin className="w-3 h-3 mr-1" />
                        {person.distance.toFixed(1)} km away
                      </div>
                    </div>
                  )}

                  {/* Specialties */}
                  {person.availability?.preferredSpecialties &&
                    person.availability.preferredSpecialties.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {person.availability.preferredSpecialties.slice(0, 2).map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 rounded text-xs"
                            >
                              {specialty}
                            </span>
                          ))}
                          {person.availability.preferredSpecialties.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{person.availability.preferredSpecialties.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Quick Contact */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-gray-600 text-xs">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="truncate">{person.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-xs">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{person.phone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStaff(person);
                      }}
                      className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                    >
                      View Full Profile
                    </button>
                  </div>

                  {/* Availability Status */}
                  {person.isActive && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center space-x-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Available Now</span>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Available Staff Counter - Upper Right - DESKTOP ONLY */}
      <div className="hidden md:block absolute top-6 right-6 bg-green-50 rounded-xl shadow-2xl border border-green-200 p-4 z-[1000]">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-700">{staff.length}</div>
          <div className="text-xs text-green-600 font-medium mt-1">Available Staff</div>
        </div>
      </div>

      {/* Distance Badge - Uber Style */}
      {selectedStaff && selectedStaff.distance !== undefined && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-2xl border-2 border-teal-500 px-6 py-3 z-[1000]">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{selectedStaff.distance.toFixed(1)} km</div>
              <div className="text-xs text-gray-600 font-medium">Distance to staff</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
