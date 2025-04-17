
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Phone, MapPin, Shield, Bell } from 'lucide-react';
import SOSButton from '@/components/ui/sos-button';

const EmergencySOS = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Shield className="h-16 w-16 text-sos mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-police-navy mb-4">Emergency SOS</h1>
          <p className="text-lg text-gray-600 mb-8">
            Get immediate assistance from the nearest police station. Your safety is our priority.
          </p>

          <div className="grid gap-6">
            <Button size="lg" className="bg-sos hover:bg-sos-hover h-16 text-lg">
              <Phone className="mr-2 h-6 w-6" />
              Call Emergency Services (100)
            </Button>

            <Button variant="outline" size="lg" className="h-16 text-lg">
              <MapPin className="mr-2 h-6 w-6" />
              Share Your Location
            </Button>

            <Button variant="outline" size="lg" className="h-16 text-lg border-police-saffron text-police-saffron hover:bg-police-saffron/10">
              <Bell className="mr-2 h-6 w-6" />
              Contact Nirbhaya Pathak
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Your nearest police station: Central Police Station (2.5 km away)
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmergencySOS;
