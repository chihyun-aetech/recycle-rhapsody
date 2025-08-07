import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, UserX } from 'lucide-react';

interface UserDropdownProps {
  language: 'ko' | 'en';
}

export const UserDropdown: React.FC<UserDropdownProps> = ({ language }) => {
  // Mock user data - replace with actual user data from context/auth
  const userData = {
    name: "김철수",
    email: "kimcs@aetech.com",
    phone: "010-1234-5678"
  };

  const handleLogout = () => {
    // TODO: Implement logout logic with Supabase
    console.log('Logout clicked');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic with Supabase
    console.log('Delete account clicked');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={userData.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData.phone}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{language === 'ko' ? '로그아웃' : 'Logout'}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-600">
          <UserX className="mr-2 h-4 w-4" />
          <span>{language === 'ko' ? '회원탈퇴' : 'Delete Account'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};