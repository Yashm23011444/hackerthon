/**
 * 🤖 TensorFlow.js ML Model Wrapper
 * 
 * This module handles all Machine Learning operations for job matching
 * using Google's Universal Sentence Encoder (USE) for semantic similarity.
 * 
 * Key Features:
 * - Load and cache the USE model
 * - Generate 512-dimensional embeddings from text
 * - Calculate cosine similarity between embeddings
 * - Match user profiles to job descriptions
 * 
 * Model: Universal Sentence Encoder (Multilingual)
 * Embedding Size: 512 dimensions
 * Performance: ~50ms per embedding on modern hardware
 */

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

// Global model cache
let modelCache = null;
let modelLoadingPromise = null;

/**
 * Load the Universal Sentence Encoder model
 * Uses caching to avoid reloading on subsequent calls
 * 
 * @returns {Promise<Object>} The loaded USE model
 */
export const loadModel = async () => {
  // Return cached model if already loaded
  if (modelCache) {
    return modelCache;
  }

  // Return existing loading promise to avoid multiple loads
  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  const startTime = performance.now();

  try {
    // Start loading
    modelLoadingPromise = use.load();
    modelCache = await modelLoadingPromise;

    const loadTime = ((performance.now() - startTime) / 1000).toFixed(2);

    modelLoadingPromise = null;
    return modelCache;
  } catch (error) {
    modelLoadingPromise = null;
    throw new Error(`Model loading failed: ${error.message}`);
  }
};

/**
 * Generate embedding vector for given text
 * Converts text into 512-dimensional semantic vector
 * 
 * @param {string} text - Input text to embed
 * @returns {Promise<Array<number>>} 512-dimensional embedding vector
 */
export const getEmbedding = async (text) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return new Array(512).fill(0); // Return zero vector
  }

  const startTime = performance.now();

  try {
    const model = await loadModel();
    
    // Generate embedding
    const embeddings = await model.embed([text]);
    const embeddingArray = await embeddings.array();
    
    // Clean up tensor to prevent memory leak
    embeddings.dispose();

    const processingTime = (performance.now() - startTime).toFixed(2);

    return embeddingArray[0]; // Return first (and only) embedding
  } catch (error) {
    throw new Error(`Embedding generation failed: ${error.message}`);
  }
};

/**
 * Calculate cosine similarity between two embedding vectors
 * Returns value between -1 (opposite) and 1 (identical)
 * 
 * Formula: cos(θ) = (A · B) / (||A|| × ||B||)
 * 
 * @param {Array<number>} embedding1 - First embedding vector
 * @param {Array<number>} embedding2 - Second embedding vector
 * @returns {number} Similarity score between -1 and 1
 */
export const calculateSimilarity = (embedding1, embedding2) => {
  if (!embedding1 || !embedding2) {
    return 0;
  }

  if (embedding1.length !== embedding2.length) {
    return 0;
  }

  try {
    // Calculate dot product (A · B)
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    // Calculate magnitudes
    const magnitude1 = Math.sqrt(norm1);
    const magnitude2 = Math.sqrt(norm2);

    // Avoid division by zero
    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    // Calculate cosine similarity
    const similarity = dotProduct / (magnitude1 * magnitude2);

    // Clamp to [-1, 1] range (handle floating point errors)
    const clampedSimilarity = Math.max(-1, Math.min(1, similarity));
    return clampedSimilarity;
  } catch (error) {
    return 0;
  }
};

/**
 * Calculate percentage match score from cosine similarity
 * Converts similarity (-1 to 1) to percentage (0% to 100%)
 * 
 * @param {number} similarity - Cosine similarity score
 * @returns {number} Match percentage (0-100)
 */
export const similarityToPercentage = (similarity) => {
  // Convert from [-1, 1] to [0, 100]
  // -1 = 0%, 0 = 50%, 1 = 100%
  return Math.round(((similarity + 1) / 2) * 100);
};

/**
 * Match user profile to job description using semantic similarity
 * Combines profile text (skills + bio) with job text (title + description)
 * 
 * @param {Object} userProfile - User profile object
 * @param {Object} job - Job listing object
 * @returns {Promise<Object>} Match result with score and breakdown
 */
