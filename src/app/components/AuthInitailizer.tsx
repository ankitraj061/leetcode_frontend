'use client';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/app/slices/authSlice";
import { useRouter } from "next/navigation";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { isAuthenticated, loading, error } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && error) {
      router.push("/");
    }
  }, [loading, error, router]);

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return <>{children}</>;
}
