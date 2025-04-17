import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ComplaintForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    address: '',
    aadharNumber: '',
    crimeType: '',
    dateTime: '',
    description: '',
  });

  const [aadharFile, setaadharFile] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<FileList | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      // aadhar Upload
      let aadharUrl = null;
      if (aadharFile) {
        const path = `aadhar/${Date.now()}_${aadharFile.name}`;
        const { data, error } = await supabase.storage
          .from('complaints')
          .upload(path, aadharFile);

        if (error) throw error;

        aadharUrl = supabase.storage.from('complaints').getPublicUrl(path).data.publicUrl;
      }

      // Evidence Uploads
      let evidenceUrls: string[] = [];
      if (evidenceFiles && evidenceFiles.length > 0) {
        for (let i = 0; i < evidenceFiles.length; i++) {
          const file = evidenceFiles[i];
          const path = `evidence/${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from('complaints')
            .upload(path, file);

          if (error) throw error;

          const publicUrl = supabase.storage.from('complaints').getPublicUrl(path).data.publicUrl;
          evidenceUrls.push(publicUrl);
        }
      }

      // Save to DB
      const { error: insertError } = await supabase.from('complaints').insert({
        name: formData.name,
        contact_number: formData.contactNumber,
        email: formData.email,
        address: formData.address,
        aadhar_number: formData.aadharNumber,
        aadhar_file_url: aadharUrl,
        crime_type: formData.crimeType,
        datetime: formData.dateTime,
        description: formData.description,
        evidence_urls: evidenceUrls,
      });

      if (insertError) throw insertError;

      alert('Complaint submitted successfully!');
      setStep(1);
    } catch (err: any) {
      console.error(err.message);
      alert('Error submitting complaint!');
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-police-navy mb-6">File a Complaint</h1>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-police-saffron rounded-full transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Personal Info</span>
              <span>Identity</span>
              <span>Details</span>
              <span>Evidence</span>
              <span>Review</span>
            </div>
          </div>

          <Tabs defaultValue="1" value={step.toString()}>
            <TabsContent value="1">
              <div className="space-y-4">
                <Input name="name" placeholder="Full Name" onChange={handleInput} />
                <Input name="contactNumber" placeholder="Contact Number" onChange={handleInput} />
                <Input name="email" placeholder="Email Address" onChange={handleInput} />
                <Textarea name="address" placeholder="Residential Address" onChange={handleInput} />
                <Button onClick={() => setStep(2)} className="w-full">Next</Button>
              </div>
            </TabsContent>

            <TabsContent value="2">
              <div className="space-y-4">
                <Input name="aadharNumber" placeholder="aadhar Card Number" onChange={handleInput} />
                <Input type="file" accept=".pdf,.jpg,.png" onChange={(e) => setaadharFile(e.target.files?.[0] || null)} />
                <Button onClick={() => setStep(3)} className="w-full">Next</Button>
              </div>
            </TabsContent>

            <TabsContent value="3">
              <div className="space-y-4">
                <select name="crimeType" className="w-full border rounded-md p-2" onChange={handleInput}>
                  <option>Select Crime Type</option>
                  <option value="Theft">Theft</option>
                  <option value="Assault">Assault</option>
                  <option value="Cybercrime">Cybercrime</option>
                </select>
                <Input name="dateTime" type="datetime-local" onChange={handleInput} />
                <Textarea name="description" placeholder="Describe the incident..." onChange={handleInput} />
                <Button onClick={() => setStep(4)} className="w-full">Next</Button>
              </div>
            </TabsContent>

            <TabsContent value="4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Drag and drop files here or click to browse</p>
                <p className="text-sm text-gray-500 mt-1">Supported formats: PDF, JPG, MP4 (Max 50MB)</p>
                <Input type="file" multiple accept="image/*,video/*,.pdf,.mp3" onChange={(e) => setEvidenceFiles(e.target.files)} />
              </div>
              <Button onClick={() => setStep(5)} className="w-full mt-4">Next</Button>
            </TabsContent>

            <TabsContent value="5">
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold">Review your complaint</h3>
                {/* Optional: Render summary here */}
                <Button onClick={handleSubmit} className="w-full bg-police-green text-white hover:bg-police-green/90">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Complaint
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ComplaintForm;
