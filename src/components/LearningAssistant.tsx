import { useState } from 'react';
import { Upload, FileText, BookOpen, MessageSquare, Highlighter, CheckCircle2, Send, Plus, Sparkles, Search, Camera, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

export function LearningAssistant() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [searchMode, setSearchMode] = useState<'smart' | 'ai'>('smart');
  
  const courseMaterials = [
    { id: 1, name: '数据结构与算法-第三章.pdf', pages: 45, type: 'PDF', uploaded: '2025-10-20' },
    { id: 2, name: '操作系统原理-课件.pptx', pages: 120, type: 'PPT', uploaded: '2025-10-18' },
    { id: 3, name: '计算机网络-教材.docx', pages: 280, type: 'DOCX', uploaded: '2025-10-15' },
  ];

  const homeworkTasks = [
    { id: 1, title: '第三章练习题', total: 15, completed: 12, linked: true },
    { id: 2, title: '数据结构作业二', total: 20, completed: 8, linked: true },
    { id: 3, title: '算法分析习题', total: 10, completed: 0, linked: false },
  ];

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'user',
      content: '请解释什么是二叉搜索树？',
      timestamp: '10:23',
    },
    {
      id: 2,
      type: 'ai',
      content: '二叉搜索树（Binary Search Tree，BST）是一种特殊的二叉树数据结构，具有以下性质：\n\n1. 左子树的所有节点值小于根节点值\n2. 右子树的所有节点值大于根节点值\n3. 左右子树也都是二叉搜索树\n\n这种结构使得查找、插入和删除操作的平均时间复杂度为 O(log n)。',
      source: { page: 23, file: '数据结构与算法-第三章.pdf' },
      timestamp: '10:23',
    },
  ]);

  const handleFileUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setUploadProgress(0), 1000);
      }
    }, 200);
  };

  const handleSendQuestion = () => {
    if (!question.trim()) return;
    
    const newMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setQuestion('');

    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        content: '正在分析您的问题，并从课件中查找相关内容...',
        source: null,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Side: Course Materials & Homework */}
      <div className="lg:col-span-1 space-y-4">
        {/* Course Material Management */}
        <Card className="border-2 border-blue-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              课件管理
            </CardTitle>
            <CardDescription className="text-xs">上传课件/电子课本</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-2">拖拽或点击上传</p>
              <Button onClick={handleFileUpload} variant="outline" size="sm">
                选择文件
              </Button>
              {uploadProgress > 0 && (
                <div className="mt-3">
                  <Progress value={uploadProgress} className="h-1" />
                </div>
              )}
            </div>

            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {courseMaterials.map((material) => (
                  <div 
                    key={material.id} 
                    className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <FileText className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{material.name}</p>
                        <p className="text-xs text-gray-500">
                          {material.pages} 页 · {material.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                        <BookOpen className="w-3 h-3 mr-1" />
                        预览
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                        <Highlighter className="w-3 h-3 mr-1" />
                        标注
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Homework Correlation */}
        <Card className="border-2 border-purple-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600" />
              作业题关联
            </CardTitle>
            <CardDescription className="text-xs">AI匹配题目与课件</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {homeworkTasks.map((task) => (
                <div key={task.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-gray-900">{task.title}</p>
                    {task.linked && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs h-5">
                        已关联
                      </Badge>
                    )}
                  </div>
                  <Progress 
                    value={(task.completed / task.total) * 100} 
                    className="h-1 mb-1"
                  />
                  <p className="text-xs text-gray-500">
                    {task.completed} / {task.total} 已完成
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side: AI Chat */}
      <Card className="lg:col-span-2 border-2 border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            AI答疑助手
          </CardTitle>
          <CardDescription>基于课件内容的智能问答 · 支持OCR图片识别</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Search Mode Buttons */}
          <div className="flex gap-2">
            <Button
              variant={searchMode === 'smart' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('smart')}
              className="h-8"
            >
              <Search className="w-3 h-3 mr-1" />
              智能检索
            </Button>
            <Button
              variant={searchMode === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchMode('ai')}
              className="h-8"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI生成
            </Button>
            <div className="ml-auto text-xs text-gray-500 flex items-center">
              {searchMode === 'smart' ? '优先使用课件内容' : '无匹配时生成解答'}
            </div>
          </div>

          {/* Chat History */}
          <ScrollArea className="h-[500px] pr-2">
            <div className="space-y-3">
              {chatHistory.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-1' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      {message.source && (
                        <div className="mt-2 pt-2 border-t border-gray-300">
                          <Badge variant="secondary" className="bg-white/20 text-xs">
                            📄 {message.source.file} · P{message.source.page}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.type === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2">
            <Textarea
              placeholder="输入您的问题..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendQuestion();
                }
              }}
              className="min-h-[60px] resize-none"
            />
            <div className="flex flex-col gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-[60px] w-12">
                    <Plus className="w-5 h-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      onClick={handleFileUpload}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      拍照提问
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      size="sm"
                      onClick={handleFileUpload}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      上传图片
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button 
              onClick={handleSendQuestion}
              disabled={!question.trim()}
              className="h-[60px] px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-xs text-gray-500">
            💡 按 Enter 发送，Shift + Enter 换行 · 点击 + 号上传图片或拍照
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
