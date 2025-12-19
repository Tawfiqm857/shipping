import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { sampleShipments, type Shipment } from '@/data/shipments';
import ShipmentDetails from '@/components/ShipmentDetails';
import { Search, Package, MapPin, Clock } from 'lucide-react';
const Tracking = () => {
  const {
    isAuthenticated
  } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = sampleShipments.filter(shipment => shipment.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) || shipment.productName.toLowerCase().includes(searchQuery.toLowerCase()) || shipment.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredShipments(filtered);
    } else {
      setFilteredShipments([]);
    }
  }, [searchQuery]);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'in-transit':
        return 'bg-warning text-warning-foreground';
      case 'processing':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'in-transit':
        return 'In Transit';
      case 'processing':
        return 'Processing';
      default:
        return status;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Shipments</h1>
          <p className="text-muted-foreground">
            Monitor your packages in real-time with detailed tracking information
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search by tracking code, product, or recipient..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Shipments List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold mb-4">
              Your Shipments ({filteredShipments.length})
            </h2>
            
            {filteredShipments.length === 0 ? <Card>
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchQuery.trim() ? 'No shipments found' : 'Enter tracking code to search'}
                  </p>
                  {!searchQuery.trim()}
                </CardContent>
              </Card> : filteredShipments.map(shipment => <Card key={shipment.trackingCode} className={`cursor-pointer transition-all duration-200 hover:shadow-card hover:-translate-y-1 ${selectedShipment?.trackingCode === shipment.trackingCode ? 'ring-2 ring-primary shadow-card' : ''}`} onClick={() => setSelectedShipment(shipment)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-mono text-sm text-primary font-medium">
                          {shipment.trackingCode}
                        </p>
                        <h3 className="font-semibold text-sm mt-1">
                          {shipment.productName}
                        </h3>
                      </div>
                      <Badge className={getStatusColor(shipment.status)}>
                        {getStatusText(shipment.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2" />
                        <span>{shipment.currentLocation.city}, {shipment.currentLocation.country}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
          </div>

          {/* Shipment Details */}
          <div className="lg:col-span-2">
            {selectedShipment ? <ShipmentDetails shipment={selectedShipment} /> : <Card className="h-full">
                <CardContent className="p-8 text-center h-full flex items-center justify-center">
                  <div>
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Select a Shipment</h3>
                    <p className="text-muted-foreground">
                      Choose a shipment from the list to view detailed tracking information,
                      interactive maps, and delivery timeline.
                    </p>
                  </div>
                </CardContent>
              </Card>}
          </div>
        </div>
      </div>
    </div>;
};
export default Tracking;