import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  Heart,
  Filter,
  Search,
  Star,
  Zap,
  Brain,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';
import { useJobMatching } from '../hooks/useJobMatching';
import { useUserProfile } from '../hooks/useUserProfile';
import { jobsData } from '../data/jobsData';
import UserProfileForm from './UserProfileForm';

const JobMatching = forwardRef((props, ref) => {
  const { profile, isProfileComplete } = useUserProfile();
  const {
    matchedJobs,
    matchJobs,
    getMatchExplanation,
    matchStats,
    isLoading,
    error,
    filterByScore,
    getTopMatches
  } = useJobMatching();

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [displayJobs, setDisplayJobs] = useState([]);

  // Expose method to open profile form from parent
  useImperativeHandle(ref, () => ({
    openProfileForm: () => {
      setShowProfileForm(true);
    }
  }));

  // Handle AI Job Matching
  const handleAIMatch = async () => {
    
    if (!isProfileComplete()) {
      setDisplayJobs(jobsData.slice(0, 6));
      return;
    }
    
    setIsMatching(true);
    try {
      const matches = await matchJobs(profile, jobsData);
      const topMatches = getTopMatches(matches, 10);
      setDisplayJobs(topMatches);
    } catch (err) {
      setDisplayJobs(jobsData.slice(0, 6));
    } finally {
      setIsMatching(false);
    }
  };

  // Check if profile exists and run matching
  useEffect(() => {
    if (isProfileComplete()) {
      handleAIMatch();
    } else {
      // Show sample jobs if no profile
      setDisplayJobs(jobsData.slice(0, 6));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle profile completion
  const handleProfileComplete = (completedProfile) => {
    setShowProfileForm(false);
    handleAIMatch();
  };

  // Filter jobs based on selected category
  const getFilteredJobs = () => {
    let filtered = displayJobs;

    // Apply category filter
    if (selectedFilter === 'remote') {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes('remote') || job.type === 'Remote'
      );
    } else if (selectedFilter === 'flexible') {
      filtered = filtered.filter(job =>
        job.accessibility?.some(a => a.toLowerCase().includes('flexible'))
      );
    } else if (selectedFilter === 'accessible') {
      filtered = filtered.filter(job => 
        job.accessibility && job.accessibility.length >= 3
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  const jobCategories = [
    { id: 'all', label: 'All Jobs', count: displayJobs.length },
    { 
      id: 'remote', 
      label: 'Remote', 
      count: displayJobs.filter(j => j.location?.toLowerCase().includes('remote')).length 
    },
    { 
      id: 'flexible', 
      label: 'Flexible Hours', 
      count: displayJobs.filter(j => 
        j.accessibility?.some(a => a.toLowerCase().includes('flexible'))
      ).length 
    },
    { 
      id: 'accessible', 
      label: 'Fully Accessible', 
      count: displayJobs.filter(j => j.accessibility && j.accessibility.length >= 3).length 
    },
  ];

  return (
    <section id="jobs" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-6 shadow-md"
          >
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">
              AI-Powered Job Matching • TensorFlow.js
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Find Your Perfect Job
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Smart recommendations based on your skills, preferences, and
            accessibility requirements.
          </motion.p>

          {/* AI Stats */}
          {isProfileComplete() && matchStats.totalJobs > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 dark:text-gray-400">Matches Found</div>
                <div className="text-2xl font-bold text-purple-600">{matchStats.matchedJobs}</div>
              </div>
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg Score</div>
                <div className="text-2xl font-bold text-purple-600">
                  {matchStats.averageScore.toFixed(0)}%
                </div>
              </div>
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="text-sm text-gray-600 dark:text-gray-400">Processing Time</div>
                <div className="text-2xl font-bold text-purple-600">
                  {(matchStats.processingTime / 1000).toFixed(2)}s
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile CTA or Form */}
        {!isProfileComplete() && !showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 mb-12 text-white text-center"
          >
            <Zap className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Unlock AI-Powered Matching</h3>
            <p className="text-lg mb-6 opacity-90">
              Create your profile to get personalized job recommendations using advanced machine learning
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowProfileForm(true);
              }}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors"
            >
              Create Profile & Get Matches
            </motion.button>
          </motion.div>
        )}

        {/* Profile Form Modal */}
        <AnimatePresence>
          {showProfileForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => setShowProfileForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isProfileComplete() ? 'Edit Your Profile' : 'Create Your Profile'}
                  </h3>
                  <button
                    onClick={() => setShowProfileForm(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
                <UserProfileForm onProfileComplete={handleProfileComplete} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, skills, or companies..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            {isProfileComplete() && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAIMatch}
                disabled={isMatching}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isMatching ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Refresh Matches</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3 mt-6">
            {jobCategories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  selectedFilter === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.label}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {isMatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              🧠 AI is analyzing your profile...
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Using Universal Sentence Encoder to find perfect matches
            </p>
          </motion.div>
        )}

        {/* Job Cards */}
        {!isMatching && (
          <div className="grid lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => {
                  const explanation = isProfileComplete() ? getMatchExplanation(job) : null;
                  const matchScore = job.matchScore || 75;

                  return (
                    <motion.div
                      key={job.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      {/* Match Score Badge */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            <span className="text-white font-semibold">
                              {Math.round(matchScore)}% Match
                            </span>
                            {isProfileComplete() && (
                              <span className="text-white/80 text-xs">
                                • AI-Powered
                              </span>
                            )}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                          >
                            <Heart className="w-5 h-5 text-white" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Job Title & Company */}
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {job.title}
                        </h3>
                        <p className="text-purple-600 font-medium mb-4">{job.company}</p>

                        {/* Job Details */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{job.type || 'Full-time'}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>{job.experience}</span>
                          </div>
                        </div>

                        {/* Why This Matches (AI Explanation) */}
                        {explanation && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                          >
                            <div className="flex items-start gap-2">
                              <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
                                  Why this matches:
                                </p>
                                <p className="text-xs text-blue-800 dark:text-blue-200">
                                  {explanation}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Skills Tags */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Accessibility Features */}
                        {job.accessibility && job.accessibility.length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Accessibility Features:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.accessibility.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs font-medium rounded-lg flex items-center"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Apply Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full button-primary"
                        >
                          Apply Now
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-2 text-center py-12"
                >
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No jobs found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedFilter('all');
                      setSearchQuery('');
                    }}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Clear Filters
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* View More / Edit Profile */}
        {!isMatching && filteredJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12 space-y-4"
          >
            {isProfileComplete() ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileForm(true)}
                  className="px-8 py-4 bg-white dark:bg-gray-800 text-purple-600 rounded-xl font-bold border-2 border-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAIMatch}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-colors"
                >
                  Refresh AI Matches
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileForm(true)}
                className="button-secondary"
              >
                Create Profile for AI Matching
              </motion.button>
            )}

            {/* Model Info */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Universal Sentence Encoder (512-dimensional embeddings)
            </p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-lg font-bold text-red-900 dark:text-red-300 mb-1">
                  Matching Error
                </h4>
                <p className="text-red-800 dark:text-red-200">
                  {error}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAIMatch}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
});

JobMatching.displayName = 'JobMatching';

export default JobMatching;
