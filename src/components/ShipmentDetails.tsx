import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { type Shipment } from '@/data/shipments';
import ShipmentMap from './ShipmentMap';
import TimelineProgress from './TimelineProgress';
import { Package, User, MapPin, Weight, Ruler, Calendar, DollarSign, Shield, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ShipmentDetailsProps {
  shipment: Shipment;
}

const ShipmentDetails = ({ shipment }: ShipmentDetailsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = shipment.productImages || [shipment.productImage];
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  const getDeliveryProgress = () => {
    const currentDate = new Date();
    const deliveryDate = new Date(shipment.estimatedDelivery);
    const completedCheckpoints = shipment.checkpoints.filter(cp => cp.status === 'completed').length;
    const totalCheckpoints = shipment.checkpoints.length;
    
    if (shipment.status === 'delivered') return 100;
    
    return Math.round((completedCheckpoints / totalCheckpoints) * 100);
  };
  
  const getDaysUntilDelivery = () => {
    const currentDate = new Date();
    const deliveryDate = new Date(shipment.estimatedDelivery);
    const diffTime = deliveryDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <Card className="card-hover border-border/50 shadow-card">
        <CardHeader className="bg-gradient-card">
          <div className="flex flex-col lg:flex-row items-start lg:items-start justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 w-full">
              {/* Image Gallery */}
              <div className="relative group w-full sm:w-auto flex-shrink-0">
                <img
                  src={images[currentImageIndex]}
                  alt={shipment.productName}
                  className="w-full sm:w-[280px] lg:w-[350px] h-48 sm:h-56 lg:h-64 rounded-xl object-cover shadow-card border border-border/50 transition-transform duration-300 group-hover:scale-105"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex-1 min-w-0 w-full">
                <CardTitle className="text-xl sm:text-2xl break-words">{shipment.productName}</CardTitle>
                <p className="text-xs sm:text-sm font-mono text-primary mt-1 break-all">
                  {shipment.trackingCode}
                </p>
                <Badge className={`mt-2 ${getStatusColor(shipment.status)}`}>
                  {getStatusText(shipment.status)}
                </Badge>
                
                {/* Delivery Progress */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Delivery Progress</span>
                    <span className="font-medium">{getDeliveryProgress()}%</span>
                  </div>
                  <Progress value={getDeliveryProgress()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {getDaysUntilDelivery() > 0 
                      ? `${getDaysUntilDelivery()} days until delivery`
                      : shipment.status === 'delivered' 
                        ? 'Delivered successfully' 
                        : 'Delivery date has passed'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Location & ETA */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="card-hover bg-gradient-card border-border/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-primary/10 rounded-xl shadow-sm flex-shrink-0">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Current Location</p>
                <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent break-words">
                  {shipment.currentLocation.city}, {shipment.currentLocation.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-card border-border/50">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-success/10 rounded-xl shadow-sm flex-shrink-0">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Estimated Delivery</p>
                <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-success to-success bg-clip-text text-transparent">
                  {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Location Tracking</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ShipmentMap shipment={shipment} />
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <TimelineProgress checkpoints={shipment.checkpoints} />
        </CardContent>
      </Card>

      {/* Pricing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-3 sm:gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Product Value</span>
                <span className="font-medium">{shipment.pricing.currency} {shipment.pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Shipping</span>
                <span className="font-medium">{shipment.pricing.currency} {shipment.pricing.shipping.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Insurance</span>
                <span className="font-medium">{shipment.pricing.currency} {shipment.pricing.insurance.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">Custom Duties</span>
                    <AlertCircle className="h-3 w-3 text-warning" />
                  </div>
                  <span className="text-xs text-warning">Unpaid - Required before delivery</span>
                </div>
                <span className="font-medium text-warning">{shipment.pricing.currency} {shipment.pricing.customDuties.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">Taxes & Fees</span>
                    <AlertCircle className="h-3 w-3 text-warning" />
                  </div>
                  <span className="text-xs text-warning">Unpaid - Required before delivery</span>
                </div>
                <span className="font-medium text-warning">{shipment.pricing.currency} {shipment.pricing.taxes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">Priority: {shipment.servicePriority}</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total Cost</span>
            <span className="text-primary">{shipment.pricing.currency} {shipment.pricing.total.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Insured Value</span>
            </div>
            <span>{shipment.pricing.currency} {shipment.insuranceValue.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Sender & Recipient */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Sender & Recipient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div>
              <p className="font-medium text-xs sm:text-sm text-muted-foreground mb-1">FROM</p>
              <p className="font-semibold text-sm sm:text-base break-words">{shipment.sender.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {shipment.sender.address}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {shipment.sender.city}, {shipment.sender.country}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <p className="font-medium text-xs sm:text-sm text-muted-foreground mb-1">TO</p>
              <p className="font-semibold text-sm sm:text-base break-words">{shipment.recipient.name}</p>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                {shipment.recipient.address}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {shipment.recipient.city}, {shipment.recipient.country}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Package Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Weight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">Weight</span>
              </div>
              <span className="font-medium text-xs sm:text-sm">{shipment.weight}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Ruler className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">Dimensions</span>
              </div>
              <span className="font-medium text-xs sm:text-sm break-words text-right">{shipment.dimensions}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs sm:text-sm">Service Priority</span>
              </div>
              <Badge variant="outline" className="capitalize text-xs">
                {shipment.servicePriority}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShipmentDetails;