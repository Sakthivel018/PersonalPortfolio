/*
 * Public presentation settings. Edit this file to change the portfolio's
 * framing and which existing Projects rows appear as side projects.
 * Project content itself remains in the existing Google Sheet.
 */
window.PORTFOLIO_CONFIG = Object.freeze({
  identity: {
    displayName: 'Sakthivel Raja',
    role: 'GenAI Engineer',
    location: 'Chennai, India',
    headline: 'First the APIs.\nNow the agents.',
    introduction: 'I work on the parts that make AI useful in a real workflow: getting information out of difficult documents, keeping multi-step systems on track, and checking the result before it moves on.'
  },
  presentation: {
    showPersonalProjects: true,
    showWriting: true,
    // Exact project titles from the Projects sheet. Update this list to decide
    // which existing rows belong in the personal projects section.
    personalProjectTitles: [
      'Data Extraction',
      'Data Extraction System',
      'LLM Powered Chatbots',
      'LLM-Powered Chatbots',
      'Voice Based Email Automation',
      'Voice-Based Email System',
      'Online Voting System',
      'Pattern Matching - RegEx',
      'ETL System Using AI & Chatbot'
    ]
  }
});
