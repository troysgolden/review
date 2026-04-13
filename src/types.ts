export type ReviewStep = 'rating' | 'feedback' | 'success' | 'redirecting';

export interface ReviewConfig {
  brandName: string;
  logoUrl?: string;
  googleReviewUrl: string;
  trustpilotUrl?: string;
  adminEmail: string;
  accentColor: string;
}

export interface FeedbackData {
  rating: number;
  comment: string;
  name?: string;
  email?: string;
  client?: string;
  campaign?: string;
}
