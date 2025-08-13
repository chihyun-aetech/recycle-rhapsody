import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal, Shield, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Types
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  joinDate: string;
  lastLogin: string;
}

interface IPRecord {
  id: number;
  ip: string;
  location: string;
  lastAccess: string;
  status: string;
  attempts: number;
  device: string;
}

// Mock user data
const mockUsers: User[] = [
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

// Mock IP data (화이트리스트에 등록된 허용 IP들)
const mockIPs: IPRecord[] = [
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
    ip: '10.0.0.25',
    location: '인천, 대한민국',
    lastAccess: '2024-01-19 16:45',
    status: '허용',
    attempts: 1,
    device: 'Mac'
  },
  {
    id: 3,
    ip: '172.16.0.0/24',
    location: '대구, 대한민국 (네트워크 대역)',
    lastAccess: '2024-01-20 09:20',
    status: '허용',
    attempts: 12,
    device: '내부 네트워크'
  },
  {
    id: 4,
    ip: '203.241.185.45',
    location: '부산, 대한민국',
    lastAccess: '2024-01-18 13:15',
    status: '허용',
    attempts: 5,
    device: 'Mobile'
  }
];

export const AdminTab = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [ipSearchTerm, setIpSearchTerm] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [ips, setIps] = useState(mockIPs);

  // User modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '사용자',
    status: '활성'
  });

  // IP modal states  
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [allowIpAddress, setAllowIpAddress] = useState('');

  // Filter functions
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

  // User management functions
  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        name: '',
        email: '',
        phone: '',
        role: '사용자',
        status: '활성'
      });
    }
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: '사용자',
      status: '활성'
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userFormData }
          : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userFormData,
        joinDate: new Date().toLocaleDateString('ko-KR'),
        lastLogin: '없음'
      };
      setUsers([...users, newUser]);
    }
    
    closeUserModal();
  };

  const deleteUser = (userId: number) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // IP management functions (화이트리스트 방식)
  const openIpModal = () => {
    setAllowIpAddress('');
    setIsIpModalOpen(true);
  };

  const closeIpModal = () => {
    setIsIpModalOpen(false);
    setAllowIpAddress('');
  };

  const handleIpAllow = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!allowIpAddress.trim()) return;
    
    // 이미 존재하는 IP인지 확인
    const existingIp = ips.find(ip => ip.ip === allowIpAddress);
    if (existingIp) {
      alert('이미 등록된 IP 주소입니다.');
      return;
    }
    
    const newIp: IPRecord = {
      id: Math.max(...ips.map(ip => ip.id)) + 1,
      ip: allowIpAddress,
      location: '알 수 없음',
      lastAccess: new Date().toLocaleString('ko-KR'),
      status: '허용',
      attempts: 0,
      device: '알 수 없음'
    };
    
    setIps([...ips, newIp]);
    closeIpModal();
  };

  const changeIpStatus = (ipId: number, newStatus: string) => {
    setIps(ips.map(ip => 
      ip.id === ipId 
        ? { ...ip, status: newStatus }
        : ip
    ));
  };

  const deleteIp = (ipId: number) => {
    if (confirm('정말로 이 IP를 삭제하시겠습니까?')) {
      setIps(ips.filter(ip => ip.id !== ipId));
    }
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">관리자 대시보드</h1>
          <p className="text-muted-foreground mt-1">사용자 관리 및 IP 화이트리스트를 관리하세요</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            User List
          </TabsTrigger>
          <TabsTrigger value="ips">
            IP List
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>사용자 관리</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="이름, 이메일, 전화번호 검색..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button onClick={() => openUserModal()}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    사용자 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>이름</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>전화번호</TableHead>
                      <TableHead>역할</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>가입일</TableHead>
                      <TableHead>최근 로그인</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
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
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openUserModal(user)}>
                                <Edit className="w-4 h-4 mr-2" />
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteUser(user.id)}
                              >
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
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{users.length}</div>
                  <div className="text-sm text-muted-foreground">전체 사용자</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {users.filter(u => u.status === '활성').length}
                  </div>
                  <div className="text-sm text-muted-foreground">활성 사용자</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {users.filter(u => u.role === '관리자').length}
                  </div>
                  <div className="text-sm text-muted-foreground">관리자</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {users.filter(u => u.role === '매니저').length}
                  </div>
                  <div className="text-sm text-muted-foreground">매니저</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ips" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>IP 화이트리스트 관리</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="IP, 위치, 디바이스 검색..."
                      value={ipSearchTerm}
                      onChange={(e) => setIpSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button onClick={openIpModal} variant="default">
                    <Shield className="w-4 h-4 mr-2" />
                    IP 허용 추가
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>IP 주소</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>디바이스</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>접근 시도</TableHead>
                      <TableHead>최근 접근</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIPs.map((ip) => (
                      <TableRow key={ip.id}>
                        <TableCell className="font-medium font-mono">{ip.ip}</TableCell>
                        <TableCell>{ip.location}</TableCell>
                        <TableCell>{ip.device}</TableCell>
                        <TableCell>
                          <Badge className={getIPStatusColor(ip.status)}>
                            {ip.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{ip.attempts}회</TableCell>
                        <TableCell>{ip.lastAccess}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteIp(ip.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                화이트리스트에서 제거
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

          {/* IP Whitelist Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{ips.length}</div>
                  <div className="text-sm text-muted-foreground">화이트리스트 총 IP</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {ips.filter(ip => ip.status === '허용').length}
                  </div>
                  <div className="text-sm text-muted-foreground">허용된 IP</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {ips.filter(ip => new Date().getTime() - new Date(ip.lastAccess).getTime() < 24 * 60 * 60 * 1000).length}
                  </div>
                  <div className="text-sm text-muted-foreground">최근 24시간 접근</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? '사용자 수정' : '사용자 추가'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">전화번호</Label>
              <Input
                id="phone"
                value={userFormData.phone}
                onChange={(e) => setUserFormData({...userFormData, phone: e.target.value})}
                placeholder="010-1234-5678"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">역할</Label>
                <Select
                  value={userFormData.role}
                  onValueChange={(value) => setUserFormData({...userFormData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="사용자">사용자</SelectItem>
                    <SelectItem value="매니저">매니저</SelectItem>
                    <SelectItem value="관리자">관리자</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">상태</Label>
                <Select
                  value={userFormData.status}
                  onValueChange={(value) => setUserFormData({...userFormData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="활성">활성</SelectItem>
                    <SelectItem value="비활성">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeUserModal}>
                취소
              </Button>
              <Button type="submit">
                {editingUser ? '수정' : '추가'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* IP Allow Modal */}
      <Dialog open={isIpModalOpen} onOpenChange={setIsIpModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>IP 화이트리스트 추가</DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>화이트리스트 방식:</strong> 기본적으로 모든 IP는 차단되며, 여기에 추가된 IP만 시스템에 접근할 수 있습니다.
            </p>
          </div>
          <form onSubmit={handleIpAllow} className="space-y-4">
            <div>
              <Label htmlFor="ipAddress">허용할 IP 주소</Label>
              <Input
                id="ipAddress"
                value={allowIpAddress}
                onChange={(e) => setAllowIpAddress(e.target.value)}
                placeholder="예: 192.168.1.1 또는 192.168.1.0/24"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                개별 IP 주소 또는 CIDR 표기법을 사용하세요
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeIpModal}>
                취소
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Shield className="w-4 h-4 mr-2" />
                화이트리스트에 추가
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};