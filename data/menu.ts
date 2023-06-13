const loginMenus: Record<string, Record<string, string>> = {
  user: {
    path: 'auth/user',
    name: '회원 정보',
  },
};

const logoutMenus: Record<string, Record<string, string>> = {
  signUp: {
    path: 'auth/sign-up',
    name: '회원 가입',
  },
  signIn: {
    path: 'auth/sign-in',
    name: '로그인',
  },
};

const commonMenus: Record<string, Record<string, string>> = {
  notice: {
    path: '/notice',
    name: '공지',
  },
};

export { loginMenus, logoutMenus, commonMenus };
