
import MainLayout from '@/components/layout/MainLayout';
import { Search, BookOpen, Bookmark, Book } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const LawLearning = () => {
  const lawArticles = [
    {
      title: "Understanding IPC Section 420",
      category: "Criminal Law",
      summary: "Explains fraud and cheating under Indian law",
      readTime: "5 min"
    },
    {
      title: "Right to Information Act",
      category: "Civil Rights",
      summary: "Your right to access government information",
      readTime: "8 min"
    },
    {
      title: "Cyber Security Laws",
      category: "Digital Laws",
      summary: "Protection against online crimes",
      readTime: "10 min"
    }
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-police-navy mb-6">Law Learning Portal</h1>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search laws, rights, or topics..." className="pl-10" />
          </div>
          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Quick Guide
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lawArticles.map((article, index) => (
            <Card key={index} className="p-6">
              <div className="flex justify-between items-start">
                <div className="bg-police-saffron/10 p-2 rounded-lg">
                  <Book className="h-6 w-6 text-police-saffron" />
                </div>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{article.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{article.summary}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{article.readTime} read</span>
                <Button variant="link" className="text-police-navy">
                  Learn More →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default LawLearning;
