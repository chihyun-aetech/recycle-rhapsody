import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal, Shield } from 'lucide-react';
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

// Mock IP data
const mockIPs = [
  {
    id: 1,
    ip: '192.168.1.100',
    location: '서울, 대한민국',
    lastAccess: '2024-01-20 14:30',
    status: '허용',
    attempts: 3,
    device: 'Windows PC'
  },
  {
    id: 2,
    ip: '203.241.185.45',
    location: '부산, 대한민국',
    lastAccess: '2024-01-20 11:15',
    status: '차단',
    attempts: 15,
    device: 'Mobile'
  },
  {
    id: 3,
    ip: '10.0.0.25',
    location: '인천, 대한민국',
    lastAccess: '2024-01-19 16:45',
    status: '허용',
    attempts: 1,
    device: 'Mac'
  },
  {
    id: 4,
    ip: '172.16.0.150',
    location: '대구, 대한민국',
    lastAccess: '2024-01-20 09:20',
    status: '모니터링',
    attempts: 8,
    device: 'Linux'
  }
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [ipSearchTerm, setIpSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [ips, setIps] = useState(mockIPs);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.phone.includes(userSearchTerm)
  );

  const filteredIPs = ips.filter(ip =>
    ip.ip.includes(ipSearchTerm) ||
    ip.location.toLowerCase().includes(ipSearchTerm.toLowerCase()) ||
    ip.device.toLowerCase().includes(ipSearchTerm.toLowerCase())
  );

  const getIPStatusColor = (status: string) => {
    switch (status) {
      case '허용':
        return 'bg-green-100 text-green-800';
      case '차단':
        return 'bg-red-100 text-red-800';
      case '모니터링':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-teal-400">관리자 대시보드</h1>
          <p className="text-gray-400 mt-1">시스템 사용자 및 보안을 관리하세요</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
          <TabsTrigger 
            value="users" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-300"
          >
            User List
          </TabsTrigger>
          <TabsTrigger 
            value="ips" 
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-gray-300"
          >
            IP List
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-teal-400">사용자 관리</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="이름, 이메일, 전화번호 검색..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-600 border-gray-500 text-white placeholder:text-gray-400 w-80"
                    />
                  </div>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    사용자 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-600 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600 hover:bg-gray-600/50">
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
                      <TableRow key={user.id} className="border-gray-600 hover:bg-gray-600/30">
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
                            <DropdownMenuContent align="end" className="bg-gray-700 border-gray-600">
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-600 hover:text-white">
                                <Edit className="w-4 h-4 mr-2" />
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-gray-600 hover:text-red-300">
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

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{users.length}</div>
                  <div className="text-sm text-gray-400">전체 사용자</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">
                    {users.filter(u => u.status === '활성').length}
                  </div>
                  <div className="text-sm text-gray-400">활성 사용자</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {users.filter(u => u.role === '관리자').length}
                  </div>
                  <div className="text-sm text-gray-400">관리자</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
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
        </TabsContent>

        <TabsContent value="ips" className="mt-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-teal-400">IP 관리</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="IP, 위치, 디바이스 검색..."
                      value={ipSearchTerm}
                      onChange={(e) => setIpSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-600 border-gray-500 text-white placeholder:text-gray-400 w-80"
                    />
                  </div>
                  <Button className="bg-teal-500 hover:bg-teal-600">
                    <Shield className="w-4 h-4 mr-2" />
                    IP 차단
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-gray-600 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-600 hover:bg-gray-600/50">
                      <TableHead className="text-gray-300">IP 주소</TableHead>
                      <TableHead className="text-gray-300">위치</TableHead>
                      <TableHead className="text-gray-300">디바이스</TableHead>
                      <TableHead className="text-gray-300">상태</TableHead>
                      <TableHead className="text-gray-300">접근 시도</TableHead>
                      <TableHead className="text-gray-300">최근 접근</TableHead>
                      <TableHead className="text-gray-300 w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIPs.map((ip) => (
                      <TableRow key={ip.id} className="border-gray-600 hover:bg-gray-600/30">
                        <TableCell className="text-white font-medium font-mono">{ip.ip}</TableCell>
                        <TableCell className="text-gray-300">{ip.location}</TableCell>
                        <TableCell className="text-gray-300">{ip.device}</TableCell>
                        <TableCell>
                          <Badge className={getIPStatusColor(ip.status)}>
                            {ip.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{ip.attempts}회</TableCell>
                        <TableCell className="text-gray-300">{ip.lastAccess}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-gray-700 border-gray-600">
                              <DropdownMenuItem className="text-gray-300 hover:bg-gray-600 hover:text-white">
                                <Shield className="w-4 h-4 mr-2" />
                                차단
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 hover:bg-gray-600 hover:text-red-300">
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

          {/* IP Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{ips.length}</div>
                  <div className="text-sm text-gray-400">총 IP</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-400">
                    {ips.filter(ip => ip.status === '허용').length}
                  </div>
                  <div className="text-sm text-gray-400">허용된 IP</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {ips.filter(ip => ip.status === '차단').length}
                  </div>
                  <div className="text-sm text-gray-400">차단된 IP</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {ips.filter(ip => ip.status === '모니터링').length}
                  </div>
                  <div className="text-sm text-gray-400">모니터링</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;