export const authMiddleware = (store) => (next) => (action) => {
    if (action.type.endsWith('/fulfilled') && action.payload?.token) {
      // Simpan token di cookie/httpOnly untuk keamanan
    }
    
    if (action.type === 'auth/logout') {
      // Hapus token dari cookie
    }
    
    return next(action);
  };