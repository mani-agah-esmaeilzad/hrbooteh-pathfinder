import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { ProgressTimeline, TimelineStep } from "@/components/ui/progress-timeline";
import { useAssessment } from "@/contexts/assessment-context";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";

const Dashboard = () => {
  const { assessments, currentAssessment } = useAssessment();
  const navigate = useNavigate();

  const timelineSteps: TimelineStep[] = assessments.map(assessment => ({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    status: assessment.status
  }));

  const handleStartAssessment = () => {
    if (currentAssessment) {
      navigate(currentAssessment.path);
    }
  };

  const completedCount = assessments.filter(a => a.status === 'completed').length;
  const totalCount = assessments.length;

  return (
    <div className="min-h-screen bg-hrbooteh-gradient-subtle">
      {/* Header */}
      <header className="bg-hrbooteh-surface shadow-hrbooteh-sm border-b border-hrbooteh-surface-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="large" />
            <Button variant="hrbooteh-ghost" size="icon-sm">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-hrbooteh-text-primary mb-4">
              مسیر ارزیابی شما در hrbooteh
            </h1>
            <p className="text-hrbooteh-text-secondary text-lg">
              شما در حال طی کردن یک مسیر جامع ارزیابی مهارت‌های حرفه‌ای هستید
            </p>
            
            {/* Progress Overview */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-hrbooteh-primary">
                  {completedCount}
                </div>
                <div className="text-sm text-hrbooteh-text-secondary">
                  تکمیل شده
                </div>
              </div>
              <div className="w-px h-8 bg-hrbooteh-surface-elevated"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-hrbooteh-text-primary">
                  {totalCount}
                </div>
                <div className="text-sm text-hrbooteh-text-secondary">
                  مجموع ارزیابی‌ها
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <Card className="p-8 shadow-hrbooteh-lg border-0 bg-hrbooteh-surface mb-8">
            <h2 className="text-xl font-semibold text-hrbooteh-text-primary mb-6 text-center">
              وضعیت پیشرفت شما
            </h2>
            <ProgressTimeline steps={timelineSteps} />
          </Card>

          {/* Action Section */}
          {currentAssessment && (
            <div className="text-center">
              <Button
                variant="hrbooteh-gradient"
                size="xl"
                onClick={handleStartAssessment}
                className="min-w-[300px] group"
              >
                <ArrowLeft className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                شروع ارزیابی بعدی
              </Button>
              <p className="text-hrbooteh-text-secondary mt-4">
                آماده برای شروع: {currentAssessment.title}
              </p>
            </div>
          )}

          {/* Completed Message */}
          {!currentAssessment && completedCount === totalCount && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-hrbooteh-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-hrbooteh-success mb-2">
                  تبریک! مسیر ارزیابی تکمیل شد
                </h2>
                <p className="text-hrbooteh-text-secondary">
                  تمام ارزیابی‌ها با موفقیت انجام شده‌اند
                </p>
              </div>
              <Button
                variant="hrbooteh"
                size="lg"
                onClick={() => navigate('/results')}
              >
                مشاهده گزارش نهایی
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;