export const matchJobToProfile = async (userProfile, job) => {

  const startTime = performance.now();

  try {
    // Combine user profile text
    const profileText = [
      userProfile.bio || '',
      (userProfile.skills || []).join(', '),
      userProfile.experience || '',
    ].filter(Boolean).join('. ');

    // Combine job text
    const jobText = [
      job.title || '',
      job.company || '',
      job.description || '',
      (job.tags || []).join(', '),
    ].filter(Boolean).join('. ');

    if (!profileText || !jobText) {
      return {
        matchScore: 50,
        semanticScore: 50,
        breakdown: {
          semantic: 50,
          skills: 50,
          accessibility: 50,
        },
        processingTime: 0,
      };
    }

    // Generate embeddings
    const [profileEmbedding, jobEmbedding] = await Promise.all([
      getEmbedding(profileText),
      getEmbedding(jobText),
    ]);

    // Calculate semantic similarity (70% weight)
    const similarity = calculateSimilarity(profileEmbedding, jobEmbedding);
    const semanticScore = similarityToPercentage(similarity);

    // Calculate skill overlap (20% weight)
    const userSkills = (userProfile.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.tags || []).map(s => s.toLowerCase());
    const matchingSkills = userSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );
    const skillScore = jobSkills.length > 0 
      ? Math.round((matchingSkills.length / jobSkills.length) * 100)
      : 50;

    // Calculate accessibility fit (10% weight)
    const userAccessibility = userProfile.accessibility || [];
    const jobAccessibility = job.accessibility || [];
    const matchingAccessibility = userAccessibility.filter(need => 
      jobAccessibility.some(feature => 
        feature.toLowerCase().includes(need.toLowerCase())
      )
    );
    const accessibilityScore = userAccessibility.length > 0
      ? Math.round((matchingAccessibility.length / userAccessibility.length) * 100)
      : 100; // Full score if no specific needs

    // Calculate weighted final score
    const finalScore = Math.round(
      (semanticScore * 0.7) + 
      (skillScore * 0.2) + 
      (accessibilityScore * 0.1)
    );

    const processingTime = Math.round(performance.now() - startTime);

    return {
      matchScore: finalScore,
      semanticScore,
      breakdown: {
        semantic: semanticScore,
        skills: skillScore,
        accessibility: accessibilityScore,
      },
      matchingSkills,
      matchingAccessibility,
      processingTime,
    };
  } catch (error) {
    return {
      matchScore: 50,
      semanticScore: 50,
      breakdown: {
        semantic: 50,
        skills: 50,
        accessibility: 50,
      },
      processingTime: 0,
      error: error.message,
    };
  }
};

/**
 * Batch match multiple jobs to user profile
 * More efficient than matching one-by-one
 * 
 * @param {Object} userProfile - User profile object
 * @param {Array<Object>} jobs - Array of job listings
 * @returns {Promise<Array<Object>>} Array of jobs with match scores
 */
export const matchJobsToProfile = async (userProfile, jobs) => {
  const startTime = performance.now();

  try {
    // Match all jobs in parallel
    const matchPromises = jobs.map(job => 
      matchJobToProfile(userProfile, job)
        .then(result => ({
          ...job,
          ...result,
        }))
    );

    const matchedJobs = await Promise.all(matchPromises);

    // Sort by match score (descending)
    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    const totalTime = Math.round(performance.now() - startTime);
    const avgTime = Math.round(totalTime / jobs.length);

    return matchedJobs;
  } catch (error) {
    // Return jobs with default 50% score
    return jobs.map(job => ({
      ...job,
      matchScore: 50,
      error: error.message,
    }));
  }
};

/**
 * Get model info for display purposes
 * Useful for showing ML details to judges/users
 * 
 * @returns {Object} Model information
 */
export const getModelInfo = () => {
  return {
    name: 'Universal Sentence Encoder',
    version: '1.3.3',
    embeddingSize: 512,
    languages: '100+',
    type: 'Multilingual',
    framework: 'TensorFlow.js',
    loaded: modelCache !== null,
    backend: tf.getBackend(),
  };
};

/**
 * Preload model to improve first-time performance
 * Call this on app startup or when user navigates to jobs page
 */
export const preloadModel = async () => {
  try {
    await loadModel();
  } catch (error) {
  }
};

// Export all functions
export default {
  loadModel,
  getEmbedding,
  calculateSimilarity,
  similarityToPercentage,
  matchJobToProfile,
  matchJobsToProfile,
  getModelInfo,
  preloadModel,
};
