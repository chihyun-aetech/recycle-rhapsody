import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: '김철수',
    email: 'kimcs@example.com',
    phone: '010-1234-5678',
    role: '관리자',
    status: '활성',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20 14:30'
  },
  {
    id: 2,
    name: '이영희',
    email: 'leeyh@example.com',
    phone: '010-2345-6789',
    role: '사용자',
    status: '활성',
    joinDate: '2024-01-16',
    lastLogin: '2024-01-19 09:15'
  },
  {
    id: 3,
    name: '박민수',
    email: 'parkms@example.com',
    phone: '010-3456-7890',
    role: '사용자',
    status: '비활성',
    joinDate: '2024-01-17',
    lastLogin: '2024-01-18 16:45'
  },
  {
    id: 4,
    name: '정수진',
    email: 'jungsj@example.com',
    phone: '010-4567-8901',
    role: '사용자',
    status: '활성',
    joinDate: '2024-01-18',
    lastLogin: '2024-01-20 11:20'
  },
  {
    id: 5,
    name: '최동우',
    email: 'choidw@example.com',
    phone: '010-5678-9012',
    role: '매니저',
    status: '활성',
    joinDate: '2024-01-19',
    lastLogin: '2024-01-20 13:10'
  }
];

const AdminPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case '관리자':
        return 'bg-red-100 text-red-800';
      case '매니저':
        return 'bg-blue-100 text-blue-800';
      case '사용자':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '활성':
        return 'bg-green-100 text-green-800';
      case '비활성':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">사용자 관리</h1>
          <p className="text-gray-400 mt-1">시스템 사용자를 관리하고 권한을 설정하세요</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          새 사용자 추가
        </Button>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-white">사용자 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="이름, 이메일, 전화번호 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-700/50">
                  <TableHead className="text-gray-300">이름</TableHead>
                  <TableHead className="text-gray-300">이메일</TableHead>
                  <TableHead className="text-gray-300">전화번호</TableHead>
                  <TableHead className="text-gray-300">역할</TableHead>
                  <TableHead className="text-gray-300">상태</TableHead>
                  <TableHead className="text-gray-300">가입일</TableHead>
                  <TableHead className="text-gray-300">최근 로그인</TableHead>
                  <TableHead className="text-gray-300 w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-700/30">
                    <TableCell className="text-white font-medium">{user.name}</TableCell>
                    <TableCell className="text-gray-300">{user.email}</TableCell>
                    <TableCell className="text-gray-300">{user.phone}</TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{user.joinDate}</TableCell>
                    <TableCell className="text-gray-300">{user.lastLogin}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white">
                            <Edit className="w-4 h-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-300">
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <div className="text-sm text-gray-400">전체 사용자</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {users.filter(u => u.status === '활성').length}
              </div>
              <div className="text-sm text-gray-400">활성 사용자</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {users.filter(u => u.role === '관리자').length}
              </div>
              <div className="text-sm text-gray-400">관리자</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {users.filter(u => u.role === '매니저').length}
              </div>
              <div className="text-sm text-gray-400">매니저</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;