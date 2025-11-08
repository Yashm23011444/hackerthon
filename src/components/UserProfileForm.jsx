import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserProfile } from '../hooks/useUserProfile';

const UserProfileForm = ({ onProfileComplete }) => {
  const {
    profile,
    updateProfile,
    addSkill,
    removeSkill,
    toggleAccessibility,
    validateProfile,
    calculateCompleteness,
    isProfileComplete
  } = useUserProfile();

  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular skills suggestions
  const popularSkills = [
    // Programming Languages
    'JavaScript', 'Python', 'Java', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
    // Frontend
    'React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind CSS', 'Next.js', 'Svelte',
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'FastAPI',
    // Databases
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQL', 'Firebase', 'DynamoDB',
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git',
    // Data & AI
    'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy',
    // Mobile
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS',
    // Design & Other
    'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'API Development', 'REST API', 'GraphQL',
    'Testing', 'Agile', 'Scrum', 'Communication', 'Leadership', 'Problem Solving'
  ];

  const experienceLevels = [
    { value: '0-1', label: 'Entry Level (0-1 years)' },
    { value: '1-3', label: 'Junior (1-3 years)' },
    { value: '3-5', label: 'Mid-Level (3-5 years)' },
    { value: '5-8', label: 'Senior (5-8 years)' },
    { value: '8+', label: 'Expert (8+ years)' }
  ];

  const accessibilityOptions = [
    { value: 'screen-reader', label: '🔊 Screen Reader Compatible' },
    { value: 'remote', label: '🏠 Remote Work Required' },
    { value: 'flexible-hours', label: '⏰ Flexible Hours' },
    { value: 'sign-language', label: '👋 Sign Language Support' },
    { value: 'mobility', label: '♿ Wheelchair Accessible' },
    { value: 'mental-health', label: '🧠 Mental Health Support' }
  ];

  const handleAddSkill = (skillToAdd) => {
    const skill = typeof skillToAdd === 'string' ? skillToAdd : currentSkill;
    
    if (!skill.trim()) {
      return;
    }
    const success = addSkill(skill.trim());
    
    if (success) {
      setCurrentSkill('');
      setShowSuggestions(false);
      setErrors({ ...errors, skills: undefined });
    } else {
    }
  };

  // Filter suggestions based on input
  const filteredSuggestions = currentSkill.trim()
    ? popularSkills.filter(skill => 
        skill.toLowerCase().includes(currentSkill.toLowerCase()) &&
        !profile.skills.includes(skill)
      ).slice(0, 8)
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowValidation(true);
    
    const validation = validateProfile();
    setErrors(validation.errors);

    if (validation.isValid && onProfileComplete) {
      onProfileComplete(profile);
    }
  };

  const completeness = calculateCompleteness();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      {/* Header with Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Your Profile
          </h2>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Profile Completeness
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {completeness}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completeness}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              showValidation && errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all`}
            placeholder="John Doe"
          />
          <AnimatePresence>
            {showValidation && errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Skills Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skills * (Add at least 3)
          </label>
          <div className="relative">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => {
                  setCurrentSkill(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Type to search skills... (e.g., React, Python)"
              />
              <motion.button
                type="button"
                onClick={() => handleAddSkill()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add
              </motion.button>
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                >
                  {filteredSuggestions.map((skill, index) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      <span className="font-medium">{skill}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 min-h-[50px]">
            <AnimatePresence>
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {showValidation && errors.skills && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {errors.skills}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Experience Level */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Experience Level *
          </label>
          <select
            value={profile.experience}
            onChange={(e) => updateProfile({ experience: e.target.value })}
            className={`w-full px-4 py-3 rounded-lg border ${
              showValidation && errors.experience
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all`}
          >
            <option value="">Select your experience level</option>
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <AnimatePresence>
            {showValidation && errors.experience && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.experience}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preferred Location
          </label>
          <input
            type="text"
            value={profile.location}
            onChange={(e) => updateProfile({ location: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Remote, New York, San Francisco"
          />
        </motion.div>

        {/* Salary Range */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Expected Salary (USD/year)
          </label>
          <input
            type="text"
            value={profile.salary}
            onChange={(e) => updateProfile({ salary: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., $80,000 - $120,000"
          />
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Professional Bio * (Min 20 characters)
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => updateProfile({ bio: e.target.value })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              showValidation && errors.bio
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:outline-none transition-all resize-none`}
            placeholder="Tell us about yourself, your experience, and what you're looking for in your next role..."
          />
          <div className="flex justify-between items-center mt-1">
            <AnimatePresence>
              {showValidation && errors.bio && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm"
                >
                  {errors.bio}
                </motion.p>
              )}
            </AnimatePresence>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {profile.bio.length} characters
            </span>
          </div>
        </motion.div>

        {/* Accessibility Needs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Accessibility Needs (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accessibilityOptions.map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  profile.accessibility.includes(option.value)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={profile.accessibility.includes(option.value)}
                  onChange={() => toggleAccessibility(option.value)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-900 dark:text-white font-medium">
                  {option.label}
                </span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-6"
        >
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={completeness < 80}
            className={`w-full py-4 px-6 rounded-lg font-bold text-lg text-white transition-all ${
              completeness >= 80
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {completeness >= 80 ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate AI Job Matches
              </span>
            ) : (
              `Complete ${Math.ceil((80 - completeness) / 10)} more fields to unlock AI matching`
            )}
          </motion.button>

          {/* Info Text */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            🤖 Powered by TensorFlow.js & Universal Sentence Encoder
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UserProfileForm;
