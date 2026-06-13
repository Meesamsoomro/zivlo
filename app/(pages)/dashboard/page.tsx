"use client";
import Logo from "@/components/Logo";
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, CreditCard, Clock, ChevronRight, AlertCircle } from 'lucide-react';

export default function Dashboard({
  onNavigate,
  user = null,
  history = []
}: {
  onNavigate?: (screen: string) => void;
  user?: any;
  history?: any[];
}) {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const [isEditingPitch, setIsEditingPitch] = useState(false);
  const [editPitchValue, setEditPitchValue] = useState('');
  const [savingPitch, setSavingPitch] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState('');
  const [savingName, setSavingName] = useState(false);

  const navy = '#0D1529';
  const gold = '#C8A84B';

  useEffect(() => {
    fetchUserData();
    fetchPaymentInfo();
    fetchSearchHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('user');
      console.log('storedUser', storedUser)
      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      const memberSince = parsedUser.created_at
        ? new Date(parsedUser.created_at).toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
        })
        : 'Unknown';

      setUserData((prev: any) => ({
        ...prev,
        email: parsedUser.email,
        memberSince: memberSince,
        userId: parsedUser.user_id,
        pitchContext: parsedUser.pitch_context || '',
        senderName: parsedUser.sender_name || '',
        subscriptionStatus: parsedUser.is_subscribed ? 'active' : 'inactive'
      }));

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) return;

      const response = await fetch('/api/get-payment', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.payment) {
          let nextBilling = 'N/A';
          if (data.payment.end_at) {
            nextBilling = new Date(data.payment.end_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });
          }

          const isActive = data.payment.is_active === true && new Date(data.payment.end_at) > new Date();

          setUserData((prev: any) => ({
            ...prev,
            nextBilling: nextBilling,
            subscriptionStatus: isActive ? 'active' : 'inactive'
          }));
        } else {
          setUserData((prev: any) => ({
            ...prev,
            nextBilling: 'N/A',
            subscriptionStatus: 'inactive'
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) return;

      const response = await fetch('/api/get-searches', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.searches) {
          // Limit to latest 21 searches
          const latestSearches = data.searches.slice(0, 21);

          const formattedHistory = latestSearches.map((search: any) => ({
            id: search.search_id,
            type: search.business_type,
            location: search.location,
            pitch: search.pitch,
            date: new Date(search.created_at).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }),
            count: search.leads
          }));
          setSearchHistory(formattedHistory);
        }
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
        }

        setUserData({
          ...userData,
          subscriptionStatus: 'inactive'
        });

        alert('Your subscription has been cancelled successfully.');
      } else {
        alert(data.error || 'Failed to cancel subscription. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelling(false);
      setShowCancelModal(false);
    }
  };

  const handleSavePitch = async () => {
    if (editPitchValue.length < 20 || editPitchValue.length > 150) {
      alert("Pitch context must be between 20 and 150 characters.");
      return;
    }
    setSavingPitch(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pitchContext: editPitchValue })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
        setUserData({ ...userData, pitchContext: editPitchValue });
        setIsEditingPitch(false);
      } else {
        alert(data.error || "Failed to update profile");
      }
    } catch (e) {
      alert("An error occurred while saving.");
    } finally {
      setSavingPitch(false);
    }
  };

  const handleSaveName = async () => {
    if (!editNameValue.trim()) {
      alert("Sender name is required.");
      return;
    }
    if (editNameValue.length < 2 || editNameValue.length > 50) {
      alert("Sender name must be between 2 and 50 characters.");
      return;
    }
    setSavingName(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ senderName: editNameValue.trim() })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('auth_token', data.token);
        document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
        setUserData({ ...userData, senderName: editNameValue.trim() });
        setIsEditingName(false);
      } else {
        alert(data.error || "Failed to update sender name");
      }
    } catch (e) {
      alert("An error occurred while saving.");
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('subscription');
    localStorage.removeItem('zivlo_search_results');
    localStorage.removeItem('zivlo_search_query');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login?message=You have been logged out successfully.');
  };

  const displayHistory = searchHistory.length > 0
    ? searchHistory
    : (history.length > 0 ? history : []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      <nav className="bg-white border-b border-slate-100 px-5 py-3 md:px-12 md:py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/appscreen"
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition whitespace-nowrap"
          style={{ color: navy }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">Back to app</span>
        </Link>
        <Link href="/"><Logo /></Link>
        <div className="w-6 sm:w-24" />
      </nav>

      <div className="px-5 md:px-12 py-8 md:py-12 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 leading-tight" style={{ color: navy, fontFamily: 'Georgia, serif', letterSpacing: '-0.02em' }}>
          Your account
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: navy }}>
              <User size={18} style={{ color: gold }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: navy, fontFamily: 'Georgia, serif' }}>
              Account details
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Email</span>
              <span className="text-sm font-medium" style={{ color: navy }}>{userData.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Member since</span>
              <span className="text-sm font-medium" style={{ color: navy }}>{userData.memberSince}</span>
            </div>
            <div className="flex justify-between items-start py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600 mt-1">Sender Name</span>
              {isEditingName ? (
                <div className="flex-1 ml-6">
                  <input
                    type="text"
                    value={editNameValue}
                    onChange={(e) => setEditNameValue(e.target.value)}
                    maxLength={50}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500 text-black bg-white"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-400">
                      {editNameValue.length}/50
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingName(false)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                      <button onClick={handleSaveName} disabled={savingName} className="text-xs font-semibold px-3 py-1 rounded bg-slate-900 text-white disabled:opacity-50">Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <span className={`text-sm leading-snug ${!userData.senderName ? 'text-amber-600 font-semibold' : ''}`} style={{ color: userData.senderName ? navy : undefined }}>
                    {userData.senderName || '⚠️ Not set'}
                  </span>
                  <button onClick={() => { setEditNameValue(userData.senderName || ''); setIsEditingName(true); }} className="text-xs font-medium text-slate-400 hover:text-slate-600 mt-1 underline">Edit</button>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start py-2 pt-3">
              <span className="text-sm text-slate-600 mt-1">Pitch Context</span>
              {isEditingPitch ? (
                <div className="flex-1 ml-6">
                  <input
                    type="text"
                    value={editPitchValue}
                    onChange={(e) => setEditPitchValue(e.target.value)}
                    maxLength={150}
                    className="w-full text-sm px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-slate-500 text-black bg-white"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${editPitchValue.length < 20 ? 'text-red-500' : 'text-slate-400'}`}>
                      {editPitchValue.length}/150
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditingPitch(false)} className="text-xs text-slate-500 hover:text-slate-700">Cancel</button>
                      <button onClick={handleSavePitch} disabled={savingPitch} className="text-xs font-semibold px-3 py-1 rounded bg-slate-900 text-white disabled:opacity-50">Save</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-end max-w-[60%]">
                  <span className="text-sm text-right leading-snug" style={{ color: navy }}>{userData.pitchContext || 'Not set'}</span>
                  <button onClick={() => { setEditPitchValue(userData.pitchContext || ''); setIsEditingPitch(true); }} className="text-xs font-medium text-slate-400 hover:text-slate-600 mt-1 underline">Edit</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: navy }}>
              <CreditCard size={18} style={{ color: gold }} />
            </div>
            <h2 className="text-lg font-bold" style={{ color: navy, fontFamily: 'Georgia, serif' }}>
              Subscription
            </h2>
          </div>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Status</span>
              {userData.subscriptionStatus === 'active' ? (
                <span className="text-sm font-semibold inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                  Active
                </span>
              ) : (
                <span className="text-sm font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}>
                  Inactive
                </span>
              )}
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">Plan</span>
              <span className="text-sm font-medium" style={{ color: navy }}>£19.99/month</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Next billing</span>
              <span className="text-sm font-medium" style={{ color: navy }}>{userData.nextBilling}</span>
            </div>
          </div>
          {userData.subscriptionStatus === 'active' && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={cancelling}
              className="w-full text-sm py-3 rounded-lg border border-slate-300 hover:border-slate-400 transition font-medium disabled:opacity-50"
              style={{ color: navy }}
            >
              Cancel subscription
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: navy }}>
                <Clock size={18} style={{ color: gold }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: navy, fontFamily: 'Georgia, serif' }}>
                Recent searches
              </h2>
            </div>
            {displayHistory.length > 0 && (
              <span className="text-xs text-slate-500">
                {displayHistory.length} {displayHistory.length === 1 ? 'search' : 'searches'}
              </span>
            )}
          </div>

          {displayHistory.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No searches yet. <Link href="/appscreen" className="underline" style={{ color: navy }}>Run your first search →</Link>
            </p>
          ) : (
            <div className="space-y-2">
              {displayHistory.map((item) => (
                <Link
                  key={item.id}
                  href={'/results?search_id=' + item.id}
                  className="w-full bg-slate-50 hover:bg-slate-100 rounded-lg px-4 py-3 flex items-center justify-between transition text-left block"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm truncate" style={{ color: navy }}>
                      {item.type} in {item.location}
                    </div>
                    {item.pitch && (
                      <div className="text-xs text-slate-600 mt-1 truncate" title={item.pitch}>
                        Pitch: {item.pitch}
                      </div>
                    )}
                    <div className="text-xs text-slate-500 mt-0.5">
                      {item.date} · {item.count} leads
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-700 transition"
          >
            Log out
          </button>
        </div>
      </div>

      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-5 z-50">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FFEBEE' }}>
                <AlertCircle size={20} style={{ color: '#C62828' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: navy, fontFamily: 'Georgia, serif' }}>
                  Cancel subscription?
                </h3>
                <p className="text-sm text-slate-600">
                  You'll keep access until {userData.nextBilling}. After that, you'll need to reactivate to keep finding clients.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 rounded-lg border border-slate-300 font-medium text-sm hover:bg-slate-50 transition"
                style={{ color: navy }}
              >
                Keep subscription
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-3 rounded-lg font-medium text-sm text-white transition disabled:opacity-50"
                style={{ backgroundColor: '#C62828' }}
              >
                {cancelling ? 'Processing...' : 'Cancel anyway'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}