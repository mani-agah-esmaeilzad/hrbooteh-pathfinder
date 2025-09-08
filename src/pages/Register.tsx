import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate registration - in real app this would be API call
    if (formData.password !== formData.confirmPassword) {
      alert("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-hrbooteh-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-hrbooteh-lg border-0 bg-hrbooteh-surface">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <Logo variant="large" />
          </div>
          <CardTitle className="text-2xl font-bold text-hrbooteh-text-primary">
            ثبت‌نام در hrbooteh
          </CardTitle>
          <CardDescription className="text-hrbooteh-text-secondary">
            حساب کاربری خود را ایجاد کنید و مسیر ارزیابی را شروع کنید
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-hrbooteh-text-primary font-medium">
                نام و نام خانوادگی
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="نام کامل خود را وارد کنید"
                value={formData.fullName}
                onChange={handleChange}
                className="bg-hrbooteh-surface border-hrbooteh-surface-elevated focus:border-hrbooteh-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-hrbooteh-text-primary font-medium">
                ایمیل
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@hrbooteh.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-hrbooteh-surface border-hrbooteh-surface-elevated focus:border-hrbooteh-primary"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-hrbooteh-text-primary font-medium">
                رمز عبور
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور قوی انتخاب کنید"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-hrbooteh-surface border-hrbooteh-surface-elevated focus:border-hrbooteh-primary pl-10"
                  required
                />
                <Button
                  type="button"
                  variant="hrbooteh-ghost"
                  size="icon-sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-hrbooteh-text-primary font-medium">
                تکرار رمز عبور
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="رمز عبور را مجدداً وارد کنید"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="bg-hrbooteh-surface border-hrbooteh-surface-elevated focus:border-hrbooteh-primary"
                required
              />
            </div>
            
            <Button
              type="submit"
              variant="hrbooteh-gradient"
              size="lg"
              className="w-full mt-6"
            >
              ثبت‌نام
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-hrbooteh-text-secondary text-sm">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <button
                onClick={() => navigate('/login')}
                className="text-hrbooteh-primary hover:text-hrbooteh-primary-hover font-medium underline-offset-4 hover:underline transition-colors"
              >
                وارد شوید
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;