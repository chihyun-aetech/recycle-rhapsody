import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SignUp = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-center text-white text-xl">
            Welcome to Aetech Data Labeling System!
          </DialogTitle>
          <p className="text-center text-gray-300 text-sm">
            Please enter the information.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              placeholder="E-mail"
              className="bg-gray-200 border-gray-600 text-gray-900"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
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
              <Label htmlFor="passwordCheck" className="text-white">
                Password Check <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="passwordCheck"
                  type={showPasswordCheck ? "text" : "password"}
                  placeholder="Password Check"
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
              <Label htmlFor="name" className="text-white">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Name"
                className="bg-gray-200 border-gray-600 text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="010-1000-1000"
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
            <Button className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
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

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center pb-8">
          <h1 className="text-4xl font-light text-emerald-400 mb-8">aetech</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="User ID"
              className="bg-gray-200 border-gray-600 text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="border-gray-400"
            />
            <Label htmlFor="remember" className="text-white text-sm">
              아이디 저장
            </Label>
          </div>
          
          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
            Log in
          </Button>
          
          <div className="text-center">
            <Button
              variant="link"
              className="text-emerald-400 hover:text-emerald-300"
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
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