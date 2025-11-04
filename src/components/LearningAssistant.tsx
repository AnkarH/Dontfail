import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Upload, FileText, BookOpen, MessageSquare, Highlighter, CheckCircle2, Send, Plus, Sparkles, Search, Camera, Image as ImageIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

export function LearningAssistant() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [question, setQuestion] = useState('');
  const [searchMode, setSearchMode] = useState<'smart' | 'ai'>('smart');
  
  // 折叠控制
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  
  // 文档选择与预览
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState('');
  
  // 电影胶卷预览控制
  const [showFilmstrip, setShowFilmstrip] = useState(false);
  const hideTimeoutRef = useRef(null);
  const filmstripRef = useRef(null);
  
  const courseMaterials = [
    { id: 1, name: '数据结构与算法-第三章.pdf', pages: 45, type: 'PDF', uploaded: '2025-10-20', category: '课件' },
    { id: 2, name: '操作系统原理-课件.pptx', pages: 120, type: 'PPT', uploaded: '2025-10-18', category: '课件' },
    { id: 3, name: '计算机网络-教材.docx', pages: 280, type: 'DOCX', uploaded: '2025-10-15', category: '课本' },
  ];
  
  // 按分类组织材料
  const allMaterials = useMemo(() => {
    const categories = {};
    courseMaterials.forEach(material => {
      if (!categories[material.category]) {
        categories[material.category] = [];
      }
      categories[material.category].push({
        name: material.name,
        pages: material.pages,
        type: material.type
      });
    });
    return Object.entries(categories).map(([type, items]) => ({ type, items }));
  }, [courseMaterials]);
  
  const totalPages = selectedDoc?.pages ?? 0;
  const filmstripPages = useMemo(() => {
    if (!totalPages) return [];
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);
  
  // 延迟隐藏逻辑
  const handleShowFilmstrip = () => {
    if (!selectedDoc) return;
    setShowFilmstrip(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleHideFilmstrip = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    hideTimeoutRef.current = setTimeout(() => {
      setShowFilmstrip(false);
      hideTimeoutRef.current = null;
    }, 3000);
  };
  
  // 点击空白处关闭缩略图
  useEffect(() => {
    if (!showFilmstrip) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (filmstripRef.current && !filmstripRef.current.contains(e.target as Node)) {
        setShowFilmstrip(false);
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilmstrip]);

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
  
  const [uploadedImage, setUploadedImage] = useState(null);

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
    if (!question.trim() && !uploadedImage) return;
    
    const newMessage = {
      id: chatHistory.length + 1,
      type: 'user',
      content: question || '请帮我解答这道题目',
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setChatHistory([...chatHistory, newMessage]);
    setQuestion('');
    setUploadedImage(null);
    setSelectedText('');

    setTimeout(() => {
      const aiResponse = {
        id: chatHistory.length + 2,
        type: 'ai',
        content: searchMode === 'smart' 
          ? `已在课件第${Math.floor(Math.random() * 50 + 1)}页找到相关内容。这个知识点在"${selectedDoc?.name || '课件'}"中有详细讲解。`
          : selectedText
          ? `关于"${selectedText}"的解释：\n\n这部分内容涉及到重要的核心概念。根据课件内容，建议你复习相关章节的基础知识。`
          : '正在分析您的问题，并从课件中查找相关内容...',
        source: selectedDoc ? { page: currentPage, file: selectedDoc.name } : null,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
    <div className="flex gap-4 h-[calc(100vh-12rem)] relative">
      {/* 左侧可折叠：学习资料 */}
      <div className={`relative transition-all duration-300 ${isLeftCollapsed ? 'w-0 -ml-2' : 'w-64'} flex-shrink-0`}>
        {!isLeftCollapsed && (
          <Card className="w-64 p-4 h-full overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3>学习资料</h3>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsLeftCollapsed(true)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-3rem)] pr-2">
              <div className="space-y-4">
                {/* 上传区域 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-600 mb-2">上传课件</p>
                  <Button onClick={handleFileUpload} variant="outline" size="sm" className="h-7 text-xs">
                    选择文件
                  </Button>
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}
                </div>
                
                {/* 材料列表 */}
                {allMaterials.map((category) => (
                  <div key={category.type}>
                    <p className="text-sm text-gray-600 mb-2">{category.type}</p>
                    <div className="space-y-1">
                      {category.items.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedDoc({ type: category.type, name: item.name, pages: item.pages });
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                            selectedDoc?.name === item.name
                              ? 'bg-blue-100 text-blue-700'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <div className="flex-1 truncate">
                              <p className="truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.pages} 页</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {category !== allMaterials[allMaterials.length - 1] && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        )}
        {isLeftCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="absolute top-3 -right-2 z-10 rounded-r-none"
            onClick={() => setIsLeftCollapsed(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* 中间：AI 答疑 */}
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI 答疑
          </h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={searchMode === 'ai' ? 'default' : 'ghost'}
              onClick={() => setSearchMode('ai')}
              className="h-7 px-2 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI生成
            </Button>
            <Button
              size="sm"
              variant={searchMode === 'smart' ? 'default' : 'ghost'}
              onClick={() => setSearchMode('smart')}
              className="h-7 px-2 text-xs"
            >
              <Search className="w-3 h-3 mr-1" />
              智能检索
            </Button>
          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 pr-4 mb-4">
          <div className="space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                <p>选中文档内容或上传题目图片</p>
                <p className="mt-2">开始向AI提问</p>
              </div>
            ) : (
              chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.type === 'user'
                      ? 'bg-blue-100 text-blue-900 ml-8'
                      : 'bg-gray-100 text-gray-900 mr-8'
                  } p-3 rounded-lg text-sm whitespace-pre-wrap`}
                >
                  {message.content}
                  {message.source && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <Badge variant="secondary" className="bg-white/20 text-xs">
                        📄 {message.source.file} · P{message.source.page}
                      </Badge>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Image Preview */}
        {uploadedImage && (
          <div className="mb-3 relative">
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 p-0"
              onClick={() => setUploadedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            placeholder={
              selectedText
                ? `关于"${selectedText.slice(0, 20)}..."的问题`
                : '输入你的问题或上传题目图片...'
            }
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendQuestion();
              }
            }}
          />
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="chat-image-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label htmlFor="chat-image-upload">
              <Button size="sm" variant="outline" className="cursor-pointer" asChild>
                <span>
                  <ImageIcon className="w-4 h-4 mr-2" />
                  上传题目
                </span>
              </Button>
            </label>
            <Button size="sm" onClick={handleSendQuestion} className="flex-1">
              发送
            </Button>
          </div>
        </div>
      </Card>

      {/* 右侧可折叠：预览区 */}
      <div className={`relative transition-all duration-300 ${isRightCollapsed ? 'w-0 -mr-2' : 'w-[40%] min-w-[320px]'} flex-shrink-0`}>
        {!isRightCollapsed && (
          <Card className="p-4 h-full overflow-hidden relative">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 absolute top-3 -left-2 z-10 rounded-l-none"
              onClick={() => setIsRightCollapsed(true)}
              title="隐藏预览"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            {selectedDoc ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 pl-4 pr-2">
                  <div>
                    <h3 className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedDoc.type}</Badge>
                      {selectedDoc.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      第 {currentPage} / {selectedDoc.pages} 页
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentPage(Math.min(selectedDoc.pages, currentPage + 1));
                        handleShowFilmstrip();
                      }}
                      onMouseEnter={handleShowFilmstrip}
                      onMouseLeave={handleHideFilmstrip}
                      disabled={currentPage === selectedDoc.pages}
                      title="下一页"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Document Preview Area */}
                <div 
                  className="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden"
                  onMouseUp={() => {
                    const selection = window.getSelection()?.toString();
                    if (selection) {
                      setSelectedText(selection);
                    }
                  }}
                  onMouseEnter={handleShowFilmstrip}
                  onMouseLeave={handleHideFilmstrip}
                >
                  <div className="text-center p-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">{selectedDoc.name}</p>
                    <p className="text-sm text-gray-500">第 {currentPage} 页预览</p>
                    <p className="text-xs text-gray-400 mt-4">选中文字可以直接提问</p>
                  </div>
                </div>

                {selectedText && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs text-blue-600 mb-1">已选中内容：</p>
                        <p className="text-sm text-gray-700">{selectedText}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedText('')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileText className="w-20 h-20 mx-auto mb-4" />
                  <p>请从左侧选择要预览的文档</p>
                </div>
              </div>
            )}
          </Card>
        )}
        {isRightCollapsed && (
          <Button
            variant="outline"
            size="sm"
            className="absolute top-3 -left-2 z-10 rounded-l-none"
            onClick={() => setIsRightCollapsed(false)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>

    {/* 电影胶卷式预览条（固定在页面底部，横跨整个页面，顶层显示） */}
    {(() => {
      const shouldShow = showFilmstrip && selectedDoc && filmstripPages.length > 0;
      return shouldShow && typeof document !== 'undefined' && document.body && createPortal(
      <div
        ref={filmstripRef}
        className="fixed left-0 right-0 bottom-0 bg-white backdrop-blur-sm border-t border-gray-300 shadow-lg z-[9999]"
        onMouseEnter={handleShowFilmstrip}
        onMouseLeave={handleHideFilmstrip}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          display: 'block',
          opacity: 1,
          visibility: 'visible',
          zIndex: 9999,
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: '150px',
          width: '100%'
        }}
      >
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-3 px-4 py-4 h-full">
            {filmstripPages.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setCurrentPage(p);
                  handleShowFilmstrip();
                }}
                className={`flex-shrink-0 rounded-lg border-2 transition-all ${
                  p === currentPage 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md scale-105' 
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                } bg-gray-100 hover:scale-105 relative overflow-hidden`}
                style={{
                  width: '120px',
                  height: '120px',
                  minWidth: '120px',
                  minHeight: '120px'
                }}
                title={`第 ${p} 页`}
              >
                <span className="absolute top-2 left-2 text-xs px-2 py-1 rounded bg-black/70 text-white font-semibold z-10">
                  {p}
                </span>
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  预览
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>,
      document.body
      );
    })()}
    </>
  );
}
