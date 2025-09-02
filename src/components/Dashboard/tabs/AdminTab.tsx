import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { themeAtom, fontSizeAtom, languageAtom } from '@/shared/store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui';
import { Button, Input, Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui';
import { Search, UserPlus, Edit, Trash2, MoreHorizontal, Shield, X, Loader2 } from 'lucide-react';
import { 
  useUsers, 
  useUserStats, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser,
  userKeys,
  User, UserCreate, UserUpdate
} from '@/entities/users';
import { 
  useIpAccessLogs, 
  useIpAccessStats, 
  useCreateIpAccess, 
  useDeleteIpAccess,
  ipAccessKeys,
  IpAccess, IpAccessCreate
} from '@/entities/ip-access';

// Transform API data for display
interface DisplayUser extends Omit<User, 'created_date' | 'last_logged_at' | 'updated_at'> {
  joinDate: string;
  lastLogin: string;
}

interface DisplayIPRecord {
  id: string;
  ip: string;
  location: string;
  lastAccess: string;
  status: string;
  attempts: number;
  device: string;
}

// Transform helpers
const transformUser = (user: User): DisplayUser => ({
  ...user,
  joinDate: new Date(user.created_date).toLocaleDateString('ko-KR'),
  lastLogin: user.last_logged_at ? new Date(user.last_logged_at).toLocaleString('ko-KR') : '없음'
});

const transformIpRecord = (ipAccess: IpAccess): DisplayIPRecord => ({
  id: ipAccess.id,
  ip: ipAccess.address,
  location: ipAccess.location || '알 수 없음',
  lastAccess: ipAccess.last_accessed_at ? new Date(ipAccess.last_accessed_at).toLocaleString('ko-KR') : new Date(ipAccess.created_at).toLocaleString('ko-KR'),
  status: '허용', // IP access logs are implicitly allowed
  attempts: ipAccess.access_count,
  device: ipAccess.device || '알 수 없음'
});

export const AdminTab = () => {
  const [theme] = useAtom(themeAtom);
  const [fontSize] = useAtom(fontSizeAtom);
  const [language] = useAtom(languageAtom);
  const [activeTab, setActiveTab] = useState('users');
  const queryClient = useQueryClient();
  
  // API Queries
  const { data: usersData = [], isLoading: usersLoading, error: usersError } = useUsers();
  const { data: userStats } = useUserStats();
  const { data: ipAccessResponse = { data: [] }, isLoading: ipLoading } = useIpAccessLogs({ limit: 1000 });
  const ipStats = useIpAccessStats(1000);
  
  // Transform data for display
  const users = usersData.map(transformUser);
  const ips = ipAccessResponse.data.map(transformIpRecord);
  
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [ipSearchTerm, setIpSearchTerm] = useState('');

  // User modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DisplayUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    password: '',
    affiliation: '',
    role: 'user' as 'admin' | 'user',
    is_active: true
  });

  // IP modal states  
  const [isIpModalOpen, setIsIpModalOpen] = useState(false);
  const [allowIpAddress, setAllowIpAddress] = useState('');
  
  // Mutations
  const createUserMutation = useCreateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      closeUserModal();
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      alert(language === 'ko' ? '사용자 생성 중 오류가 발생했습니다.' : 'Error creating user.');
    }
  });
  
  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      closeUserModal();
    },
    onError: (error) => {
      console.error('Error updating user:', error);
      alert(language === 'ko' ? '사용자 수정 중 오류가 발생했습니다.' : 'Error updating user.');
    }
  });
  
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting user:', error);
      alert(language === 'ko' ? '사용자 삭제 중 오류가 발생했습니다.' : 'Error deleting user.');
    }
  });
  
  const createIpAccessMutation = useCreateIpAccess({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipAccessKeys.all });
      closeIpModal();
    },
    onError: (error) => {
      console.error('Error creating IP access:', error);
      alert(language === 'ko' ? 'IP 등록 중 오류가 발생했습니다.' : 'Error registering IP.');
    }
  });
  
  const deleteIpAccessMutation = useDeleteIpAccess({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ipAccessKeys.all });
    },
    onError: (error) => {
      console.error('Error deleting IP access:', error);
      alert(language === 'ko' ? 'IP 삭제 중 오류가 발생했습니다.' : 'Error deleting IP.');
    }
  });

  // Filter functions
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.affiliation.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredIPs = ips.filter(ip =>
    ip.ip.includes(ipSearchTerm) ||
    ip.location.toLowerCase().includes(ipSearchTerm.toLowerCase()) ||
    ip.device.toLowerCase().includes(ipSearchTerm.toLowerCase())
  );

  // User management functions
  const openUserModal = (user?: DisplayUser) => {
    if (user) {
      setEditingUser(user);
      setUserFormData({
        name: user.name,
        email: user.email,
        password: '',
        affiliation: user.affiliation,
        role: user.role as 'admin' | 'user',
        is_active: user.is_active
      });
    } else {
      setEditingUser(null);
      setUserFormData({
        name: '',
        email: '',
        password: '',
        affiliation: '',
        role: 'user',
        is_active: true
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
      password: '',
      affiliation: '',
      role: 'user',
      is_active: true
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      const updateData: UserUpdate = {
        name: userFormData.name || undefined,
        email: userFormData.email || undefined,
        password: userFormData.password || undefined,
        affiliation: userFormData.affiliation || undefined,
        role: userFormData.role,
        is_active: userFormData.is_active
      };
      updateUserMutation.mutate({ id: editingUser.id, data: updateData });
    } else {
      // Add new user
      const createData: UserCreate = {
        name: userFormData.name,
        email: userFormData.email,
        password: userFormData.password,
        affiliation: userFormData.affiliation,
        role: userFormData.role
      };
      createUserMutation.mutate(createData);
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      deleteUserMutation.mutate(userId);
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
    
    const createData: IpAccessCreate = {
      user_id: 'admin', // Default admin user for manual IP additions
      address: allowIpAddress,
      location: null,
      device: 'Manual Entry'
    };
    
    createIpAccessMutation.mutate(createData);
  };

  const deleteIp = (ipId: string) => {
    if (confirm('정말로 이 IP를 삭제하시겠습니까?')) {
      deleteIpAccessMutation.mutate(ipId);
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
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };
  
  const getRoleDisplayName = (role: string) => {
    if (language === 'ko') {
      return role === 'admin' ? '관리자' : '사용자';
    }
    return role === 'admin' ? 'Admin' : 'User';
  };
  
  const getStatusDisplayName = (isActive: boolean) => {
    if (language === 'ko') {
      return isActive ? '활성' : '비활성';
    }
    return isActive ? 'Active' : 'Inactive';
  };
  
  // Loading state
  if (usersLoading || ipLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span>{language === 'ko' ? '데이터를 불러오는 중...' : 'Loading data...'}</span>
      </div>
    );
  }
  
  // Error state
  if (usersError) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p>{language === 'ko' ? '데이터를 불러오는 중 오류가 발생했습니다.' : 'Error loading data.'}</p>
          <p className="text-sm mt-2">{usersError.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">{language === 'ko' ? '관리자 대시보드' : 'Admin Dashboard'}</h1>
          <p className="text-muted-foreground mt-1">{language === 'ko' ? '사용자 관리 및 IP 화이트리스트를 관리하세요' : 'Manage users and IP whitelist'}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            {language === 'ko' ? '사용자 목록' : 'User List'}
          </TabsTrigger>
          <TabsTrigger value="ips">
            {language === 'ko' ? 'IP 목록' : 'IP List'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{language === 'ko' ? '사용자 관리' : 'User Management'}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder={language === 'ko' ? '이름, 이메일, 소속 검색...' : 'Search name, email, affiliation...'}
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button onClick={() => openUserModal()}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {language === 'ko' ? '사용자 추가' : 'Add User'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ko' ? '이름' : 'Name'}</TableHead>
                      <TableHead>{language === 'ko' ? '이메일' : 'Email'}</TableHead>
                      <TableHead>{language === 'ko' ? '소속' : 'Affiliation'}</TableHead>
                      <TableHead>{language === 'ko' ? '역할' : 'Role'}</TableHead>
                      <TableHead>{language === 'ko' ? '상태' : 'Status'}</TableHead>
                      <TableHead>{language === 'ko' ? '가입일' : 'Join Date'}</TableHead>
                      <TableHead>{language === 'ko' ? '최근 로그인' : 'Last Login'}</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.affiliation}</TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(user.is_active)}>
                            {getStatusDisplayName(user.is_active)}
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
                                {language === 'ko' ? '수정' : 'Edit'}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {language === 'ko' ? '삭제' : 'Delete'}
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
                  <div className="text-2xl font-bold">{userStats?.total || users.length}</div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '전체 사용자' : 'Total Users'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {userStats?.active || users.filter(u => u.is_active).length}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '활성 사용자' : 'Active Users'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">
                    {userStats?.admins || users.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '관리자' : 'Admins'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {userStats?.users || users.filter(u => u.role === 'user').length}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '일반 사용자' : 'Regular Users'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ips" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{language === 'ko' ? 'IP 화이트리스트 관리' : 'IP Whitelist Management'}</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder={language === 'ko' ? 'IP, 위치, 디바이스 검색...' : 'Search IP, location, device...'}
                      value={ipSearchTerm}
                      onChange={(e) => setIpSearchTerm(e.target.value)}
                      className="pl-10 w-80"
                    />
                  </div>
                  <Button onClick={openIpModal} variant="default">
                    <Shield className="w-4 h-4 mr-2" />
                    {language === 'ko' ? 'IP 허용 추가' : 'Add IP Allow'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === 'ko' ? 'IP 주소' : 'IP Address'}</TableHead>
                      <TableHead>{language === 'ko' ? '위치' : 'Location'}</TableHead>
                      <TableHead>{language === 'ko' ? '디바이스' : 'Device'}</TableHead>
                      <TableHead>{language === 'ko' ? '상태' : 'Status'}</TableHead>
                      <TableHead>{language === 'ko' ? '접근 시도' : 'Attempts'}</TableHead>
                      <TableHead>{language === 'ko' ? '최근 접근' : 'Last Access'}</TableHead>
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
                        <TableCell>{ip.attempts}{language === 'ko' ? '회' : ' times'}</TableCell>
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
                                {language === 'ko' ? '화이트리스트에서 제거' : 'Remove from Whitelist'}
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
                  <div className="text-2xl font-bold text-primary">{ipStats?.total_accesses || ips.length}</div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '화이트리스트 총 IP' : 'Total Whitelisted IPs'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {ipStats?.unique_ips || ips.length}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '허용된 IP' : 'Allowed IPs'}</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {ips.filter(ip => new Date().getTime() - new Date(ip.lastAccess).getTime() < 24 * 60 * 60 * 1000).length}
                  </div>
                  <div className="text-sm text-muted-foreground">{language === 'ko' ? '최근 24시간 접근' : 'Last 24h Access'}</div>
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
              {editingUser ? (language === 'ko' ? '사용자 수정' : 'Edit User') : (language === 'ko' ? '사용자 추가' : 'Add User')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">{language === 'ko' ? '이름' : 'Name'}</Label>
                <Input
                  id="name"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({...userFormData, name: e.target.value})}
                  placeholder={language === 'ko' ? '이름을 입력하세요' : 'Enter name'}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">{language === 'ko' ? '이메일' : 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  placeholder={language === 'ko' ? '이메일을 입력하세요' : 'Enter email'}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">{language === 'ko' ? '비밀번호' : 'Password'}</Label>
                <Input
                  id="password"
                  type="password"
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  placeholder={language === 'ko' ? '비밀번호를 입력하세요' : 'Enter password'}
                  required={!editingUser}
                />
              </div>
              <div>
                <Label htmlFor="affiliation">{language === 'ko' ? '소속' : 'Affiliation'}</Label>
                <Input
                  id="affiliation"
                  value={userFormData.affiliation}
                  onChange={(e) => setUserFormData({...userFormData, affiliation: e.target.value})}
                  placeholder={language === 'ko' ? '소속을 입력하세요' : 'Enter affiliation'}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">{language === 'ko' ? '역할' : 'Role'}</Label>
                <Select
                  value={userFormData.role}
                  onValueChange={(value: 'admin' | 'user') => setUserFormData({...userFormData, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ko' ? '역할 선택' : 'Select role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">{language === 'ko' ? '사용자' : 'User'}</SelectItem>
                    <SelectItem value="admin">{language === 'ko' ? '관리자' : 'Admin'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">{language === 'ko' ? '상태' : 'Status'}</Label>
                <Select
                  value={userFormData.is_active.toString()}
                  onValueChange={(value) => setUserFormData({...userFormData, is_active: value === 'true'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'ko' ? '상태 선택' : 'Select status'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">{language === 'ko' ? '활성' : 'Active'}</SelectItem>
                    <SelectItem value="false">{language === 'ko' ? '비활성' : 'Inactive'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeUserModal}>
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button type="submit">
                {editingUser ? (language === 'ko' ? '수정' : 'Update') : (language === 'ko' ? '추가' : 'Add')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* IP Allow Modal */}
      <Dialog open={isIpModalOpen} onOpenChange={setIsIpModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{language === 'ko' ? 'IP 화이트리스트 추가' : 'Add IP Whitelist'}</DialogTitle>
          </DialogHeader>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>{language === 'ko' ? '화이트리스트 방식:' : 'Whitelist Mode:'}</strong> {language === 'ko' ? '기본적으로 모든 IP는 차단되며, 여기에 추가된 IP만 시스템에 접근할 수 있습니다.' : 'All IPs are blocked by default, only IPs added here can access the system.'}
            </p>
          </div>
          <form onSubmit={handleIpAllow} className="space-y-4">
            <div>
              <Label htmlFor="ipAddress">{language === 'ko' ? '허용할 IP 주소' : 'IP Address to Allow'}</Label>
              <Input
                id="ipAddress"
                value={allowIpAddress}
                onChange={(e) => setAllowIpAddress(e.target.value)}
                placeholder={language === 'ko' ? '예: 192.168.1.1 또는 192.168.1.0/24' : 'e.g., 192.168.1.1 or 192.168.1.0/24'}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'ko' ? '개별 IP 주소 또는 CIDR 표기법을 사용하세요' : 'Use individual IP address or CIDR notation'}
              </p>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={closeIpModal}>
                {language === 'ko' ? '취소' : 'Cancel'}
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Shield className="w-4 h-4 mr-2" />
                {language === 'ko' ? '화이트리스트에 추가' : 'Add to Whitelist'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};