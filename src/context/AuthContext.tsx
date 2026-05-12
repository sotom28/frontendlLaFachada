import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  idUsuario: number;
  nombre: string;
  email: string;
  idRol: number;
  id_rol?: number;
  id_usuario?: number;
  rol?: {
    idRol?: number;
    id_rol?: number;
    nombre?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple cookie helpers
const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load session from cookies on mount safely
    const savedUser = getCookie('auth_user');
    const savedToken = getCookie('auth_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error("Error parsing saved user", e);
        deleteCookie('auth_user');
        deleteCookie('auth_token');
      }
    }
  }, []);

  const login = async (userData: User, token: string) => {
    try {
      // Usamos el idUsuario que viene del login inicial para consultar el perfil completo
      const response = await fetch(`http://localhost:3000/users/${userData.idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const rawUser = await response.json();
        
        // Normalización para soportar la estructura anidada del backend:
        // rol: { idRol: 1, nombre: "ADMIN" }
        const normalizedUser: User = {
          ...rawUser,
          idRol: rawUser.idRol ?? rawUser.rol?.idRol ?? rawUser.id_rol ?? rawUser.rol?.id_rol,
          idUsuario: rawUser.idUsuario ?? rawUser.id_usuario
        };

        setUser(normalizedUser);
        setCookie('auth_user', JSON.stringify(normalizedUser));
      } else {
        // Fallback en caso de error en el endpoint de perfil
        setUser(userData);
        setCookie('auth_user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(userData);
      setCookie('auth_user', JSON.stringify(userData));
    }

    setToken(token);
    setCookie('auth_token', token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    deleteCookie('auth_user');
    deleteCookie('auth_token');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
