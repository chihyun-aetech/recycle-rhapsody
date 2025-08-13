import { http, HttpResponse } from 'msw';
import { userDatabase, User } from '@/lib/database';

export const handlers = [
  // Login endpoint
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json() as { email: string; password: string };
    
    const user = userDatabase.validateCredentials(email, password);
    
    if (!user) {
      return HttpResponse.json(
        { error: '아이디 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const userResponse = {
      serialnumber: user.serialnumber,
      email: user.email,
      name: user.name,
      phone: user.phone,
      level: user.level,
      is_active: user.is_active
    };

    return HttpResponse.json({
      message: '로그인 성공',
      user: userResponse,
      token: `mock-token-${user.serialnumber}`
    });
  }),

  // Register endpoint
  http.post('/api/auth/register', async ({ request }) => {
    const { email, password, name, phone } = await request.json() as {
      email: string;
      password: string;
      name: string;
      phone: string;
    };

    // Check if user already exists
    const existingUser = userDatabase.getUserByEmail(email);
    if (existingUser) {
      return HttpResponse.json(
        { error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = userDatabase.createUser({
      email,
      hashed_password: password,
      name,
      phone,
      level: 'user',
      is_active: true
    });

    const userResponse = {
      serialnumber: newUser.serialnumber,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      level: newUser.level,
      is_active: newUser.is_active
    };

    return HttpResponse.json({
      message: '회원가입 성공',
      user: userResponse
    });
  }),

  // Get current user
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = parseInt(token.replace('mock-token-', ''));
    
    const user = userDatabase.getUserById(userId);
    if (!user) {
      return HttpResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const userResponse = {
      serialnumber: user.serialnumber,
      email: user.email,
      name: user.name,
      phone: user.phone,
      level: user.level,
      is_active: user.is_active
    };

    return HttpResponse.json({
      user: userResponse
    });
  }),

  // Update user
  http.put('/api/auth/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = parseInt(token.replace('mock-token-', ''));
    
    const updates = await request.json() as Partial<User>;
    const updatedUser = userDatabase.updateUser(userId, updates);
    
    if (!updatedUser) {
      return HttpResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const userResponse = {
      serialnumber: updatedUser.serialnumber,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      level: updatedUser.level,
      is_active: updatedUser.is_active
    };

    return HttpResponse.json({
      message: '프로필 업데이트 성공',
      user: userResponse
    });
  }),

  // Delete user account
  http.delete('/api/auth/account', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = parseInt(token.replace('mock-token-', ''));
    
    const deleted = userDatabase.deleteUser(userId);
    
    if (!deleted) {
      return HttpResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      message: '계정이 삭제되었습니다.'
    });
  }),

  // Get all users (admin only)
  http.get('/api/admin/users', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = parseInt(token.replace('mock-token-', ''));
    const currentUser = userDatabase.getUserById(userId);
    
    if (!currentUser || currentUser.level !== 'admin') {
      return HttpResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const users = userDatabase.getAllUsers().map(user => ({
      serialnumber: user.serialnumber,
      email: user.email,
      name: user.name,
      phone: user.phone,
      level: user.level,
      is_active: user.is_active,
      create_at: user.create_at,
      update_at: user.update_at
    }));

    return HttpResponse.json({
      users
    });
  }),
];