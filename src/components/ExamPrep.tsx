import { useState, useEffect } from 'react';
import { FileStack, BookMarked, ClipboardList, Target, TrendingUp, Brain, Plus, Upload, X, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ExamDocReader } from './ExamDocReader';

// Helper function to calculate countdown
function getCountdown(examDate: string) {
  const now = new Date();
  const exam = new Date(examDate);
  const diff = exam.getTime() - now.getTime();

  if (diff <= 0) {
    return { text: '已结束', isPast: true, days: 0, hours: 0, minutes: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { text: `${days}天${hours}小时`, isPast: false, days, hours, minutes };
  } else if (hours > 0) {
    return { text: `${hours}小时${minutes}分钟`, isPast: false, days, hours, minutes };
  } else {
    return { text: `${minutes}分钟`, isPast: false, days, hours, minutes };
  }
}

export function ExamPrep() {
  const [selectedExam, setSelectedExam] = useState('data-structure');
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<'overview' | 'reader'>('overview');
  const [newSubject, setNewSubject] = useState({
    name: '',
    date: '',
    courseware: [],
    textbooks: [],
    homework: [],
    pastExams: [],
  });

  // Update countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const examMaterials = {
    'data-structure': {
      name: '数据结构期末考试',
      date: '2025-11-15',
      materials: [
        { type: '课件', count: 8, status: '已整合' },
        { type: '课本', count: 12, status: '已整合' },
        { type: '作业题', count: 45, status: '已整合' },
        { type: '往年题', count: 3, status: '处理中' },
      ],
      questionBank: [
        { type: '选择题', count: 120, matched: 108 },
        { type: '简答题', count: 45, matched: 42 },
        { type: '编程题', count: 30, matched: 28 },
      ],
      keyTopics: [
        '二叉树遍历', '图的最短路径', '排序算法', '动态规划', '哈希表'
      ],
      documents: {
        courseware: [
          { name: '第1章-绪论.pptx', pages: 25 },
          { name: '第2章-线性表.pptx', pages: 42 },
          { name: '第3章-栈和队列.pptx', pages: 38 },
          { name: '第4章-树和二叉树.pptx', pages: 56 },
        ],
        textbooks: [
          { name: '数据结构教材-第1-3章.pdf', pages: 120 },
          { name: '数据结构教材-第4-6章.pdf', pages: 145 },
        ],
        homework: [
          { name: '作业1-线性表.pdf', pages: 8 },
          { name: '作业2-栈和队列.pdf', pages: 10 },
          { name: '作业3-树.pdf', pages: 12 },
        ],
        pastExams: [
          { name: '2023年期末考试.pdf', pages: 8 },
          { name: '2024年期末考试.pdf', pages: 10 },
        ],
      },
    },
    'os': {
      name: '操作系统期末考试',
      date: '2025-11-18',
      materials: [
        { type: '课件', count: 10, status: '已整合' },
        { type: '课本', count: 15, status: '已整合' },
        { type: '作业题', count: 38, status: '已整合' },
        { type: '往年题', count: 5, status: '已整合' },
      ],
      questionBank: [
        { type: '选择题', count: 150, matched: 150 },
        { type: '简答题', count: 60, matched: 55 },
        { type: '设计题', count: 20, matched: 18 },
      ],
      keyTopics: [
        '进程调度', '内存管理', '文件系统', '死锁处理', '页面置换算法'
      ],
      documents: {
        courseware: [
          { name: '第1章-操作系统概述.pptx', pages: 30 },
          { name: '第2章-进程管理.pptx', pages: 48 },
          { name: '第3章-内存管理.pptx', pages: 52 },
        ],
        textbooks: [
          { name: '操作系统教材-完整版.pdf', pages: 380 },
        ],
        homework: [
          { name: '作业1-进程.pdf', pages: 6 },
          { name: '作业2-内存.pdf', pages: 8 },
        ],
        pastExams: [
          { name: '2022年期末考试.pdf', pages: 10 },
          { name: '2023年期末考试.pdf', pages: 12 },
          { name: '2024年期末考试.pdf', pages: 10 },
        ],
      },
    },
  };

  const currentExam = examMaterials[selectedExam];
  const totalQuestions = currentExam.questionBank.reduce((sum, q) => sum + q.count, 0);
  const matchedQuestions = currentExam.questionBank.reduce((sum, q) => sum + q.matched, 0);

  const handleFileSelect = (type: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files).map(f => f.name);
    setNewSubject(prev => ({
      ...prev,
      [type]: [...prev[type], ...fileArray]
    }));
  };

  const removeFile = (type: string, index: number) => {
    setNewSubject(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleAddSubject = () => {
    // Handle subject creation logic here
    console.log('New subject:', newSubject);
    setIsAddSubjectOpen(false);
    setNewSubject({
      name: '',
      date: '',
      courseware: [],
      textbooks: [],
      homework: [],
      pastExams: [],
    });
  };

  // Document Reader Mode
  if (viewMode === 'reader') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={() => setViewMode('overview')}>
            ← 返回概览
          </Button>
          <h2 className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {currentExam.name} - 文档阅读
          </h2>
          <div className="w-24"></div>
        </div>
        <ExamDocReader examName={currentExam.name} materials={currentExam.documents} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exam Selection */}
      <div className="flex gap-2 flex-wrap items-center">
        {Object.entries(examMaterials).map(([key, exam]) => {
          const countdown = getCountdown(exam.date);
          return (
            <div key={key} className="relative">
              <Button 
                size="sm"
                variant={selectedExam === key ? 'default' : 'outline'}
                onClick={() => setSelectedExam(key)}
              >
                {exam.name}
              </Button>
              {!countdown.isPast && countdown.days <= 7 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 px-1 text-xs"
                >
                  紧急
                </Badge>
              )}
            </div>
          );
        })}
        
        <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              添加科目
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>添加复习科目</DialogTitle>
              <DialogDescription>
                上传课件、课本、作业题、往年题，并为科目命名
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Subject Name */}
              <div className="space-y-2">
                <Label htmlFor="subject-name">科目名称 *</Label>
                <Input
                  id="subject-name"
                  placeholder="例如：计算机网络期末考试"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Exam Date */}
              <div className="space-y-2">
                <Label htmlFor="exam-date">考试日期</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={newSubject.date}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              {/* Courseware Upload */}
              <div className="space-y-2">
                <Label>课件</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="courseware-upload"
                    multiple
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => handleFileSelect('courseware', e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="courseware-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">点击上传课件（支持 PDF, PPT）</p>
                  </label>
                </div>
                {newSubject.courseware.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newSubject.courseware.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate flex-1">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFile('courseware', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Textbooks Upload */}
              <div className="space-y-2">
                <Label>课本</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="textbooks-upload"
                    multiple
                    accept=".pdf,.docx"
                    onChange={(e) => handleFileSelect('textbooks', e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="textbooks-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">点击上传课本（支持 PDF, DOCX）</p>
                  </label>
                </div>
                {newSubject.textbooks.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newSubject.textbooks.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate flex-1">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFile('textbooks', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Homework Upload */}
              <div className="space-y-2">
                <Label>作业题</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="homework-upload"
                    multiple
                    accept=".pdf,.docx,.jpg,.png"
                    onChange={(e) => handleFileSelect('homework', e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="homework-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">点击上传作业题（支持 PDF, DOCX, 图片）</p>
                  </label>
                </div>
                {newSubject.homework.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newSubject.homework.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate flex-1">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFile('homework', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Past Exams Upload */}
              <div className="space-y-2">
                <Label>往年题</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="pastexams-upload"
                    multiple
                    accept=".pdf,.docx,.jpg,.png"
                    onChange={(e) => handleFileSelect('pastExams', e.target.files)}
                    className="hidden"
                  />
                  <label htmlFor="pastexams-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">点击上传往年题（支持 PDF, DOCX, 图片）</p>
                  </label>
                </div>
                {newSubject.pastExams.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {newSubject.pastExams.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span className="truncate flex-1">{file}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => removeFile('pastExams', index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsAddSubjectOpen(false)}>
                  取消
                </Button>
                <Button 
                  onClick={handleAddSubject}
                  disabled={!newSubject.name.trim()}
                >
                  创建科目
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Integration */}
        <Card className="lg:col-span-2 border-2 border-orange-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileStack className="w-5 h-5 text-orange-600" />
                  资料整合
                </CardTitle>
                <CardDescription>
                  {currentExam.name} · 考试日期：{currentExam.date}
                </CardDescription>
                <Button 
              onClick={() => setViewMode('reader')}
              className="w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              开始学习
            </Button>
              </div>
              <Badge 
                variant={getCountdown(currentExam.date).days <= 7 ? 'destructive' : 'secondary'}
                className="flex items-center gap-1"
              >
                <Clock className="w-3 h-3" />
                {getCountdown(currentExam.date).isPast ? (
                  '已结束'
                ) : (
                  <>还剩 {getCountdown(currentExam.date).text}</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentExam.materials.map((material, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-700">{material.type}</p>
                    <Badge 
                      variant={material.status === '已整合' ? 'default' : 'secondary'}
                      className={material.status === '已整合' ? 'bg-green-500' : ''}
                    >
                      {material.status}
                    </Badge>
                  </div>
                  <p className="text-gray-900">
                    {material.count} 个文件
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <p className="text-gray-900">考试范围设置</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  第1-8章（已选择）
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500">
                  + 添加或删减章节
                </Button>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <BookMarked className="w-5 h-5 text-purple-600" />
                <p className="text-gray-900">经典题目与考点</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentExam.keyTopics.map((topic, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            
          </CardContent>
        </Card>

        {/* Question Bank Stats */}
        <Card className="border-2 border-indigo-100 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              题库统计
            </CardTitle>
            <CardDescription>AI生成的复习题库</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg">
              <p className="text-gray-600 mb-1">总题目数</p>
              <p className="text-indigo-600">{totalQuestions}</p>
              <p className="text-sm text-gray-500 mt-2">
                已匹配课件 {matchedQuestions}/{totalQuestions}
              </p>
            </div>

            <div className="space-y-3">
              {currentExam.questionBank.map((qType, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">{qType.type}</p>
                    <p className="text-sm text-gray-500">{qType.count} 题</p>
                  </div>
                  <Progress 
                    value={(qType.matched / qType.count) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {qType.matched} 题已关联课件
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Tools */}
      <Card className="border-2 border-green-100 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-green-600" />
            复习题库生成
          </CardTitle>
          <CardDescription>智能生成模拟卷与错题本</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mock" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mock">模拟试卷</TabsTrigger>
              <TabsTrigger value="mistakes">错题本</TabsTrigger>
              <TabsTrigger value="topics">专题练习</TabsTrigger>
            </TabsList>

            <TabsContent value="mock" className="space-y-3 mt-4">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-900">模拟卷 {num}</p>
                      <p className="text-sm text-gray-500">100分 · 120分钟 · AI智能组卷</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">开始练习</Button>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="mistakes" className="space-y-3 mt-4">
              <div className="text-center p-8 text-gray-500">
                <p>暂无错题记录</p>
                <p className="text-sm mt-2">完成练习后，错题会自动归集到此处</p>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-3 mt-4">
              {currentExam.keyTopics.slice(0, 3).map((topic, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="text-gray-900">{topic} 专题</p>
                    <p className="text-sm text-gray-500">25道题 · 预计30分钟</p>
                  </div>
                  <Button size="sm" variant="outline">开始练习</Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
