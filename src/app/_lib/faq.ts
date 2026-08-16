/**
 * Lifted out of the Faq component so the server can also emit it as FAQPage
 * structured data. One list, two consumers — if the copy and the JSON-LD ever
 * disagreed, Google would treat the mismatch as a structured-data violation.
 */
export const FAQS = [
  {
    q: 'Is SafeRoute free to use?',
    a: 'Yes, SafeRoute offers a free plan with core navigation and safety alerts. For advanced features like real-time crime data, offline maps, and family tracking, upgrade to SafeRoute Pro.'
  },
  {
    q: 'How does SafeRoute determine safe routes?',
    a: 'SafeRoute analyzes verified community reports, historical incident data, and real-time alerts to score each route and recommend the safest path to your destination.'
  },
  {
    q: 'Does SafeRoute work offline?',
    a: "Core navigation and previously downloaded maps work offline. Real-time alerts and community reports require a connection and sync automatically once you're back online."
  },
  {
    q: 'Can I share my live location with family?',
    a: 'Yes. Add trusted contacts to your Safety Circle to share your live journey, ETA, and location so the people who matter most stay informed.'
  },
  {
    q: 'Which cities does SafeRoute support?',
    a: 'SafeRoute currently supports major cities across Nigeria, with new regions being added regularly based on community demand.'
  },
  {
    q: 'How do I report an unsafe area?',
    a: 'Tap the report button, choose the incident type, and add a photo, video, or quick note. Your report is shared with nearby users and verified by the community.'
  }
] as const;
