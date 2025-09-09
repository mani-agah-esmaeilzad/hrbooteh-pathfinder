import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - in real app this would be API call
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
            ورود به hrbooteh
          </CardTitle>
          <CardDescription className="text-hrbooteh-text-secondary">
            برای ادامه مسیر ارزیابی خود وارد شوید
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-hrbooteh-text-primary font-medium">
                ایمیل
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@hrbooteh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="رمز عبور خود را وارد کنید"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            
            <Button
              type="submit"
              variant="hrbooteh"
              size="lg"
              className="w-full mt-6"
            >
              ورود
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-hrbooteh-text-secondary text-sm">
              حساب کاربری ندارید؟{" "}
              <button
                onClick={() => navigate('/register')}
                className="text-hrbooteh-primary hover:text-hrbooteh-primary-hover font-medium underline-offset-4 hover:underline transition-colors"
              >
                ثبت‌نام کنید
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;