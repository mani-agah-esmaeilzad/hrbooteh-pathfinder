import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatBubble } from "@/components/ui/chat-bubble";
import { Logo } from "@/components/ui/logo";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowUp, Mic, Clock, ArrowLeft } from "lucide-react";
import { useAssessment } from "@/contexts/assessment-context";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  senderName: string;
}

const AssessmentChat = () => {
  const { assessmentId } = useParams();
  const { assessments, updateAssessmentStatus } = useAssessment();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentAssessment = assessments.find(a => a.id === assessmentId);

  // Initialize with welcome message
  useEffect(() => {
    if (currentAssessment) {
      const welcomeMessage: Message = {
        id: "welcome",
        text: `سلام! من دکتر احمدی هستم و امروز قصد دارم با شما در مورد ${currentAssessment.title} صحبت کنم. این ارزیابی حدود ۱۵ دقیقه طول می‌کشد و من چندین سوال از شما خواهم پرسید.\n\nآماده هستید که شروع کنیم؟`,
        isUser: false,
        timestamp: new Date(),
        senderName: "دکتر احمدی"
      };
      setMessages([welcomeMessage]);
    }
  }, [currentAssessment]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - complete assessment
          handleAssessmentComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      senderName: "شما"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "بسیار جالب. می‌توانید بیشتر توضیح دهید؟",
        "متوجه شدم. در چنین شرایطی چگونه احساس می‌کنید؟",
        "این نکته بسیار مهمی است. چه عواملی باعث این تصمیم شما شد؟",
        "درسته. آیا تجربه مشابهی قبلاً داشته‌اید؟",
        "عالی است. حالا بگویید در موقعیت‌های مشابه چگونه عمل می‌کنید؟"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
        senderName: "دکتر احمدی"
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleAssessmentComplete = () => {
    if (currentAssessment) {
      updateAssessmentStatus(currentAssessment.id, 'completed');
      navigate(`/transition/${currentAssessment.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentAssessment) {
    return (
      <div className="min-h-screen bg-hrbooteh-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-hrbooteh-text-primary mb-4">
            ارزیابی یافت نشد
          </h1>
          <Button variant="hrbooteh" onClick={() => navigate('/dashboard')}>
            بازگشت به داشبورد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hrbooteh-background flex flex-col">
      {/* Header */}
      <header className="bg-hrbooteh-surface shadow-hrbooteh-sm border-b border-hrbooteh-surface-elevated p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="hrbooteh-ghost" 
              size="icon-sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-hrbooteh-text-primary">
                {currentAssessment.title}
              </h1>
              <p className="text-sm text-hrbooteh-text-secondary">
                در حال گفتگو با دکتر احمدی
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-hrbooteh-text-primary">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm font-medium">
                {formatTime(timeLeft)}
              </span>
            </div>
            <Logo variant="small" />
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 pb-24">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              senderName={message.senderName}
              timestamp={message.timestamp}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="bg-hrbooteh-chat-ai border border-hrbooteh-chat-ai-border rounded-xl px-4 py-3 max-w-[80%]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-hrbooteh-text-muted rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-hrbooteh-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-hrbooteh-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-hrbooteh-surface border-t border-hrbooteh-surface-elevated p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <Button
              variant="hrbooteh-ghost"
              size="icon"
              className="shrink-0"
            >
              <Mic className="w-5 h-5" />
            </Button>
            
            <div className="flex-1">
              <Textarea
                placeholder="پیام خود را اینجا بنویسید..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[48px] max-h-32 resize-none bg-hrbooteh-surface border-hrbooteh-surface-elevated focus:border-hrbooteh-primary"
                disabled={isLoading}
              />
            </div>
            
            <Button
              variant="hrbooteh"
              size="icon"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="shrink-0"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-sm text-hrbooteh-text-secondary">
            <span>Enter برای ارسال، Shift+Enter برای خط جدید</span>
            <Button
              variant="hrbooteh-success"
              size="sm"
              onClick={handleAssessmentComplete}
              className="text-xs"
            >
              اتمام ارزیابی
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AssessmentChat;