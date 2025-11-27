import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Globe, Mail, Download, List, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
// @ts-ignore
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet icons in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface Company {
  name: string;
  address: string;
  website: string | null;
  phone: string | null;
  rating: string | null;
  hr_emails: string[];
}

// Mock Data for Preview
const MOCK_DB: Record<string, Company[]> = {
  "Vastral": [
    {
      name: "TechnoInfonet (Maps Result)",
      address: "See Maps",
      website: "https://www.technoinfonet.com",
      phone: "+91 79 4030 7527",
      rating: "4.8(120)",
      hr_emails: ["hr@technoinfonet.com"]
    },
    {
      name: "OpenXcell (Maps Result)",
      address: "See Maps",
      website: "https://www.openxcell.com",
      phone: "+91 99988 77665",
      rating: "4.5(85)",
      hr_emails: ["jobs@openxcell.com"]
    }
  ]
};


export default function ExtensionPreview() {
  const [location, setLocation] = useState("Vastral");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Company[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!location.trim()) {
      toast({ title: "Input Required", description: "Please enter a location", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResults([]);

    // Simulate Backend Delay
    setTimeout(() => {
      // Returns mock data or generates generic ones for demo
      const data = MOCK_DB[location] || [
        {
          name: `GenTech Solutions (${location})`,
          address: `See Maps`,
          website: "https://gentech.example.com",
          phone: "+91 98765 43210",
          rating: "4.2(45)",
          hr_emails: ["hr@gentech.example.com"]
        },
        {
          name: `WebSpiders ${location}`,
          address: `See Maps`,
          website: "https://webspiders.example.com",
          phone: "+91 99887 76655",
          rating: "4.0(20)",
          hr_emails: ["careers@webspiders.example.com"]
        },
        {
          name: "TechGiant Systems",
          address: "See Maps",
          website: "https://techgiant.example.com",
          phone: "+91 79 1234 5678",
          rating: "4.3(150)",
          hr_emails: ["hr@techgiant.example.com"]
        }
      ];
      
      setResults(data);
      setLoading(false);
      toast({ title: "Maps Data Fetched", description: "Scraped Google Maps Sidebar." });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Column: Instructions */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
              Maps IT Finder 🗺️
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              This version scrapes <strong>Google Maps</strong> directly (using a local backend) to find IT companies near you.
            </p>
          </div>

          <Card className="border-blue-200 bg-blue-50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Download className="w-5 h-5" />
                New Backend Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-blue-900">
              <p>We updated the backend to use Google Maps scraping:</p>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>Update <code className="bg-white/50 px-1 rounded">server.js</code> in <code className="bg-white/50 px-1 rounded">backend-kit</code></li>
                <li>Run <code className="bg-white/50 px-1 rounded">npm start</code> (Port 3000)</li>
                <li>Reload extension in Chrome</li>
              </ol>
              <p className="text-xs mt-2 font-medium opacity-80">API: GET /api/maps?location=...</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Preview */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20"></div>
          <div className="relative bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden h-[650px] flex flex-col w-[380px] mx-auto">
            
            {/* Chrome Popup Header */}
            <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center justify-between shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] rounded-full font-medium flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Connected
              </div>
            </div>

            {/* Extension UI */}
            <div className="flex flex-col h-full bg-slate-50">
              <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; border: 2px solid #f1f5f9; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
              `}</style>
              {/* Search Form */}
              <div className="bg-white p-4 border-b border-slate-200 space-y-3 shrink-0">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">Maps IT Finder 🗺️</h2>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase">Target Location</label>
                  <Input 
                    placeholder="e.g. Vastral, Gota" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {loading ? "Scraping Google Maps..." : "Search Maps"}
                </Button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {results.map((company, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-sm">{company.name}</h3>
                      {company.rating && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">★ {company.rating}</span>
                      )}
                    </div>
                    
                    <div className="space-y-1.5 mb-3">
                       <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapIcon className="w-3.5 h-3.5" /> <span className="underline cursor-pointer">View on Maps</span>
                      </div>
                      {company.phone && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="text-xs">📞</span> {company.phone}
                        </div>
                      )}
                      {company.website && (
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <Globe className="w-3.5 h-3.5" /> {new URL(company.website).hostname}
                        </div>
                      )}
                    </div>

                    {company.hr_emails.length > 0 && (
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Possible Emails</div>
                        <div className="flex flex-wrap gap-2">
                          {company.hr_emails.map(email => (
                             <span key={email} className="bg-white border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-700 cursor-pointer hover:border-blue-500 hover:text-blue-600 transition-colors">
                               {email} 📋
                             </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {!loading && results.length === 0 && (
                  <div className="text-center py-10 text-slate-400 text-sm">
                    Enter a location to find companies.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}