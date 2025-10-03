// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { useTheme } from 'next-themes';
// const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   emailId: string;
//   role: string;
//   username: string;
//   theme: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (emailId: string, password: string) => Promise<void>;
//   register: (userData: any) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUserTheme: (theme: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { setTheme } = useTheme();

//   // Check authentication status on mount
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch('/api/auth/check', {
//         method: 'GET',
//         credentials: 'include',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         // Sync theme with user preference
//         if (data.user.theme) {
//           setTheme(data.user.theme);
//         }
//       }
//     } catch (error) {
//       console.error('Auth check failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (emailId: string, password: string) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ emailId, password }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         // Sync theme with user preference
//         if (data.user.theme) {
//           setTheme(data.user.theme);
//         }
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const register = async (userData: any) => {
//     try {
//       const response = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userData),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUser(data.user);
//         // Sync theme with user preference
//         if (data.user.theme) {
//           setTheme(data.user.theme);
//         }
//       } else {
//         const errorData = await response.json();
//         throw new Error(errorData.error);
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//       setUser(null);
//       setTheme('system'); // Reset to system theme
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   const updateUserTheme = async (theme: string) => {
//     try {
//       const response = await fetch(`${backendUrl}/api/theme/68ced6c278ee55bcdaea4735`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ theme }),
//         credentials: 'include',
//       });

//       if (response.ok) {
//         setUser(prev => prev ? { ...prev, theme } : null);
//         setTheme(theme);
//       }
//     } catch (error) {
//       console.error('Theme update failed:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         login,
//         register,
//         logout,
//         updateUserTheme,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
