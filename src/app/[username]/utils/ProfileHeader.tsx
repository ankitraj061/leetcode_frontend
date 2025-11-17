// app/profile/[username]/utils/ProfileHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { User } from '../page';
import EditProfileModal from './EditProfileModal';
import { FiEdit2, FiMapPin, FiMail, FiUser, FiUserPlus, FiUserCheck, FiLoader } from 'react-icons/fi';
import { MdCake } from 'react-icons/md';
import { axiosClient } from '@/app/utils/axiosClient';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { BorderBeam } from '@/components/ui/border-beam'; // Import BorderBeam

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  emailId: string;
  bio: string;
  location: string;
  gender: string;
  age: number | null;
  currentStreak: number;
  longestStreak: number;
  followingCount: number;
  followersCount: number;
  badges: string[];
}

interface ProfileHeaderProps {
  username: string;
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Follow states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  // Check if logged-in user is viewing their own profile
  const isOwnProfile = user?.username === username;

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/${username}/profile`);
        
        if (response.data.success) {
          setProfileData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to load profile');
        }
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        setError(
          err.response?.data?.message ||
          err.message ||
          'An error occurred'
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  // Fetch follow status (only if viewing someone else's profile)
  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user || isOwnProfile) {
        return;
      }

      try {
        const response = await axiosClient.get(`/api/${username}/follow-status`);
        
        if (response.data.success) {
          setIsFollowing(response.data.data.isFollowing);
        }
      } catch (error) {
        console.error('Error fetching follow status:', error);
      }
    };

    if (username && user && !isOwnProfile) {
      fetchFollowStatus();
    }
  }, [username, user, isOwnProfile]);

  // Handle follow/unfollow toggle
  const handleFollowToggle = async () => {
    if (!user) {
      setFollowError('Please log in to follow users');
      return;
    }

    setFollowLoading(true);
    setFollowError(null);

    try {
      if (isFollowing) {
        const response = await axiosClient.delete(`/api/${username}/unfollow`);
        
        if (response.data.success) {
          setIsFollowing(false);
          setProfileData((prev) => 
            prev ? { ...prev, followersCount: prev.followersCount - 1 } : null
          );
        } else {
          setFollowError(response.data.message || 'Failed to unfollow');
        }
      } else {
        const response = await axiosClient.post(`/api/${username}/follow`);
        
        if (response.data.success) {
          setIsFollowing(true);
          setProfileData((prev) => 
            prev ? { ...prev, followersCount: prev.followersCount + 1 } : null
          );
        } else {
          setFollowError(response.data.message || 'Failed to follow');
        }
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setFollowError(
        err.response?.data?.message || err.message || 'An error occurred'
      );
    } finally {
      setFollowLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = (updatedData: Partial<ProfileData>) => {
    setProfileData((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  if (loading) {
    return (
      <div 
        className="rounded-lg p-6 animate-pulse"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
      >
        <div className="flex items-start gap-6">
          <div 
            className="w-24 h-24 rounded-full"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          />
          <div className="flex-1 space-y-3">
            <div 
              className="h-8 rounded"
              style={{ backgroundColor: 'var(--bg-secondary)', width: '33%' }}
            />
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--bg-secondary)', width: '25%' }}
            />
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: 'var(--bg-secondary)', width: '50%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div 
        className="border rounded-lg p-6"
        style={{
          backgroundColor: 'var(--error-50)',
          borderColor: 'var(--error-500)'
        }}
      >
        <p style={{ color: 'var(--error-500)' }}>
          {error || 'Profile not found'}
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div 
        className="relative rounded-lg p-6 shadow-lg overflow-hidden"
        style={{ backgroundColor: 'var(--bg-elevated)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-start justify-between mb-6">
          {/* Left Section: Profile Picture & Basic Info */}
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow-md"
                style={{
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
                  color: '#FFFFFF'
                }}
              >
                {profileData.firstName.charAt(0).toUpperCase()}
                {profileData.lastName.charAt(0).toUpperCase()}
              </div>
              
              {/* Streak Badge */}
              {profileData.currentStreak > 0 && (
                <motion.div 
                  className="absolute -bottom-2 -right-2 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--accent-500)',
                    color: '#FFFFFF'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  🔥 {profileData.currentStreak}
                </motion.div>
              )}
            </motion.div>

            {/* Name & Username */}
            <div className="flex-1">
              <motion.h1 
                className="text-3xl font-bold mb-1"
                style={{ color: 'var(--text-primary)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {profileData.firstName} {profileData.lastName}
              </motion.h1>
              
              <motion.p 
                className="text-lg mb-3"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                @{profileData.username}
              </motion.p>

              {/* Bio */}
              {profileData.bio && (
                <motion.p 
                  className="mb-4 max-w-2xl"
                  style={{ color: 'var(--text-secondary)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {profileData.bio}
                </motion.p>
              )}

              {/* Info Grid */}
              <motion.div 
                className="grid grid-cols-2 gap-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {profileData.emailId && (
                  <div 
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <FiMail style={{ color: 'var(--primary-500)' }} />
                    <span>{profileData.emailId}</span>
                  </div>
                )}

                {profileData.location && (
                  <div 
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <FiMapPin style={{ color: 'var(--success-500)' }} />
                    <span>{profileData.location}</span>
                  </div>
                )}

                {profileData.gender && (
                  <div 
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <FiUser style={{ color: 'var(--primary-400)' }} />
                    <span className="capitalize">{profileData.gender}</span>
                  </div>
                )}

                {profileData.age && (
                  <div 
                    className="flex items-center gap-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <MdCake style={{ color: 'var(--accent-500)' }} />
                    <span>{profileData.age} years old</span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Right Section: Action Buttons */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Follow/Unfollow Button */}
            {!isOwnProfile && user && (
              <div>
                <motion.button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isFollowing ? 'var(--bg-secondary)' : 'var(--primary-500)',
                    color: isFollowing ? 'var(--text-primary)' : '#FFFFFF',
                    border: isFollowing ? '1px solid var(--border-secondary)' : 'none'
                  }}
                  whileHover={{ scale: followLoading ? 1 : 1.05 }}
                  whileTap={{ scale: followLoading ? 1 : 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {followLoading ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : isFollowing ? (
                    <>
                      <FiUserCheck size={18} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <FiUserPlus size={18} />
                      <span>Follow</span>
                    </>
                  )}
                </motion.button>
                {followError && (
                  <motion.p 
                    className="text-xs mt-1"
                    style={{ color: 'var(--error-500)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {followError}
                  </motion.p>
                )}
              </div>
            )}

            {/* Edit Button */}
            {isOwnProfile && (
              <motion.button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium"
                style={{
                  backgroundColor: 'var(--primary-500)',
                  color: '#FFFFFF'
                }}
                whileHover={{ scale: 1.05, backgroundColor: 'var(--primary-600)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <FiEdit2 size={18} />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Stats Row */}
        <motion.div 
          className="flex items-center gap-8 pt-6 border-t"
          style={{ borderColor: 'var(--border-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Streak Stats */}
          <div className="flex items-center gap-6">
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--accent-500)' }}
              >
                {profileData.currentStreak}
              </p>
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Current Streak
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--accent-600)' }}
              >
                {profileData.longestStreak}
              </p>
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Longest Streak
              </p>
            </motion.div>
          </div>

          <div 
            className="h-12 w-px"
            style={{ backgroundColor: 'var(--border-primary)' }}
          />

          {/* Social Stats */}
          <div className="flex items-center gap-6">
            <motion.div 
              className="text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--primary-500)' }}
              >
                {profileData.followingCount}
              </p>
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Following
              </p>
            </motion.div>
            
            <motion.div 
              className="text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <p 
                className="text-2xl font-bold"
                style={{ color: 'var(--success-500)' }}
              >
                {profileData.followersCount}
              </p>
              <p 
                className="text-xs"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Followers
              </p>
            </motion.div>
          </div>

          <div 
            className="h-12 w-px"
            style={{ backgroundColor: 'var(--border-primary)' }}
          />

          {/* Badges Count */}
          <motion.div 
            className="text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <p 
              className="text-2xl font-bold"
              style={{ color: 'var(--accent-500)' }}
            >
              {profileData.badges.length}
            </p>
            <p 
              className="text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Badges Earned
            </p>
          </motion.div>
        </motion.div>

        {/* BorderBeam Effects - Multiple animated beams */}
        <BorderBeam
          duration={8}
          size={500}
          className="from-transparent via-purple-500 to-transparent"
        />
        <BorderBeam
          duration={8}
          delay={4}
          size={500}
          borderWidth={2}
          className="from-transparent via-blue-500 to-transparent"
        />
      </motion.div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          profileData={profileData}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
