"use client";
import { useAuth } from "@/hooks/auth";

export default function Home() {
  useAuth();

  return <div>Home</div>;
}
