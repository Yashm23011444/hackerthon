/**
 * 💼 Sample Jobs Database
 * 
 * Diverse job listings for AI matching demo
 * Each job includes accessibility features to showcase inclusive hiring
 * 
 * Total: 30 jobs across multiple domains
 */

export const jobsData = [
  // ===== SOFTWARE ENGINEERING =====
  {
    id: 'job-001',
    title: 'Senior Full Stack Developer',
    company: 'TechVision India',
    location: 'Remote / Bangalore',
    salary: '₹18-28 LPA',
    type: 'Full-time',
    description: 'Build scalable web applications using React, Node.js, and cloud technologies. Work with cross-functional teams to deliver high-quality software solutions. Mentor junior developers and contribute to technical decisions.',
    tags: ['React', 'Node.js', 'MongoDB', 'AWS', 'TypeScript', 'GraphQL'],
    accessibility: ['Screen Reader Compatible', 'Flexible Hours', 'Remote Work', 'Ergonomic Workspace'],
    experience: '4-6 years',
  },
  {
    id: 'job-002',
    title: 'Frontend React Developer',
    company: 'Digital Innovations',
    location: 'Hybrid / Mumbai',
    salary: '₹12-20 LPA',
    type: 'Full-time',
    description: 'Create stunning user interfaces with React and modern JavaScript. Collaborate with designers and backend teams. Focus on performance, accessibility, and user experience.',
    tags: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Webpack'],
    accessibility: ['Remote Work Available', 'Flexible Schedule', 'Screen Reader Support'],
    experience: '2-4 years',
  },
  {
    id: 'job-003',
    title: 'Python Backend Engineer',
    company: 'DataFlow Systems',
    location: 'Remote',
    salary: '₹15-25 LPA',
    type: 'Full-time',
    description: 'Design and implement robust backend services using Python, Django, and PostgreSQL. Build RESTful APIs and microservices architecture. Ensure security and scalability.',
    tags: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Redis', 'REST API'],
    accessibility: ['100% Remote', 'Async Communication', 'Flexible Hours', 'Voice Tools Available'],
    experience: '3-5 years',
  },
  {
    id: 'job-004',
    title: 'DevOps Engineer',
    company: 'CloudScale Solutions',
    location: 'Bangalore / Remote',
    salary: '₹16-26 LPA',
    type: 'Full-time',
    description: 'Manage cloud infrastructure, CI/CD pipelines, and deployment automation. Work with AWS, Kubernetes, and Docker. Monitor system performance and optimize costs.',
    tags: ['AWS', 'Kubernetes', 'Docker', 'Jenkins', 'Terraform', 'Linux'],
    accessibility: ['Remote Option', 'Ergonomic Equipment Provided', 'Flexible Work Hours'],
    experience: '3-5 years',
  },
  {
    id: 'job-005',
    title: 'Mobile App Developer (React Native)',
    company: 'AppCraft Studios',
    location: 'Hybrid / Delhi',
    salary: '₹14-22 LPA',
    type: 'Full-time',
    description: 'Build cross-platform mobile applications using React Native. Implement native features, optimize performance, and ensure smooth user experience across iOS and Android.',
    tags: ['React Native', 'JavaScript', 'iOS', 'Android', 'Redux', 'Firebase'],
    accessibility: ['Hybrid Model', 'Accessible Office', 'Screen Reader Tools', 'Flexible Schedule'],
    experience: '2-4 years',
  },

  // ===== DATA SCIENCE & AI =====
  {
    id: 'job-006',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations Lab',
    location: 'Remote / Pune',
    salary: '₹20-32 LPA',
    type: 'Full-time',
    description: 'Develop and deploy machine learning models for real-world applications. Work with TensorFlow, PyTorch, and cloud ML platforms. Collaborate with data scientists and engineers.',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision'],
    accessibility: ['Remote Work', 'Flexible Hours', 'Async Collaboration', 'Voice Commands Available'],
    experience: '3-6 years',
  },
  {
    id: 'job-007',
    title: 'Data Analyst',
    company: 'InsightsPro Analytics',
    location: 'Remote',
    salary: '₹10-18 LPA',
    type: 'Full-time',
    description: 'Analyze large datasets, create dashboards, and provide actionable insights. Use SQL, Python, and visualization tools. Present findings to stakeholders.',
    tags: ['Python', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Statistics'],
    accessibility: ['100% Remote', 'Screen Reader Compatible', 'Flexible Schedule', 'Clear Communication'],
    experience: '2-4 years',
  },
  {
    id: 'job-008',
    title: 'Data Scientist',
    company: 'Quantum Analytics',
    location: 'Bangalore',
    salary: '₹18-30 LPA',
    type: 'Full-time',
    description: 'Build predictive models, perform statistical analysis, and extract insights from complex datasets. Work on cutting-edge AI projects in healthcare and finance domains.',
    tags: ['Python', 'R', 'Machine Learning', 'Statistics', 'Deep Learning', 'Big Data'],
    accessibility: ['Remote Option', 'Ergonomic Setup', 'Flexible Work', 'Accessible Tools'],
    experience: '3-5 years',
  },

  // ===== DESIGN & CREATIVE =====
  {
    id: 'job-009',
    title: 'Senior UX/UI Designer',
    company: 'DesignHub Studio',
    location: 'Hybrid / Mumbai',
    salary: '₹15-24 LPA',
    type: 'Full-time',
    description: 'Design intuitive and beautiful user experiences for web and mobile applications. Conduct user research, create wireframes and prototypes. Lead design system development.',
    tags: ['Figma', 'Adobe XD', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
    accessibility: ['Hybrid Work', 'Voice Control Tools', 'Flexible Hours', 'Accessible Workplace'],
    experience: '4-6 years',
  },
  {
    id: 'job-010',
    title: 'Product Designer',
    company: 'InnoDesign Labs',
    location: 'Remote / Bangalore',
    salary: '₹12-20 LPA',
    type: 'Full-time',
    description: 'Own the end-to-end design process from research to launch. Collaborate with product managers and engineers. Focus on accessibility and inclusive design.',
    tags: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Accessibility', 'Design Thinking'],
    accessibility: ['Remote First', 'Screen Magnification Tools', 'Flexible Schedule', 'Inclusive Team'],
    experience: '3-5 years',
  },
  {
    id: 'job-011',
    title: 'Graphic Designer',
    company: 'Creative Minds Agency',
    location: 'Hybrid / Delhi',
    salary: '₹8-15 LPA',
    type: 'Full-time',
    description: 'Create visual content for digital and print media. Design marketing materials, social media graphics, and brand identities. Work with cross-functional teams.',
    tags: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Branding', 'Typography', 'Visual Design'],
    accessibility: ['Flexible Work', 'Ergonomic Workspace', 'Color Blind Friendly Tools', 'Remote Option'],
    experience: '2-4 years',
  },

  // ===== CONTENT & MARKETING =====
  {
    id: 'job-012',
    title: 'Content Writer (Tech)',
    company: 'TechWrite Solutions',
    location: 'Remote',
    salary: '₹8-14 LPA',
    type: 'Full-time',
    description: 'Write technical documentation, blog posts, and marketing content for SaaS products. Research complex topics and explain them clearly. SEO optimization and content strategy.',
    tags: ['Technical Writing', 'Content Strategy', 'SEO', 'Documentation', 'Blogging', 'Research'],
    accessibility: ['100% Remote', 'Voice Recognition Software', 'Flexible Deadlines', 'Async Work'],
    experience: '2-4 years',
  },
  {
    id: 'job-013',
    title: 'Digital Marketing Specialist',
    company: 'GrowthHackers India',
    location: 'Hybrid / Mumbai',
    salary: '₹10-18 LPA',
    type: 'Full-time',
    description: 'Plan and execute digital marketing campaigns across multiple channels. Manage social media, email marketing, and paid advertising. Analyze performance and optimize ROI.',
    tags: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Google Analytics', 'Content Marketing'],
    accessibility: ['Hybrid Model', 'Screen Reader Support', 'Flexible Hours', 'Remote Days'],
    experience: '3-5 years',
  },
  {
    id: 'job-014',
    title: 'Copywriter',
    company: 'WordSmith Creative',
    location: 'Remote / Bangalore',
    salary: '₹7-13 LPA',
    type: 'Full-time',
    description: 'Craft compelling copy for websites, ads, and marketing campaigns. Write persuasive product descriptions and landing pages. Collaborate with design and marketing teams.',
    tags: ['Copywriting', 'Content Writing', 'SEO', 'Marketing', 'Storytelling', 'Brand Voice'],
    accessibility: ['Remote Work', 'Voice Typing Tools', 'Flexible Schedule', 'Async Communication'],
    experience: '2-3 years',
  },

  // ===== PRODUCT & MANAGEMENT =====
  {
    id: 'job-015',
    title: 'Product Manager',
    company: 'NextGen Products',
    location: 'Bangalore',
    salary: '₹22-35 LPA',
    type: 'Full-time',
    description: 'Define product vision and strategy. Work with engineering, design, and business teams. Conduct market research, prioritize features, and drive product launches.',
    tags: ['Product Management', 'Agile', 'Strategy', 'Analytics', 'User Research', 'Roadmapping'],
    accessibility: ['Remote Option', 'Flexible Work', 'Accessible Office', 'Clear Documentation'],
    experience: '5-8 years',
  },
  {
    id: 'job-016',
    title: 'Project Manager (Tech)',
    company: 'Agile Solutions',
    location: 'Hybrid / Pune',
    salary: '₹15-24 LPA',
    type: 'Full-time',
    description: 'Lead software development projects using Agile methodologies. Coordinate teams, manage timelines, and ensure project success. Facilitate scrum ceremonies and remove blockers.',
    tags: ['Project Management', 'Scrum', 'Agile', 'Jira', 'Communication', 'Leadership'],
    accessibility: ['Hybrid Work', 'Video Call Support', 'Flexible Hours', 'Accessible Tools'],
    experience: '4-6 years',
  },

  // ===== CUSTOMER SUCCESS & SUPPORT =====
  {
    id: 'job-017',
    title: 'Customer Success Manager',
    company: 'ClientFirst SaaS',
    location: 'Remote',
    salary: '₹12-20 LPA',
    type: 'Full-time',
    description: 'Build strong relationships with customers. Ensure product adoption and customer satisfaction. Conduct training sessions and gather feedback for product improvements.',
    tags: ['Customer Success', 'SaaS', 'Communication', 'Training', 'CRM', 'Analytics'],
    accessibility: ['100% Remote', 'Flexible Schedule', 'Voice Tools', 'Async Communication'],
    experience: '3-5 years',
  },
  {
    id: 'job-018',
    title: 'Technical Support Engineer',
    company: 'SupportHub Technologies',
    location: 'Remote / Bangalore',
    salary: '₹8-15 LPA',
    type: 'Full-time',
    description: 'Provide technical support to customers via chat, email, and phone. Troubleshoot issues, document solutions, and collaborate with engineering teams.',
    tags: ['Technical Support', 'Troubleshooting', 'Customer Service', 'Documentation', 'Communication'],
    accessibility: ['Remote Work', 'Screen Reader Compatible', 'Flexible Shifts', 'Clear Processes'],
    experience: '1-3 years',
  },

  // ===== QUALITY ASSURANCE =====
  {
    id: 'job-019',
    title: 'QA Automation Engineer',
    company: 'TestPro Solutions',
    location: 'Hybrid / Mumbai',
    salary: '₹12-20 LPA',
    type: 'Full-time',
    description: 'Design and implement automated test frameworks. Write test scripts using Selenium and Cypress. Ensure software quality through comprehensive testing strategies.',
    tags: ['QA Automation', 'Selenium', 'Cypress', 'JavaScript', 'Testing', 'CI/CD'],
    accessibility: ['Hybrid Model', 'Ergonomic Setup', 'Flexible Hours', 'Remote Days'],
    experience: '3-5 years',
  },
  {
    id: 'job-020',
    title: 'Manual QA Tester',
    company: 'Quality First Labs',
    location: 'Remote',
    salary: '₹6-12 LPA',
    type: 'Full-time',
    description: 'Perform manual testing of web and mobile applications. Create test cases, report bugs, and verify fixes. Ensure products meet quality standards before release.',
    tags: ['Manual Testing', 'Test Cases', 'Bug Reporting', 'QA', 'Attention to Detail'],
    accessibility: ['100% Remote', 'Screen Reader Support', 'Flexible Hours', 'Clear Documentation'],
    experience: '1-3 years',
  },

  // ===== BUSINESS & OPERATIONS =====
  {
    id: 'job-021',
    title: 'Business Analyst',
    company: 'Strategic Insights Co',
    location: 'Bangalore',
    salary: '₹14-22 LPA',
    type: 'Full-time',
    description: 'Analyze business processes and requirements. Create detailed specifications for technology solutions. Bridge communication between business and technical teams.',
    tags: ['Business Analysis', 'Requirements Gathering', 'SQL', 'Documentation', 'Communication'],
    accessibility: ['Remote Option', 'Flexible Work', 'Voice Tools', 'Accessible Office'],
    experience: '3-5 years',
  },
  {
    id: 'job-022',
    title: 'Operations Manager',
    company: 'OptiFlow Systems',
    location: 'Hybrid / Delhi',
    salary: '₹16-26 LPA',
    type: 'Full-time',
    description: 'Optimize business operations and processes. Manage teams, implement efficiency improvements, and ensure smooth day-to-day operations. Data-driven decision making.',
    tags: ['Operations', 'Process Improvement', 'Team Management', 'Analytics', 'Leadership'],
    accessibility: ['Hybrid Work', 'Ergonomic Office', 'Flexible Schedule', 'Remote Days'],
    experience: '4-7 years',
  },

  // ===== CYBERSECURITY =====
  {
    id: 'job-023',
    title: 'Cybersecurity Analyst',
    company: 'SecureNet Solutions',
    location: 'Remote / Bangalore',
    salary: '₹18-28 LPA',
    type: 'Full-time',
    description: 'Monitor security systems, investigate threats, and implement security measures. Conduct vulnerability assessments and security audits. Stay updated on latest threats.',
    tags: ['Cybersecurity', 'Security Analysis', 'Threat Detection', 'Firewalls', 'Penetration Testing'],
    accessibility: ['Remote Work', 'Flexible Hours', 'Screen Reader Tools', 'Clear Processes'],
    experience: '3-5 years',
  },

  // ===== BLOCKCHAIN & WEB3 =====
  {
    id: 'job-024',
    title: 'Blockchain Developer',
    company: 'Web3 Innovations',
    location: 'Remote',
    salary: '₹20-35 LPA',
    type: 'Full-time',
    description: 'Build decentralized applications and smart contracts. Work with Ethereum, Solidity, and web3 technologies. Contribute to blockchain protocol development.',
    tags: ['Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts', 'Web3', 'DeFi'],
    accessibility: ['100% Remote', 'Async Work', 'Flexible Hours', 'Global Team'],
    experience: '2-5 years',
  },

  // ===== GAME DEVELOPMENT =====
  {
    id: 'job-025',
    title: 'Unity Game Developer',
    company: 'GameStudio Pro',
    location: 'Hybrid / Mumbai',
    salary: '₹14-24 LPA',
    type: 'Full-time',
    description: 'Develop engaging mobile and PC games using Unity. Implement game mechanics, optimize performance, and create immersive experiences. Collaborate with artists and designers.',
    tags: ['Unity', 'C#', 'Game Development', '3D Graphics', 'Mobile Games', 'Optimization'],
    accessibility: ['Hybrid Model', 'Flexible Hours', 'Ergonomic Setup', 'Creative Environment'],
    experience: '3-5 years',
  },

  // ===== HR & RECRUITMENT =====
  {
    id: 'job-026',
    title: 'Technical Recruiter',
    company: 'TalentHub Recruiters',
    location: 'Remote',
    salary: '₹10-18 LPA',
    type: 'Full-time',
    description: 'Source and hire top tech talent. Conduct interviews, negotiate offers, and build talent pipelines. Work closely with hiring managers to understand requirements.',
    tags: ['Recruiting', 'Talent Acquisition', 'Communication', 'Interviewing', 'HR Tech'],
    accessibility: ['100% Remote', 'Flexible Schedule', 'Voice Tools', 'Video Call Support'],
    experience: '2-4 years',
  },

  // ===== SALES =====
  {
    id: 'job-027',
    title: 'B2B Sales Executive (SaaS)',
    company: 'CloudSales Inc',
    location: 'Bangalore / Remote',
    salary: '₹12-22 LPA + Commission',
    type: 'Full-time',
    description: 'Drive SaaS product sales to enterprise clients. Manage sales pipeline, conduct product demos, and close deals. Build long-term customer relationships.',
    tags: ['B2B Sales', 'SaaS Sales', 'Lead Generation', 'CRM', 'Negotiation', 'Communication'],
    accessibility: ['Remote Option', 'Flexible Work', 'Video Call Tools', 'Clear Processes'],
    experience: '3-5 years',
  },

  // ===== TEACHING & TRAINING =====
  {
    id: 'job-028',
    title: 'Online Coding Instructor',
    company: 'CodeLearn Academy',
    location: 'Remote',
    salary: '₹8-16 LPA',
    type: 'Full-time',
    description: 'Teach programming to students online. Create course content, conduct live sessions, and provide mentorship. Help students build real-world projects.',
    tags: ['Teaching', 'Programming', 'Education', 'Mentoring', 'Content Creation', 'Communication'],
    accessibility: ['100% Remote', 'Flexible Schedule', 'Voice Tools', 'Screen Share Support'],
    experience: '2-4 years',
  },

  // ===== ACCESSIBILITY SPECIALIST =====
  {
    id: 'job-029',
    title: 'Accessibility Engineer',
    company: 'Inclusive Tech Solutions',
    location: 'Remote / Bangalore',
    salary: '₹15-25 LPA',
    type: 'Full-time',
    description: 'Ensure digital products are accessible to people with disabilities. Conduct accessibility audits, implement WCAG guidelines, and work with design/engineering teams.',
    tags: ['Accessibility', 'WCAG', 'ARIA', 'Screen Readers', 'Inclusive Design', 'HTML'],
    accessibility: ['100% Remote', 'Flexible Hours', 'Assistive Tech Provided', 'Inclusive Culture'],
    experience: '3-5 years',
  },

  // ===== FREELANCE/CONTRACT =====
  {
    id: 'job-030',
    title: 'Freelance Web Developer',
    company: 'FreelanceHub Platform',
    location: 'Remote',
    salary: '₹50-150/hour',
    type: 'Contract',
    description: 'Take on web development projects on a contract basis. Build websites and web applications for various clients. Flexible hours and project-based work.',
    tags: ['Web Development', 'HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Freelance'],
    accessibility: ['100% Remote', 'Completely Flexible', 'Voice Tools', 'Choose Your Projects'],
    experience: '1-3 years',
  },
];

// Export default
export default jobsData;

// Helper functions

/**
 * Get jobs by category
 */
export const getJobsByCategory = (category) => {
  const categories = {
    engineering: ['React', 'Node.js', 'Python', 'Java', 'JavaScript'],
    design: ['Figma', 'UI Design', 'UX Research', 'Adobe'],
    data: ['Data', 'Machine Learning', 'Python', 'SQL', 'Analytics'],
    content: ['Content', 'Writing', 'Marketing', 'SEO'],
    management: ['Product', 'Project', 'Manager', 'Leadership'],
  };

  const keywords = categories[category.toLowerCase()] || [];
  return jobsData.filter(job => 
    keywords.some(keyword => 
      job.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase())) ||
      job.title.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

/**
 * Get remote jobs only
 */
export const getRemoteJobs = () => {
  return jobsData.filter(job => 
    job.location.toLowerCase().includes('remote')
  );
};

/**
 * Get accessible jobs (with specific accessibility features)
 */
export const getAccessibleJobs = () => {
  return jobsData.filter(job => 
    job.accessibility && job.accessibility.length > 0
  );
};

/**
 * Get job by ID
 */
export const getJobById = (id) => {
  return jobsData.find(job => job.id === id);
};
