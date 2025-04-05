'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiSettings, FiUser, FiSearch, FiBell, FiUsers, FiMenu, 
         FiChevronLeft, FiLogOut, FiMessageSquare, FiPlusCircle } from 'react-icons/fi';
import { getCurrentUser } from '../../utils/auth';
import { supabase } from '../../utils/supabaseClient';
import '../../styles/dashboard.css';

// Make sure to define the component as a proper React functional component
const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get current user
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/login');
          return;
        }

        setUser(currentUser);
        
        // Update last seen status
        await updateLastSeen(currentUser.id);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {!sidebarCollapsed && <span>ChatterBox</span>}
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? <FiMenu /> : <FiChevronLeft />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/dashboard" className="nav-item active">
            <FiHome className="nav-icon" />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link href="/dashboard/messages" className="nav-item">
            <FiMessageSquare className="nav-icon" />
            <span className="nav-text">Messages</span>
          </Link>
          <Link href="/dashboard/search" className="nav-item">
            <FiSearch className="nav-icon" />
            <span className="nav-text">Search</span>
          </Link>
          <Link href="/dashboard/notifications" className="nav-item">
            <FiBell className="nav-icon" />
            <span className="nav-text">Notifications</span>
          </Link>
          <Link href="/dashboard/invites" className="nav-item">
            <FiUsers className="nav-icon" />
            <span className="nav-text">Invites</span>
          </Link>
          <Link href="/dashboard/create" className="nav-item">
            <FiPlusCircle className="nav-icon" />
            <span className="nav-text">Create</span>
          </Link>
          <Link href="/dashboard/profile" className="nav-item">
            <FiUser className="nav-icon" />
            <span className="nav-text">Profile</span>
          </Link>
          <Link href="/dashboard/settings" className="nav-item">
            <FiSettings className="nav-icon" />
            <span className="nav-text">Settings</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <div className="user-info">
              <div className="user-name">{user?.username}</div>
              <div className="user-email">{user?.email}</div>
              <button onClick={handleSignOut} className="sign-out-btn">
                <FiLogOut size={14} />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="dashboard-header">
          <h1 className="greeting">
            Hi, {user?.username}! 👋
          </h1>
          <p className="dashboard-welcome">
            Welcome to your ChatterBox dashboard. Here you can manage your messages, 
            find friends, and customize your experience.
          </p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon">
              <FiMessageSquare size={24} />
            </div>
            <div className="card-content">
              <h3>Messages</h3>
              <p>Start conversations with friends or groups</p>
              <Link href="/dashboard/messages" className="card-link">
                Go to Messages
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <FiUsers size={24} />
            </div>
            <div className="card-content">
              <h3>Friends</h3>
              <p>Manage your connections and find new friends</p>
              <Link href="/dashboard/friends" className="card-link">
                Manage Friends
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <FiBell size={24} />
            </div>
            <div className="card-content">
              <h3>Notifications</h3>
              <p>Stay updated with your latest activity</p>
              <Link href="/dashboard/notifications" className="card-link">
                View Notifications
              </Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <FiSettings size={24} />
            </div>
            <div className="card-content">
              <h3>Settings</h3>
              <p>Customize your ChatterBox experience</p>
              <Link href="/dashboard/settings" className="card-link">
                Go to Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper function to update user's last seen timestamp
async function updateLastSeen(userId: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ last_seen: new Date().toISOString() })
      .eq('id', userId);
      
    if (error) {
      console.error('Error updating last seen:', error);
    }
  } catch (error) {
    console.error('Error updating last seen:', error);
  }
}

// Make sure to export the component as default
export default Dashboard;
