import React from 'react';
import { Button, Avatar, AvatarFallback, AvatarImage, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shared/ui';
import { LogOut, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserDropdownProps {
  language: 'ko' | 'en';
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ language }) => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      language === 'ko' 
        ? '정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' 
        : 'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      const success = await deleteAccount();
      if (success) {
        navigate('/signin');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full group">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback className='group-hover:font-bold group-hover:text-black dark:group-hover:text-white'>
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.phone}
            </p>
            {user.level === 'admin' && (
              <p className="text-xs leading-none text-teal-400 font-semibold">
                {language === 'ko' ? '관리자' : 'Administrator'}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{language === 'ko' ? '로그아웃' : 'Logout'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteAccount} className="text-destructive focus:text-destructive">
          <UserX className="mr-2 h-4 w-4" />
          <span>{language === 'ko' ? '회원탈퇴' : 'Delete Account'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};