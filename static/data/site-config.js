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
    introduction: 'Most of my GenAI work starts with documents: extracting information, finding evidence, and keeping multi-step workflows reliable when the source is messy. I build the Python services, validation, and review paths around the model too.'
  },
  // Public profile destinations live here so they can be changed centrally
  // without touching the Google Sheets content.
  links: {
    github: 'https://github.com/Sakthivel018'
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
