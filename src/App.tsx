import { useState } from 'react';
import { Header } from './components/Header';
import { LearningAssistant } from './components/LearningAssistant';
import { ExamPrep } from './components/ExamPrep';
import { UserManagement } from './components/UserManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

export default function App() {
  const [activeTab, setActiveTab] = useState('learning');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            不挂科 · AI学科辅助学习平台
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            智能课件管理 · 作业题关联 · AI答疑 · 期末备考一站式解决方案
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 h-auto p-1 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="learning" className="py-3">
               日常学习\作业答疑
            </TabsTrigger>
            <TabsTrigger value="exam" className="py-3">
              🎯 期末备考
            </TabsTrigger>
            <TabsTrigger value="user" className="py-3">
              👤 用户管理
            </TabsTrigger>
          </TabsList>

          <TabsContent value="learning" className="mt-0">
            <LearningAssistant />
          </TabsContent>

          <TabsContent value="exam" className="mt-0">
            <ExamPrep />
          </TabsContent>

          <TabsContent value="user" className="mt-0">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 不挂科 AI学科辅助学习平台 · 让学习更高效</p>
        </div>
      </footer>
    </div>
  );
}
