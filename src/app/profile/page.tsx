"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarDays, MapPin, Phone, Mail, User, Shield, Clock, ExternalLink, Download, Bell } from "lucide-react";
import Image from "next/image";

// Mock User Data
const mockUser = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  address: "MP Nagar, Zone 1, Bhopal",
  joinDate: "August 2023",
  avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80",
};

// Mock Bookings Data
const mockBookings = [
  {
    id: "BK-78923",
    property: "The Scholars Nest - Boys PG",
    location: "Indrapuri, Bhopal",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80",
    roomType: "Double Sharing",
    checkIn: "2024-03-01",
    checkOut: "2024-08-31",
    status: "Active",
    rent: "₹6,500/month",
  },
  {
    id: "BK-44211",
    property: "Sunrise Premium Hostel",
    location: "Awadhpuri, Bhopal",
    image: "https://images.unsplash.com/photo-1522771731478-44fb10e99340?auto=format&fit=crop&w=400&q=80",
    roomType: "Single Room",
    checkIn: "2024-09-05",
    checkOut: "2025-05-30",
    status: "Upcoming",
    rent: "₹8,000/month",
  },
  {
    id: "BK-11029",
    property: "Comfort Stay Co-ed",
    location: "Kolar Road, Bhopal",
    image: "https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&w=400&q=80",
    roomType: "Triple Sharing",
    checkIn: "2023-01-10",
    checkOut: "2023-12-25",
    status: "Completed",
    rent: "₹4,500/month",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Upcoming": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                <AvatarFallback className="text-2xl bg-brand-primary text-white">
                  {mockUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{mockUser.name}</h1>
                <div className="flex items-center gap-2 text-gray-500 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  <span>Member since {mockUser.joinDate}</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10">
              Edit Profile
            </Button>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8 bg-white shadow-sm rounded-xl p-1">
              <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-brand-primary data-[state=active]:text-white">
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab Content */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="name" defaultValue={mockUser.name} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="email" type="email" defaultValue={mockUser.email} className="pl-10" disabled />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="phone" defaultValue={mockUser.phone} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Current Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input id="address" defaultValue={mockUser.address} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button className="bg-brand-primary hover:bg-brand-primary/90">Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Bookings Tab Content */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {mockBookings.map((booking) => (
                  <Card key={booking.id} className="border-none shadow-sm overflow-hidden flex flex-col md:flex-row">
                    <div className="relative w-full md:w-64 h-48 md:h-auto">
                      <Image 
                        src={booking.image} 
                        alt={booking.property}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <Badge variant="outline" className={`mb-2 ${getStatusBadgeVariant(booking.status)}`}>
                            {booking.status}
                          </Badge>
                          <h3 className="text-xl font-bold text-gray-900">{booking.property}</h3>
                          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{booking.location}</span>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-500 uppercase font-semibold">Booking ID</p>
                          <p className="font-mono text-sm">{booking.id}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Check-in</p>
                          <p className="font-medium text-sm">
                            {(() => {
                              const [y, m, d] = booking.checkIn.split('-');
                              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                              return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Check-out</p>
                          <p className="font-medium text-sm">
                            {(() => {
                              const [y, m, d] = booking.checkOut.split('-');
                              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                              return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Room</p>
                          <p className="font-medium text-sm">{booking.roomType}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Rent</p>
                          <p className="font-medium text-sm text-brand-primary">{booking.rent}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-auto justify-end">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Receipt
                        </Button>
                        <Button size="sm" className="gap-2 bg-brand-dark hover:bg-gray-800 text-white">
                          View Property <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab Content */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Account Settings</CardTitle>
                  <CardDescription>Manage your preferences and security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Bell className="h-4 w-4 text-brand-primary" /> Notifications
                    </h4>
                    <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive booking updates and promotional offers.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">SMS Alerts</Label>
                        <p className="text-sm text-gray-500">Get text messages for important booking changes.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                      <Shield className="h-4 w-4 text-brand-primary" /> Security
                    </h4>
                    <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
                      <div className="space-y-0.5">
                        <Label className="text-base">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
