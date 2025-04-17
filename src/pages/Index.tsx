
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import SOSButton from "@/components/ui/sos-button";
import SectionHeader from "@/components/ui/section-header";
import { StatsGrid } from "@/components/ui/stats-card";
import PoliceBadge from "@/components/ui/police-badge";
import { FileText, MapPin, BookOpen, Shield, Users, Building, CheckCircle, Clock } from "lucide-react";

const Index = () => {
  // Stats data
  const statsData = [
    {
      icon: <FileText className="h-5 w-5" />,
      value: "24,573",
      label: "Total Complaints Filed",
      trend: { value: 12, isPositive: true },
    },
    {
      icon: <Building className="h-5 w-5" />,
      value: "1,248",
      label: "Active Police Stations",
      trend: { value: 5, isPositive: true },
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      value: "21,892",
      label: "Resolved Cases",
      trend: { value: 8, isPositive: true },
    },
    {
      icon: <Clock className="h-5 w-5" />,
      value: "48h",
      label: "Avg. Response Time",
      trend: { value: 15, isPositive: false },
    },
  ];

  // Quick links data
  const quickLinks = [
    {
      title: "File a Complaint",
      description: "Report an incident or file a new police complaint",
      icon: <FileText className="h-12 w-12 text-police-navy" />,
      href: "/complaint/new",
      color: "bg-blue-50",
    },
    {
      title: "Emergency SOS",
      description: "Get immediate help in emergency situations",
      icon: <Shield className="h-12 w-12 text-sos" />,
      href: "/sos",
      color: "bg-red-50",
    },
    {
      title: "Law Learning",
      description: "Learn about your legal rights and responsibilities",
      icon: <BookOpen className="h-12 w-12 text-police-green" />,
      href: "/learn",
      color: "bg-green-50",
    },
    {
      title: "Safety Map",
      description: "View the safety heatmap of your city",
      icon: <MapPin className="h-12 w-12 text-police-saffron" />,
      href: "/heatmap",
      color: "bg-orange-50",
    },
  ];

  return (
    <MainLayout>
      {/* Fixed SOS Button */}
      <SOSButton fixed />

      {/* Hero Section */}
      <section className="police-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <PoliceBadge className="mb-4" size="lg" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Safety, Simplified
              </h1>
              <p className="text-lg md:text-xl text-gray-100">
                The Rapid Police System connects citizens with law enforcement, streamlining 
                complaints, providing emergency services, and offering transparent case tracking.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild className="police-button-gold">
                  <Link to="/complaint/new">File Complaint</Link>
                </Button>
                <Button asChild className="police-button-sos">
                  <Link to="/sos">Emergency SOS</Link>
                </Button>
                <Button asChild variant="outline" className="text-white border-white hover:bg-white/10">
                  <Link to="/heatmap">View Safety Map</Link>
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center relative">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 w-full h-full bg-white rounded-full opacity-20"></div>
                <div className="absolute inset-[15%] w-[70%] h-[70%] bg-police-gold rounded-full flex items-center justify-center">
                  <Shield className="w-24 h-24 text-police-navy" />
                </div>
                <div className="absolute inset-0 border-[6px] border-white rounded-full animate-spin-chakra opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Making an Impact"
            description="See how the Rapid Police System is transforming citizen-police interactions across India."
            align="center"
            withAccent={false}
          />
          <StatsGrid stats={statsData} />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Our Services"
            description="Access a range of citizen services designed for ease and accessibility."
            align="center"
            withAccent={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {quickLinks.map((link, index) => (
              <Link to={link.href} key={index} className="police-card hover:translate-y-[-5px] transition-transform">
                <div className="p-6 text-center">
                  <div className={`${link.color} rounded-full p-4 inline-flex justify-center mb-6`}>
                    {link.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-police-navy">{link.title}</h3>
                  <p className="text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-police-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Join the Safety Movement</h2>
            <p className="text-lg text-gray-300">
              Download our mobile app for quicker access to emergency services, complaint filing, and case tracking.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button className="police-button-saffron">
                Download for Android
              </Button>
              <Button className="police-button-gold">
                Download for iOS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              title="Trusted by Citizens Across India"
              align="center"
              withAccent={false}
            />
            <div className="flex flex-wrap justify-center items-center gap-8 mt-10">
              <div className="flex flex-col items-center">
                <Users className="h-10 w-10 text-police-navy mb-2" />
                <p className="font-medium">2M+ Citizens</p>
              </div>
              <div className="flex flex-col items-center">
                <Building className="h-10 w-10 text-police-navy mb-2" />
                <p className="font-medium">1200+ Stations</p>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="h-10 w-10 text-police-navy mb-2" />
                <p className="font-medium">28 States</p>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle className="h-10 w-10 text-police-navy mb-2" />
                <p className="font-medium">95% Resolution</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
