'use client'

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProblem } from "@/app/slices/problemSlice";

export default function ProblemLayout({ children }: { children: React.ReactNode }) {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, fetchedSlug } = useSelector((state: any) => state.problem);
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (!slug) return;

    // ✅ fetch only if user is logged in and not already fetched
    if (isAuthenticated && slug !== fetchedSlug) {
      dispatch(getProblem(slug));
    }
  }, [dispatch, slug, isAuthenticated, fetchedSlug]);

  if (loading) return <p>Loading problem...</p>;

  return (
    <div>
      {/* ✅ problem is now globally available for all children routes */}
      {children}
    </div>
  );
}
