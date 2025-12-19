import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Phone, MapPin, Package, Calendar, Settings, Edit, Bell, Shield, Download, MessageSquare } from 'lucide-react';
import { useState } from 'react';
const Profile = () => {
  const {
    user
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>;
  }
  const userStats = {
    totalShipments: 1,
    delivered: 0,
    inTransit: 1,
    processing: 0
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account and shipment preferences</p>
          </div>
          <Button variant={isEditing ? "default" : "outline"} className="flex items-center gap-2 transition-smooth" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Information */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    {isEditing ? <Input id="fullName" value={profileData.fullName} onChange={e => setProfileData({
                    ...profileData,
                    fullName: e.target.value
                  })} className="transition-smooth" /> : <p className="text-lg font-semibold bg-muted/30 p-3 rounded-lg">{profileData.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {isEditing ? <Input id="email" type="email" value={profileData.email} onChange={e => setProfileData({
                      ...profileData,
                      email: e.target.value
                    })} className="flex-1 transition-smooth" /> : <p className="text-lg bg-muted/30 p-3 rounded-lg flex-1">{profileData.email}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {isEditing ? <Input id="phone" type="tel" value={profileData.phone} onChange={e => setProfileData({
                      ...profileData,
                      phone: e.target.value
                    })} className="flex-1 transition-smooth" placeholder="Enter phone number" /> : <p className="text-lg bg-muted/30 p-3 rounded-lg flex-1">{profileData.phone || 'Not provided'}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-lg bg-muted/30 p-3 rounded-lg flex-1">January 2024</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Default Address</Label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      {isEditing ? <Input id="address" value={profileData.address} onChange={e => setProfileData({
                      ...profileData,
                      address: e.target.value
                    })} className="transition-smooth" placeholder="Enter street address" /> : <p className="bg-muted/30 p-3 rounded-lg">{profileData.address || 'Not provided'}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City & Postal Code</Label>
                      {isEditing ? <Input id="city" value={profileData.city} onChange={e => setProfileData({
                      ...profileData,
                      city: e.target.value
                    })} className="transition-smooth" placeholder="Enter city & postal code" /> : <p className="bg-muted/30 p-3 rounded-lg">{profileData.city || 'Not provided'}</p>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about your shipments</p>
                    </div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Get text updates for urgent matters</p>
                    </div>
                  </div>
                  <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-card rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Shield className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Extra security for your account</p>
                    </div>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Shipment Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{userStats.totalShipments}</div>
                  <p className="text-sm text-muted-foreground">Total Shipments</p>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Delivered</span>
                    <Badge className="bg-success text-success-foreground">
                      {userStats.delivered}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">In Transit</span>
                    <Badge className="bg-warning text-warning-foreground">
                      {userStats.inTransit}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing</span>
                    <Badge className="bg-info text-info-foreground">
                      {userStats.processing}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="default" className="w-full bg-gradient-hero hover:opacity-90 transition-smooth">
                  <Package className="h-4 w-4 mr-2" />
                  Create New Shipment
                </Button>
                <Button variant="outline" className="w-full hover-scale">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full hover-scale">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Profile;