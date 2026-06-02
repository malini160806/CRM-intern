import React, { memo, useState, useEffect, useMemo } from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography, 
  Marker, 
  ZoomableGroup 
} from 'react-simple-maps';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const REGIONS = [
  { name: "San Francisco", coordinates: [-122.4194, 37.7749] },
  { name: "New York", coordinates: [-74.006, 40.7128] },
  { name: "London", coordinates: [-0.1276, 51.5072] },
  { name: "Singapore", coordinates: [103.8198, 1.3521] },
  { name: "Sydney", coordinates: [151.2093, -33.8688] },
  { name: "Tokyo", coordinates: [139.6917, 35.6895] },
];

const MapChart = memo(({ markers }) => {
  return (
    <ComposableMap 
      projection="geoMercator" 
      projectionConfig={{ scale: 120 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ZoomableGroup center={[0, 20]} zoom={1.2}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1e293b" // slate-800
                stroke="#334155" // slate-700
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "#334155", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map(({ name, coordinates, markerOffset, type }) => {
          let color = '#3b82f6'; // blue-500
          if (type === 'hot') color = '#ef4444'; // red-500
          if (type === 'warm') color = '#f59e0b'; // amber-500

          return (
            <Marker key={name} coordinates={coordinates}>
              <motion.circle 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                r={12} 
                fill={color} 
                className="mix-blend-screen pointer-events-none"
              />
              <circle r={4} fill={color} stroke="#fff" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={{ fontFamily: "Inter, sans-serif", fontSize: "8px", fill: "#94a3b8", fontWeight: 700 }}
              >
                {name}
              </text>
            </Marker>
          );
        })}
      </ZoomableGroup>
    </ComposableMap>
  );
});

const CommandCenter = () => {
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [dealsRes, leadsRes] = await Promise.all([
          axios.get('/api/deals', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/leads', { headers }).catch(() => ({ data: [] }))
        ]);
        
        setDeals(dealsRes.data);
        setLeads(leadsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    
    // Auto-refresh every 30 seconds to simulate "Live Sync"
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Compute Total Pipeline
  const totalPipeline = useMemo(() => {
    return deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [deals]);

  // Distribute Deals across Regions
  const markers = useMemo(() => {
    if (deals.length === 0) return [];

    return REGIONS.map((region, index) => {
      const regionDeals = deals.filter(d => {
        const charCode = d._id ? d._id.charCodeAt(d._id.length - 1) : 0;
        return charCode % 6 === index;
      });

      const value = regionDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
      
      let type = 'cold';
      if (value > 10000) type = 'warm';
      if (value > 50000) type = 'hot';

      return {
        ...region,
        markerOffset: index % 2 === 0 ? -15 : 15,
        value,
        type,
        count: regionDeals.length
      };
    }).filter(marker => marker.value > 0 || marker.count > 0); // Only show regions with activity
  }, [deals]);

  // Active Agents Count
  const activeAgentsCount = useMemo(() => {
    const owners = new Set();
    deals.forEach(d => { if (d.owner) owners.add(d.owner._id || d.owner); });
    leads.forEach(l => { if (l.assignedTo) owners.add(l.assignedTo._id || l.assignedTo); });
    return Math.max(owners.size, 1); // at least 1 (the current user)
  }, [deals, leads]);

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-500 mb-1">
            <Globe className="w-5 h-5" />
            <h3 className="text-xs font-black uppercase tracking-widest">Global Operations</h3>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Command Center</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-full border border-red-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest">
              {loading ? 'Syncing...' : 'Live Sync Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Left Stats Panel */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all"></div>
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2 relative z-10 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" /> Total Pipeline
            </h4>
            <p className="text-4xl font-black text-white relative z-10">
              ${(totalPipeline / 1000).toFixed(1)}k
            </p>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-bold relative z-10">
              <TrendingUp className="w-4 h-4" /> Real-time aggregate
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Regional Activity
            </h4>
            <div className="space-y-4">
              {markers.length === 0 ? (
                <div className="text-slate-500 text-sm font-medium text-center py-4">No active deals globally.</div>
              ) : (
                markers.sort((a,b) => b.value - a.value).map((marker, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${marker.type === 'hot' ? 'bg-red-500' : marker.type === 'warm' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                      <span className="text-sm font-bold text-slate-300">{marker.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white">${(marker.value / 1000).toFixed(1)}k</span>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl">
            <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Active Agents
            </h4>
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(activeAgentsCount, 5) }).map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-400">
                  A{i + 1}
                </div>
              ))}
              {activeAgentsCount > 5 && (
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white">
                  +{activeAgentsCount - 5}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="lg:col-span-3 bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-6 left-6 z-10">
            <h3 className="text-white font-black text-xl tracking-tight drop-shadow-md">Live Global Leads</h3>
            <p className="text-slate-400 text-sm font-bold mt-1">Interactive 2D Projection</p>
          </div>
          
          <div className="absolute bottom-6 right-6 z-10 flex gap-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-xl border border-slate-800">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
               <span className="text-xs font-bold text-slate-300">Hot (&gt; $50k)</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
               <span className="text-xs font-bold text-slate-300">Warm</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
               <span className="text-xs font-bold text-slate-300">Cold</span>
             </div>
          </div>

          <div className="flex-1 w-full relative z-0">
             <MapChart markers={markers} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandCenter;
