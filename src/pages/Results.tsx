import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { useAssessment } from "@/contexts/assessment-context";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Share2, BarChart3, TrendingUp, Award, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Results = () => {
  const { assessments } = useAssessment();
  const navigate = useNavigate();

  const completedAssessments = assessments.filter(a => a.status === 'completed');
  const completionRate = (completedAssessments.length / assessments.length) * 100;

  // Mock data for results - in real app this would come from API
  const mockResults = {
    independence: { score: 85, level: "عالی", description: "شما در بیشتر موقعیت‌ها قابلیت تصمیم‌گیری مستقل و خودکفایی بالایی دارید." },
    confidence: { score: 78, level: "خوب", description: "سطح اعتماد به نفس شما در حد مطلوب است و در اکثر شرایط به تصمیماتتان اطمینان دارید." },
    negotiation: { score: 72, level: "متوسط", description: "مهارت‌های مذاکره شما قابل توجه است اما جای بهبود در برخی زمینه‌ها وجود دارد." },
    leadership: { score: 88, level: "عالی", description: "شما ویژگی‌های رهبری قوی و قابلیت هدایت تیم در سطح بالایی دارید." },
    communication: { score: 91, level: "فوق‌العاده", description: "مهارت‌های ارتباطی شما در سطح بسیار بالا قرار دارد و در برقراری ارتباط موثر موفق هستید." }
  };

  const overallScore = Math.round(
    completedAssessments.reduce((sum, assessment) => 
      sum + (mockResults[assessment.id as keyof typeof mockResults]?.score || 0), 0
    ) / completedAssessments.length
  );

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-hrbooteh-success";
    if (score >= 70) return "text-hrbooteh-primary";
    if (score >= 50) return "text-hrbooteh-warning";
    return "text-destructive";
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return "bg-hrbooteh-success/10 border-hrbooteh-success/20";
    if (score >= 70) return "bg-hrbooteh-primary/10 border-hrbooteh-primary/20";
    if (score >= 50) return "bg-hrbooteh-warning/10 border-hrbooteh-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="min-h-screen bg-hrbooteh-gradient-subtle">
      {/* Header */}
      <header className="bg-hrbooteh-surface shadow-hrbooteh-sm border-b border-hrbooteh-surface-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="hrbooteh-ghost" 
                size="icon-sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Logo variant="large" />
            </div>
            <div className="flex gap-3">
              <Button variant="hrbooteh-outline" size="sm">
                <Share2 className="w-4 h-4 ml-2" />
                اشتراک‌گذاری
              </Button>
              <Button variant="hrbooteh" size="sm">
                <Download className="w-4 h-4 ml-2" />
                دانلود گزارش
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-hrbooteh-gradient-primary rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-hrbooteh-text-primary mb-4">
              گزارش نهایی ارزیابی‌های hrbooteh
            </h1>
            <p className="text-lg text-hrbooteh-text-secondary max-w-2xl mx-auto">
              تبریک! شما مسیر جامع ارزیابی مهارت‌های حرفه‌ای را با موفقیت تکمیل کرده‌اید. در ادامه نتایج تفصیلی شما را مشاهده می‌کنید.
            </p>
          </div>

          {/* Overall Score Card */}
          <Card className="shadow-hrbooteh-lg border-0 bg-hrbooteh-surface">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl text-hrbooteh-text-primary">نمره کلی شما</CardTitle>
              <CardDescription>بر اساس تمام ارزیابی‌های انجام شده</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-hrbooteh-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{overallScore}</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-hrbooteh-surface px-3 py-1 rounded-full border border-hrbooteh-surface-elevated">
                    <span className="text-sm font-medium text-hrbooteh-text-secondary">از ۱۰۰</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-hrbooteh-surface-elevated rounded-lg">
                  <BarChart3 className="w-8 h-8 text-hrbooteh-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-hrbooteh-text-primary">{completedAssessments.length}</div>
                  <div className="text-sm text-hrbooteh-text-secondary">ارزیابی تکمیل شده</div>
                </div>
                <div className="text-center p-4 bg-hrbooteh-surface-elevated rounded-lg">
                  <TrendingUp className="w-8 h-8 text-hrbooteh-success mx-auto mb-2" />
                  <div className="text-2xl font-bold text-hrbooteh-text-primary">{Math.round(completionRate)}%</div>
                  <div className="text-sm text-hrbooteh-text-secondary">درصد تکمیل</div>
                </div>
                <div className="text-center p-4 bg-hrbooteh-surface-elevated rounded-lg">
                  <User className="w-8 h-8 text-hrbooteh-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-hrbooteh-text-primary">
                    {overallScore >= 85 ? "عالی" : overallScore >= 70 ? "خوب" : "متوسط"}
                  </div>
                  <div className="text-sm text-hrbooteh-text-secondary">سطح کلی</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card className="shadow-hrbooteh-lg border-0 bg-hrbooteh-surface">
            <CardHeader>
              <CardTitle className="text-xl text-hrbooteh-text-primary">
                نتایج تفصیلی ارزیابی‌ها
              </CardTitle>
              <CardDescription>
                برای مشاهده جزئیات هر ارزیابی روی آن کلیک کنید
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {completedAssessments.map((assessment) => {
                  const result = mockResults[assessment.id as keyof typeof mockResults];
                  if (!result) return null;

                  return (
                    <AccordionItem 
                      key={assessment.id} 
                      value={assessment.id}
                      className={`border rounded-lg p-4 ${getScoreBackground(result.score)}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full ml-4">
                          <div className="text-right">
                            <h3 className="font-semibold text-hrbooteh-text-primary">
                              {assessment.title}
                            </h3>
                            <p className="text-sm text-hrbooteh-text-secondary">
                              {assessment.description}
                            </p>
                          </div>
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                              {result.score}
                            </div>
                            <div className="text-xs text-hrbooteh-text-muted">
                              {result.level}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-4 border-t border-hrbooteh-surface-elevated mt-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-hrbooteh-text-primary mb-2">تحلیل نتیجه</h4>
                            <p className="text-hrbooteh-text-secondary leading-relaxed">
                              {result.description}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-hrbooteh-text-primary mb-2">پیشنهادات بهبود</h4>
                            <ul className="text-hrbooteh-text-secondary space-y-1 text-sm">
                              <li>• شرکت در کارگاه‌های تخصصی مرتبط</li>
                              <li>• تمرین مهارت‌ها در موقعیت‌های واقعی</li>
                              <li>• مطالعه منابع تخصصی در این حوزه</li>
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>

          {/* Action Section */}
          <div className="text-center space-y-4">
            <p className="text-hrbooteh-text-secondary">
              برای ادامه مسیر توسعه حرفه‌ای خود می‌توانید مجدداً ارزیابی‌ها را انجام دهید
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                variant="hrbooteh-outline" 
                size="lg"
                onClick={() => navigate('/dashboard')}
              >
                بازگشت به داشبورد
              </Button>
              <Button 
                variant="hrbooteh" 
                size="lg"
                onClick={() => window.location.reload()}
              >
                شروع مجدد ارزیابی‌ها
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;