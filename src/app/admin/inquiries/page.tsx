"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { WelcomeMessage } from "@/components/admin/WelcomeMessage";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
  viewed: boolean;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('inquiry-changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'contact_inquiries' 
        }, 
        (payload) => {
          setInquiries(prevInquiries => [payload.new as Inquiry, ...prevInquiries]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchInquiries() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setInquiries(data as Inquiry[]);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsViewed(id: string) {
    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .update({ viewed: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === id ? { ...inquiry, viewed: true } : inquiry
      ));
      
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, viewed: true });
      }
    } catch (error) {
      console.error('Error marking inquiry as viewed:', error);
    }
  }

  function handleViewInquiry(inquiry: Inquiry) {
    setSelectedInquiry(inquiry);
    
    if (!inquiry.viewed) {
      markAsViewed(inquiry.id);
    }
  }

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
      
      <h1 className="text-3xl font-bold mb-8">Inquiries</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inquiries List */}
        <div className="bg-zinc-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-zinc-700/50 border-b border-zinc-600">
            <h2 className="text-lg font-medium">All Inquiries</h2>
          </div>
          <div className="overflow-auto max-h-[70vh]">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700">
                {inquiries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-zinc-400">
                      No inquiries found
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr 
                      key={inquiry.id} 
                      onClick={() => handleViewInquiry(inquiry)}
                      className={`cursor-pointer hover:bg-zinc-700 transition-colors ${selectedInquiry?.id === inquiry.id ? 'bg-zinc-700' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium">{inquiry.name}</div>
                        <div className="text-sm text-zinc-400">{inquiry.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inquiry.viewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {inquiry.viewed ? 'Viewed' : 'New'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Inquiry Details */}
        <div className="bg-zinc-800 rounded-lg shadow-md">
          <div className="p-4 bg-zinc-700/50 border-b border-zinc-600">
            <h2 className="text-lg font-medium">Inquiry Details</h2>
          </div>
          
          {selectedInquiry ? (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-medium">{selectedInquiry.name}</h2>
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${selectedInquiry.viewed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedInquiry.viewed ? 'Viewed' : 'New'}
                </span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Email:</p>
                  <p className="text-zinc-200">{selectedInquiry.email}</p>
                </div>
                
                {selectedInquiry.phone && (
                  <div>
                    <p className="text-sm text-zinc-400 mb-1">Phone:</p>
                    <p className="text-zinc-200">{selectedInquiry.phone}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Date:</p>
                  <p className="text-zinc-200">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-zinc-400 mb-1">Message:</p>
                  <p className="text-zinc-200 whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => window.location.href = `mailto:${selectedInquiry.email}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Reply by Email
                </button>
                
                {!selectedInquiry.viewed && (
                  <button
                    onClick={() => markAsViewed(selectedInquiry.id)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors"
                  >
                    Mark as Viewed
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 h-64 flex items-center justify-center">
              <p className="text-zinc-400">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 