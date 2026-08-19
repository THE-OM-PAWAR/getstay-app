export interface CityFAQ {
  question: string;
  answer: string;
}

export const getBhopalFAQs = (): CityFAQ[] => [
  {
    question: "What is the average cost of a hostel in Bhopal?",
    answer: "Hostels in Bhopal typically range from ₹4,500 to ₹8,000 per month depending on location, amenities, and room sharing type. Single occupancy rooms range from ₹7,000-₹8,000, while double/triple sharing options cost ₹4,500-₹6,000. Basic amenities like WiFi, meals, and electricity are typically included."
  },
  {
    question: "Are there safe girls hostels in Bhopal?",
    answer: "Yes, Bhopal has many verified girls hostels featuring 24/7 CCTV surveillance, biometric access, and female wardens. Popular student hubs for girls hostels include MP Nagar, Kolar Road, and Indrapuri. All accommodations on GetStay undergo safety verification."
  },
  {
    question: "Which areas are best for student hostels in Bhopal?",
    answer: "MP Nagar, Kolar Road, Indrapuri, and areas near MANIT / RGPV / LNCT are the top locations. MP Nagar is preferred for its coaching centers and city connectivity, while MANIT and Indrapuri offer proximity to major colleges."
  },
  {
    question: "What amenities are standard in Bhopal hostels?",
    answer: "Standard amenities include high-speed WiFi, 2-3 daily meals (breakfast, lunch, dinner), power backup, hot water geysers, daily housekeeping, and round-the-clock security. Select premium stays also offer AC rooms and study lounges."
  }
];

export const getGenericCityFAQs = (cityName: string): CityFAQ[] => [
  {
    question: `What is the average cost of a hostel in ${cityName}?`,
    answer: `Hostels in ${cityName} typically range from ₹4,000 to ₹8,000 per month depending on location, amenities, and sharing type.`
  },
  {
    question: `Are there safe hostels for girls in ${cityName}?`,
    answer: `Yes, ${cityName} features verified hostels for girls with 24/7 security, CCTV surveillance, and warden supervision.`
  },
  {
    question: `What amenities are included in ${cityName} hostels?`,
    answer: `Common amenities include high-speed WiFi, daily meals, power backup, hot water, and security.`
  },
  {
    question: `How do I book a hostel in ${cityName}?`,
    answer: `You can browse verified stays on GetStay, compare room types, check photos, and book online directly.`
  }
];

export const getCityFAQs = (cityName: string): CityFAQ[] => {
  if (cityName.toLowerCase() === 'bhopal') {
    return getBhopalFAQs();
  }
  return getGenericCityFAQs(cityName);
};
