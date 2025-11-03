import React, { useMemo, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, MessageSquare, Upload, Search, Sparkles, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ExamDocReaderProps {
  examName: string;
  materials: {
    courseware: Array<{ name: string; pages: number }>;
    textbooks: Array<{ name: string; pages: number }>;
    homework: Array<{ name: string; pages: number }>;
    pastExams: Array<{ name: string; pages: number }>;
  };
}

export function ExamDocReader({ examName, materials }: ExamDocReaderProps) {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedText, setSelectedText] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  // 折叠控制
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // 电影胶卷预览控制
  const [showFilmstrip, setShowFilmstrip] = useState(false);
  const hideTimeoutRef = useRef(null);

  const allMaterials = [
    { type: '课件', items: materials.courseware },
    { type: '课本', items: materials.textbooks },
    { type: '作业题', items: materials.homework },
    { type: '往年题', items: materials.pastExams },
  ];

  const totalPages = selectedDoc?.pages ?? 0;
  const filmstripPages = useMemo(() => {
    if (!totalPages) return [];
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  // 延迟隐藏逻辑
  const handleShowFilmstrip = () => {
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

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // 键盘触发（→ 或 PageDown 显示胶卷条）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleShowFilmstrip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !uploadedImage) return;

    const newMessage = {
      role: 'user' as const,
      content: inputMessage || '请帮我解答这道题目',
    };

    setChatMessages([...chatMessages, newMessage]);

    setTimeout(() => {
      const aiResponse = {
        role: 'ai' as const,
        content: isSearchMode 
          ? `已在课件第${Math.floor(Math.random() * 50 + 1)}页找到相关内容。这个知识点在"${selectedDoc?.name || '数据结构课件'}"中有详细讲解。`
          : selectedText
          ? `关于"${selectedText}"的解释：\n\n这部分内容涉及到重要的核心概念。根据课件内容，建议你复习相关章节的基础知识。`
          : `根据题目内容，这道题考查的是核心知识点。让我为你详细解答...\n\n解题思路：\n1. 首先理解题目要求\n2. 应用相关公式或算法\n3. 得出结论`,
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
    setUploadedImage(null);
    setSelectedText('');
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

      {/* 中间：对话框（AI 答疑） */}
      <Card className="flex-1 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h3 className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            AI 答疑
          </h3>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={!isSearchMode ? 'default' : 'ghost'}
              onClick={() => setIsSearchMode(false)}
              className="h-7 px-2 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI生成
            </Button>
            <Button
              size="sm"
              variant={isSearchMode ? 'default' : 'ghost'}
              onClick={() => setIsSearchMode(true)}
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
            {chatMessages.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-8">
                <p>选中文档内容或上传题目图片</p>
                <p className="mt-2">开始向AI提问</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${
                    msg.role === 'user'
                      ? 'bg-blue-100 text-blue-900 ml-8'
                      : 'bg-gray-100 text-gray-900 mr-8'
                  } p-3 rounded-lg text-sm whitespace-pre-wrap`}
                >
                  {msg.content}
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
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
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
            <Button size="sm" onClick={handleSendMessage} className="flex-1">
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
                    <div
                      className="inline-flex"
                      onMouseEnter={handleShowFilmstrip}
                      onMouseLeave={handleHideFilmstrip}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(selectedDoc.pages, currentPage + 1))}
                        disabled={currentPage === selectedDoc.pages}
                        title="下一页"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
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

    {/* 电影胶卷式预览条（固定在页面底部，Portal 渲染） */}
    {showFilmstrip && selectedDoc && createPortal(
      <div
        className="fixed left-0 right-0 bottom-0 h-28 bg-white/95 backdrop-blur-sm border-t border-gray-300 shadow-lg z-[9999] transition-opacity duration-300"
        onMouseEnter={handleShowFilmstrip}
        onMouseLeave={handleHideFilmstrip}
      >
        <div className="h-full overflow-x-auto overflow-y-hidden">
          <div className="flex items-center gap-3 px-4 py-3 h-full">
            {filmstripPages.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setCurrentPage(p);
                  handleShowFilmstrip();
                }}
                className={`flex-shrink-0 w-28 h-20 rounded-lg border-2 transition-all ${
                  p === currentPage 
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md scale-105' 
                    : 'border-gray-300 hover:border-blue-400 hover:shadow'
                } bg-gray-100 hover:scale-105 relative overflow-hidden`}
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
    )}
    </>
  );
}
