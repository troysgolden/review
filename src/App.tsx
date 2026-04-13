import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, ArrowRight, CheckCircle2, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import { ReviewStep, ReviewConfig, FeedbackData } from './types';

// --- Configuration ---
const DEFAULT_CONFIG: ReviewConfig = {
  brandName: "Ignite Digital",
  logoUrl: "https://picsum.photos/seed/ignite/200/60", // Placeholder logo
  googleReviewUrl: "https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID",
  trustpilotUrl: "https://www.trustpilot.com/evaluate/yourdomain.com",
  adminEmail: "admin@ignitedigital.com",
  accentColor: "#2563eb", // Blue-600
};

export default function App() {
  const [step, setStep] = useState<ReviewStep>('rating');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<ReviewConfig>(DEFAULT_CONFIG);
  
  // URL Params
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    campaign: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialRating = params.get('rating');
    const clientName = params.get('client');
    const clientEmail = params.get('email');
    const campaign = params.get('campaign');
    const brand = params.get('brand');

    if (initialRating) {
      const r = parseInt(initialRating);
      if (r >= 1 && r <= 5) {
        handleRatingSelect(r);
      }
    }

    if (clientName || clientEmail || campaign) {
      setClientInfo({
        name: clientName || '',
        email: clientEmail || '',
        campaign: campaign || ''
      });
    }

    if (brand) {
      // In a real app, you might fetch brand config from an API
      setConfig(prev => ({ ...prev, brandName: brand }));
    }
  }, []);

  const handleRatingSelect = (selectedRating: number) => {
    setRating(selectedRating);
    if (selectedRating >= 4) {
      setStep('redirecting');
      // Simulate a short delay for UX before redirect
      setTimeout(() => {
        window.location.href = config.googleReviewUrl;
      }, 1500);
    } else {
      setStep('feedback');
    }
  };

  const handleFeedbackSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const feedback: FeedbackData = {
      rating,
      comment: formData.get('comment') as string,
      name: (formData.get('name') as string) || clientInfo.name,
      email: (formData.get('email') as string) || clientInfo.email,
      client: clientInfo.name,
      campaign: clientInfo.campaign
    };

    console.log('Submitting feedback:', feedback);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');
      
      setStep('success');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Using a simple alert for now, but in a real app we'd use a toast or inline error
      console.error('There was an error submitting your feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          {config.logoUrl ? (
            <img 
              src={config.logoUrl} 
              alt={config.brandName} 
              className="h-12 mx-auto mb-4 object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <h1 className="text-2xl font-bold tracking-tight">{config.brandName}</h1>
          )}
        </div>

        <motion.div 
          layout
          className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 'rating' && (
              <motion.div
                key="rating"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 text-center"
              >
                <h2 className="text-xl font-semibold mb-2">How was your experience?</h2>
                <p className="text-gray-500 mb-8 text-sm">Your feedback helps us improve our service.</p>
                
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingSelect(star)}
                      className="p-1 transition-transform active:scale-90"
                    >
                      <Star
                        size={40}
                        className={`transition-colors duration-200 ${
                          (hoverRating || rating) >= star 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-400 px-2">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </motion.div>
            )}

            {step === 'redirecting' && (
              <motion.div
                key="redirecting"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <CheckCircle2 size={64} className="text-green-500" />
                    <motion.div 
                      className="absolute inset-0 border-4 border-green-500 rounded-full"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3">Thank you so much!</h2>
                <p className="text-gray-600 mb-8">
                  We're thrilled you had a great experience. Redirecting you to share your review publicly...
                </p>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600">
                  <Loader2 className="animate-spin" size={18} />
                  <span>Opening Google Reviews</span>
                </div>
              </motion.div>
            )}

            {step === 'feedback' && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8"
              >
                <button 
                  onClick={() => setStep('rating')}
                  className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors mb-6 group"
                >
                  <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to rating</span>
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold">We're sorry to hear that</h2>
                    <p className="text-xs text-gray-500">Please tell us how we can improve.</p>
                  </div>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                      What could we have done better?
                    </label>
                    <textarea
                      name="comment"
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                      placeholder="Your feedback..."
                    />
                  </div>

                  {!clientInfo.name && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wider">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <span>Send Feedback</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center"
              >
                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-3">Feedback Received</h2>
                <p className="text-gray-600 mb-0">
                  Thank you for your honesty. Our team has been notified and we will look into this immediately.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
