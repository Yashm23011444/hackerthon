/**
 * 🎯 Job Matching Hook with ML Logic
 * 
 * Orchestrates AI-powered job matching using TensorFlow.js
 * Combines semantic similarity, skill matching, and accessibility fit
 * 
 * Features:
 * - Real-time job scoring
 * - Embedding caching for performance
 * - Weighted scoring algorithm
 * - Match explanations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { matchJobsToProfile, preloadModel, getModelInfo } from '../utils/mlModel';
import jobsData from '../data/jobsData';

export const useJobMatching = () => {
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [matchStats, setMatchStats] = useState({
    totalJobs: 0,
    matchedJobs: 0,
    averageScore: 0,
    processingTime: 0,
  });

  // Cache to avoid reprocessing
  const cacheRef = useRef(new Map());
  const lastProfileRef = useRef(null);

  /**
   * Preload ML model on mount
   */
  useEffect(() => {
    const initModel = async () => {
      try {
        await preloadModel();
        setIsModelLoaded(true);
      } catch (err) {
        setError('Failed to load AI model');
        setIsModelLoaded(false);
      }
    };

    initModel();
  }, []);

  /**
   * Check if profile has changed significantly
   */
  const hasProfileChanged = useCallback((newProfile) => {
    if (!lastProfileRef.current) return true;

    const old = lastProfileRef.current;
    const profileChanged = 
      JSON.stringify(old.skills) !== JSON.stringify(newProfile.skills) ||
      old.bio !== newProfile.bio ||
      JSON.stringify(old.accessibility) !== JSON.stringify(newProfile.accessibility);

    return profileChanged;
  }, []);

  /**
   * Match jobs to user profile with ML
   */
  const matchJobs = useCallback(async (profile, jobs = jobsData) => {
    // Validate profile
    if (!profile || (!profile.skills?.length && !profile.bio)) {
      setMatchedJobs(jobs.map(job => ({ ...job, matchScore: 50 })));
      return;
    }

    // Check cache
    if (!hasProfileChanged(profile) && cacheRef.current.has('matchedJobs')) {
      setMatchedJobs(cacheRef.current.get('matchedJobs'));
      return;
    }

    setIsLoading(true);
    setError(null);

    const startTime = performance.now();

    try {

      // Perform ML matching
      const matched = await matchJobsToProfile(profile, jobs);

      // Calculate stats
      const totalProcessingTime = Math.round(performance.now() - startTime);
      const scores = matched.map(j => j.matchScore);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const goodMatches = matched.filter(j => j.matchScore >= 70).length;

      setMatchStats({
        totalJobs: jobs.length,
        matchedJobs: goodMatches,
        averageScore: avgScore,
        processingTime: totalProcessingTime,
      });

      setMatchedJobs(matched);
      
      // Cache results
      cacheRef.current.set('matchedJobs', matched);
      lastProfileRef.current = profile;

    } catch (err) {
      setError(err.message || 'Job matching failed');
      // Fallback to unscored jobs
      setMatchedJobs(jobs.map(job => ({ ...job, matchScore: 50 })));
    } finally {
      setIsLoading(false);
    }
  }, [hasProfileChanged]);

  /**
   * Filter matched jobs by score threshold
   */
  const filterByScore = useCallback((minScore = 0, maxScore = 100) => {
    return matchedJobs.filter(
      job => job.matchScore >= minScore && job.matchScore <= maxScore
    );
  }, [matchedJobs]);

  /**
   * Get top N matches
   */
  const getTopMatches = useCallback((n = 10) => {
    return matchedJobs.slice(0, n);
  }, [matchedJobs]);

  /**
   * Filter by category/tags
   */
  const filterByTags = useCallback((tags) => {
    if (!tags || tags.length === 0) return matchedJobs;

    return matchedJobs.filter(job =>
      job.tags.some(jobTag =>
        tags.some(filterTag =>
          jobTag.toLowerCase().includes(filterTag.toLowerCase())
        )
      )
    );
  }, [matchedJobs]);

  /**
   * Filter by location preference
   */
  const filterByLocation = useCallback((location) => {
    if (!location) return matchedJobs;

    const locationLower = location.toLowerCase();
    return matchedJobs.filter(job =>
      job.location.toLowerCase().includes(locationLower)
    );
  }, [matchedJobs]);

  /**
   * Get match explanation for a specific job
   */
  const getMatchExplanation = useCallback((job) => {
    if (!job.breakdown) {
      return 'Match score calculated using AI algorithms';
    }

    const { breakdown, matchingSkills, matchingAccessibility } = job;
    const explanations = [];

    // Semantic similarity
    if (breakdown.semantic >= 80) {
      explanations.push(`🎯 Excellent semantic match (${breakdown.semantic}%)`);
    } else if (breakdown.semantic >= 60) {
      explanations.push(`✓ Good semantic alignment (${breakdown.semantic}%)`);
    }

    // Skills
    if (matchingSkills && matchingSkills.length > 0) {
      const skillsList = matchingSkills.slice(0, 3).join(', ');
      explanations.push(`💡 ${matchingSkills.length} matching skills: ${skillsList}`);
    }

    // Accessibility
    if (matchingAccessibility && matchingAccessibility.length > 0) {
      explanations.push(`♿ ${matchingAccessibility.length} accessibility features match`);
    }

    // Overall
    if (job.matchScore >= 90) {
      explanations.unshift('⭐ Outstanding match for your profile');
    } else if (job.matchScore >= 75) {
      explanations.unshift('✨ Strong match for your profile');
    } else if (job.matchScore >= 60) {
      explanations.unshift('👍 Good potential match');
    }

    return explanations.join('\n');
  }, []);

  /**
   * Clear cache (useful for profile updates)
   */
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    lastProfileRef.current = null;
  }, []);

  /**
   * Get model information
   */
  const modelInfo = getModelInfo();

  return {
    // State
    matchedJobs,
    isLoading,
    isModelLoaded,
    error,
    matchStats,
    modelInfo,

    // Actions
    matchJobs,
    clearCache,

    // Filters
    filterByScore,
    getTopMatches,
    filterByTags,
    filterByLocation,

    // Utils
    getMatchExplanation,
  };
};

export default useJobMatching;
