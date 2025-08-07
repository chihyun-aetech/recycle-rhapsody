import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const SignUp = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordCheck: '',
    name: '',
    phone: ''
  });

  const handleSubmit = () => {
    if (formData.password !== formData.passwordCheck) {
      toast({
        title: "비밀번호 확인",
        description: "비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "회원가입 완료",
      description: "성공적으로 가입되었습니다.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800 text-xl font-semibold">
            Aetech 회원가입
          </DialogTitle>
          <p className="text-center text-gray-600 text-sm">
            회원 정보를 입력해주세요
          </p>
        </DialogHeader>
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-gray-700 font-medium">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signup-email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-gray-700 font-medium">
                비밀번호 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-passwordCheck" className="text-gray-700 font-medium">
                비밀번호 확인 <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="signup-passwordCheck"
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="비밀번호 확인"
                  value={formData.passwordCheck}
                  onChange={(e) => setFormData(prev => ({ ...prev, passwordCheck: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900 focus:border-blue-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-100"
                  onClick={() => setShowPasswordCheck(!showPasswordCheck)}
                >
                  {showPasswordCheck ? (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="text-gray-700 font-medium">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-name"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-phone" className="text-gray-700 font-medium">
                전화번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-phone"
                placeholder="010-0000-0000"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-white border-gray-300 text-gray-900 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-8">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              취소
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-6 bg-blue-500 hover:bg-blue-600 text-white"
            >
              가입하기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === 'admin@aetech.co.kr' && password === 'admin1234') {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('userEmail', email);
      toast({
        title: "로그인 성공",
        description: "관리자로 로그인되었습니다.",
      });
      navigate('/');
    } else {
      toast({
        title: "로그인 실패",
        description: "아이디 또는 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <h1 className="text-4xl font-light text-white mb-2">aetech</h1>
          <p className="text-white/70 text-sm">Data Labeling System</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/90 text-sm">이메일</Label>
            <Input
              id="email"
              placeholder="admin@aetech.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/90 text-sm">비밀번호</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="admin1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-white/10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-white/70" />
                ) : (
                  <Eye className="h-4 w-4 text-white/70" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-white/40 data-[state=checked]:bg-blue-500"
            />
            <Label htmlFor="remember" className="text-white/90 text-sm">
              아이디 저장
            </Label>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 shadow-lg"
          >
            로그인
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              className="text-blue-300 hover:text-blue-200"
              onClick={() => setShowSignUp(true)}
            >
              회원가입
            </Button>
          </div>
        </CardContent>
        
        <div className="text-center pb-6 text-gray-400 text-sm">
          <div>Version 1.0.0</div>
          <div>Copyright 2020-2025 © Aetech All RIGHT RESERVED</div>
        </div>
      </Card>
      
      <SignUp isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </div>
  );
};

export default SignIn;