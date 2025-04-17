
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserCircle, Mail, Phone, Lock, Bell } from 'lucide-react';

const Profile = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-police-navy rounded-full flex items-center justify-center">
              <UserCircle className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-police-navy">Your Profile</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input placeholder="Your full name" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input type="email" placeholder="Your email" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input placeholder="Your phone number" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Password</label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confirm Password</label>
                  <Input type="password" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-gray-500" />
                    <span>Email Notifications</span>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="toggle" />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
