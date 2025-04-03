"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { WelcomeMessage } from "@/components/admin/WelcomeMessage";

interface AnalyticsData {
  totalPageViews: number;
  totalInquiries: number;
  inquiriesThisWeek: number;
  inquiriesThisMonth: number;
  systemStatus: {
    website: 'online' | 'degraded' | 'offline';
    database: 'connected' | 'issues' | 'disconnected';
    supabase: 'connected' | 'issues' | 'disconnected';
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalPageViews: 0,
    totalInquiries: 0,
    inquiriesThisWeek: 0,
    inquiriesThisMonth: 0,
    systemStatus: {
      website: 'online',
      database: 'connected',
      supabase: 'connected'
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalyticsData() {
      setIsLoading(true);
      try {
        // Fetch total inquiries
        const { count: totalCount, error: totalError } = await supabase
          .from("contact_inquiries")
          .select("*", { count: "exact", head: true });

        // Get inquiries for this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const { count: weekCount, error: weekError } = await supabase
          .from("contact_inquiries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", oneWeekAgo.toISOString());

        // Get inquiries for this month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const { count: monthCount, error: monthError } = await supabase
          .from("contact_inquiries")
          .select("*", { count: "exact", head: true })
          .gte("created_at", oneMonthAgo.toISOString());

        // Check database connection
        const { data: healthCheck, error: healthError } = await supabase
          .from("contact_inquiries")
          .select("id", { count: "exact", head: true })
          .limit(1);
        
        const databaseStatus = healthError ? 'issues' : 'connected';

        // For demo purposes, use mock page view data
        // In production, this would come from an analytics service
        const mockPageViews = Math.floor(Math.random() * 1000) + 500;
        
        setData({
          totalPageViews: mockPageViews,
          totalInquiries: totalCount || 0,
          inquiriesThisWeek: weekCount || 0,
          inquiriesThisMonth: monthCount || 0,
          systemStatus: {
            website: 'online',
            database: databaseStatus,
            supabase: databaseStatus
          }
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        setData({
          ...data,
          systemStatus: {
            website: 'online',
            database: 'issues',
            supabase: 'issues'
          }
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalyticsData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
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
      <WelcomeMessage />
      
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Page Views" 
          value={data.totalPageViews.toLocaleString()} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          } 
        />
        
        <MetricCard 
          title="Total Inquiries" 
          value={data.totalInquiries.toLocaleString()} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l-4-4m4 4l4-4" />
            </svg>
          } 
        />
        
        <MetricCard 
          title="This Week" 
          value={data.inquiriesThisWeek.toLocaleString()} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } 
        />
        
        <MetricCard 
          title="This Month" 
          value={data.inquiriesThisMonth.toLocaleString()} 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          } 
        />
      </div>
      
      {/* System Status */}
      <div className="bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-4">
          <StatusIndicator 
            name="Website" 
            status={data.systemStatus.website} 
          />
          <StatusIndicator 
            name="Database" 
            status={data.systemStatus.database} 
          />
          <StatusIndicator 
            name="Supabase" 
            status={data.systemStatus.supabase} 
          />
        </div>
      </div>
      
      {/* Place for future charts */}
      <div className="bg-zinc-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Inquiry Trends</h2>
        <div className="bg-zinc-900 rounded p-6 flex items-center justify-center h-64">
          <p className="text-zinc-400">Charts will be available in a future update</p>
        </div>
        <p className="mt-4 text-zinc-400 text-sm">This section will include charts to visualize inquiry trends over time.</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-zinc-400">{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function StatusIndicator({ name, status }: { name: string, status: string }) {
  let statusColor = '';
  let statusText = '';
  
  switch (status) {
    case 'online':
    case 'connected':
      statusColor = 'bg-green-500';
      statusText = 'Operational';
      break;
    case 'degraded':
    case 'issues':
      statusColor = 'bg-yellow-500';
      statusText = 'Performance Issues';
      break;
    case 'offline':
    case 'disconnected':
      statusColor = 'bg-red-500';
      statusText = 'Offline';
      break;
    default:
      statusColor = 'bg-gray-500';
      statusText = 'Unknown';
  }
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className={`w-3 h-3 ${statusColor} rounded-full mr-3`}></div>
        <span className="font-medium">{name}</span>
      </div>
      <span className="text-sm text-zinc-400">{statusText}</span>
    </div>
  );
} 