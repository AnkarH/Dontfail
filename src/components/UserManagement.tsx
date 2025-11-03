import { useState } from 'react';
import { User, Mail, Calendar, BookOpen, MessageSquare, Award, Settings, Shield, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function UserManagement() {
  const [userData] = useState({
    name: '张同学',
    email: 'zhangsan@university.edu.cn',
    studentId: '2021010101',
    major: '计算机科学与技术',
    joinDate: '2025-09-01',
  });

  const studyStats = {
    totalCourses: 6,
    activeCourses: 4,
    totalQuestions: 156,
    answeredQuestions: 142,
    studyDays: 45,
    studyHours: 89,
  };

  const learningProgress = [
    { course: '数据结构与算法', progress: 78, chapters: '8/10章' },
    { course: '操作系统原理', progress: 65, chapters: '6/10章' },
    { course: '计算机网络', progress: 92, chapters: '11/12章' },
    { course: '数据库系统', progress: 45, chapters: '5/12章' },
  ];

  const recentActivity = [
    { action: '完成作业', detail: '数据结构-第三章练习', time: '2小时前' },
    { action: 'AI答疑', detail: '提问：二叉搜索树性质', time: '5小时前' },
    { action: '上传课件', detail: '操作系统-第四章.pdf', time: '1天前' },
    { action: '生成模拟卷', detail: '数据结构模拟卷1', time: '2天前' },
  ];

  const systemSettings = [
    { name: '文件存储空间', value: '2.3 GB / 10 GB', usage: 23 },
    { name: 'AI调用次数', value: '458 / 1000 次/月', usage: 46 },
    { name: '课件数量', value: '24 个', usage: 0 },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">个人信息</TabsTrigger>
          <TabsTrigger value="progress">学习进度</TabsTrigger>
          <TabsTrigger value="system">系统设置</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card className="lg:col-span-2 border-2 border-blue-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  用户信息
                </CardTitle>
                <CardDescription>管理您的个人信息和账户设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl">{userData.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-gray-900">{userData.name}</h3>
                    <p className="text-gray-500">{userData.studentId}</p>
                    <Badge variant="secondary" className="mt-1">{userData.major}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <div className="flex gap-2">
                      <Mail className="w-5 h-5 text-gray-400 mt-2" />
                      <Input id="email" value={userData.email} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentId">学号</Label>
                    <div className="flex gap-2">
                      <User className="w-5 h-5 text-gray-400 mt-2" />
                      <Input id="studentId" value={userData.studentId} readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="major">专业</Label>
                    <Input id="major" value={userData.major} readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">加入日期</Label>
                    <div className="flex gap-2">
                      <Calendar className="w-5 h-5 text-gray-400 mt-2" />
                      <Input id="joinDate" value={userData.joinDate} readOnly />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">修改密码</Button>
                  <Button variant="outline">编辑资料</Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-2 border-purple-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  学习统计
                </CardTitle>
                <CardDescription>您的学习数据概览</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 mb-2" />
                    <p className="text-gray-600 text-sm">活跃课程</p>
                    <p className="text-blue-600">{studyStats.activeCourses}/{studyStats.totalCourses}</p>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-green-600 mb-2" />
                    <p className="text-gray-600 text-sm">解答问题</p>
                    <p className="text-green-600">{studyStats.answeredQuestions}</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600 mb-2" />
                    <p className="text-gray-600 text-sm">学习天数</p>
                    <p className="text-purple-600">{studyStats.studyDays}天</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <Award className="w-5 h-5 text-orange-600 mb-2" />
                    <p className="text-gray-600 text-sm">累计时长</p>
                    <p className="text-orange-600">{studyStats.studyHours}h</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-gray-600 mb-2">近期活动</p>
                  <div className="space-y-2">
                    {recentActivity.slice(0, 3).map((activity, index) => (
                      <div key={index} className="text-sm">
                        <p className="text-gray-900">{activity.action}</p>
                        <p className="text-gray-500 text-xs">{activity.detail} · {activity.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Learning Progress */}
            <Card className="border-2 border-green-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  课程进度
                </CardTitle>
                <CardDescription>各科目学习进度追踪</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningProgress.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{course.course}</p>
                      <Badge variant="secondary">{course.chapters}</Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <p className="text-sm text-gray-500">{course.progress}% 完成</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Activity History */}
            <Card className="border-2 border-orange-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-600" />
                  答疑记录
                </CardTitle>
                <CardDescription>您的提问与答疑历史</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.detail}</p>
                      </div>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Study Plan */}
            <Card className="lg:col-span-2 border-2 border-blue-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  个人复习计划
                </CardTitle>
                <CardDescription>定制您的学习计划与目标</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border-2 border-dashed border-blue-200 rounded-lg text-center">
                    <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">数据结构期末复习</p>
                    <p className="text-sm text-gray-500">还剩 16 天</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      查看计划
                    </Button>
                  </div>

                  <div className="p-4 border-2 border-dashed border-purple-200 rounded-lg text-center">
                    <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">操作系统期末复习</p>
                    <p className="text-sm text-gray-500">还剩 19 天</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      查看计划
                    </Button>
                  </div>

                  <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center flex flex-col items-center justify-center">
                    <p className="text-gray-400 mb-3">+ 添加新计划</p>
                    <Button variant="outline" size="sm">
                      创建计划
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Resources */}
            <Card className="border-2 border-indigo-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  系统资源
                </CardTitle>
                <CardDescription>文件存储与AI调用管理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemSettings.map((setting, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{setting.name}</p>
                      <p className="text-sm text-gray-500">{setting.value}</p>
                    </div>
                    {setting.usage > 0 && (
                      <Progress value={setting.usage} className="h-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-2 border-red-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  权限与安全
                </CardTitle>
                <CardDescription>账户安全与隐私设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">两步验证</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">已启用</Badge>
                  </div>
                  <p className="text-sm text-gray-500">保护您的账户安全</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">数据加密</p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">已启用</Badge>
                  </div>
                  <p className="text-sm text-gray-500">所有文件均加密存储</p>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-900">隐私模式</p>
                    <Badge variant="secondary">未启用</Badge>
                  </div>
                  <p className="text-sm text-gray-500">限制AI学习您的数据</p>
                </div>

                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  管理权限设置
                </Button>
              </CardContent>
            </Card>

            {/* AI Model Settings */}
            <Card className="lg:col-span-2 border-2 border-purple-100 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-600" />
                  AI模型设置
                </CardTitle>
                <CardDescription>调整AI答疑与学习辅助功能</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">答疑模式</p>
                    <p className="text-sm text-gray-500 mb-3">优先使用课件内容</p>
                    <Badge className="bg-blue-500">推荐</Badge>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">详细程度</p>
                    <p className="text-sm text-gray-500 mb-3">中等详细度</p>
                    <Button variant="outline" size="sm">调整</Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 mb-2">调用日志</p>
                    <p className="text-sm text-gray-500 mb-3">本月458次调用</p>
                    <Button variant="outline" size="sm">查看</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
