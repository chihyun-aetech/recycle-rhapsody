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
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <div className="text-right mb-4">
            <span className="text-teal-400 text-lg font-light">Atronet</span>
          </div>
          <DialogTitle className="text-center text-white text-xl font-semibold">
            Welcome to Atronet Data Labeling System!
          </DialogTitle>
          <p className="text-center text-gray-300 text-sm">
            Please enter the information.
          </p>
        </DialogHeader>
        <div className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="signup-email" className="text-white">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="signup-email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-gray-200 border-gray-600 text-gray-900"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-white">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="bg-gray-200 border-gray-600 text-gray-900 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
              <Label htmlFor="signup-passwordCheck" className="text-white">
                Password Check <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="signup-passwordCheck"
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="Password Check"
                  value={formData.passwordCheck}
                  onChange={(e) => setFormData(prev => ({ ...prev, passwordCheck: e.target.value }))}
                  className="bg-gray-200 border-gray-600 text-gray-900 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
              <Label htmlFor="signup-name" className="text-white">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-200 border-gray-600 text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="signup-phone" className="text-white">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="signup-phone"
                placeholder="010-1000-1000"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-gray-200 border-gray-600 text-gray-900"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button
              onClick={onClose}
              variant="secondary"
              className="px-8 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="px-8 bg-teal-500 hover:bg-teal-600 text-white"
            >
              Join
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
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border border-gray-600 shadow-lg">
        <CardHeader className="text-center pb-8">
          <h1 className="text-4xl font-light text-teal-400 mb-2">Atronet</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              id="email"
              placeholder="admin@aetech.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-200 border-gray-300 text-gray-900 placeholder:text-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-200 border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
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
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-gray-400 data-[state=checked]:bg-teal-500"
            />
            <Label htmlFor="remember" className="text-white text-sm">
              아이디 저장
            </Label>
          </div>
          
          <Button 
            onClick={handleLogin}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3"
          >
            Log in
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              className="text-teal-400 hover:text-teal-300"
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
        </CardContent>
        
        <div className="text-center pb-6 text-gray-400 text-sm">
          <div>Version 1.0.0</div>
          <div>Copyright 2020-2025 © Atronet All RIGHT RESERVED</div>
        </div>
      </Card>
      
      <SignUp isOpen={showSignUp} onClose={() => setShowSignUp(false)} />
    </div>
  );
};

export default SignIn;