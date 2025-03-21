"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface DashboardStats {
  totalInquiries: number;
  newInquiries: number;
  latestInquiry: {
    name: string;
    email: string;
    created_at: string;
  } | null;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInquiries: 0,
    newInquiries: 0,
    latestInquiry: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total inquiries
        const { count: totalCount, error: totalError } = await supabase
          .from("contact_inquiries")
          .select("*", { count: "exact", head: true });

        // Get new inquiries (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: newCount, error: newError } = await supabase
          .from("contact_inquiries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString());

        // Get latest inquiry
        const { data: latestData, error: latestError } = await supabase
          .from("contact_inquiries")
          .select("name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(1);

        if (totalError || newError || latestError) {
          console.error("Error fetching stats:", totalError || newError || latestError);
          return;
        }

        setStats({
          totalInquiries: totalCount || 0,
          newInquiries: newCount || 0,
          latestInquiry: latestData && latestData.length > 0 ? latestData[0] : null,
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-zinc-400 mb-2">Total Inquiries</h2>
          <p className="text-4xl font-bold text-white">{stats.totalInquiries}</p>
        </div>
        
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-zinc-400 mb-2">New Inquiries (7 days)</h2>
          <p className="text-4xl font-bold text-white">{stats.newInquiries}</p>
        </div>
        
        <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-zinc-400 mb-2">Latest Activity</h2>
          {stats.latestInquiry ? (
            <div>
              <p className="font-medium">{stats.latestInquiry.name}</p>
              <p className="text-zinc-400 text-sm">{stats.latestInquiry.email}</p>
              <p className="text-zinc-500 text-xs mt-2">
                {new Date(stats.latestInquiry.created_at).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-zinc-500">No inquiries yet</p>
          )}
        </div>
      </div>
      
      <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/inquiries"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            View All Inquiries
          </a>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors"
          >
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
} 