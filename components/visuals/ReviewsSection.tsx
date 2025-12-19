
import React, { useEffect, useState } from 'react';
import { Review } from '../../types';

// Fallback Default Reviews
const DEFAULT_REVIEWS: Review[] = [
    { id: '1', author: 'Maria Popescu', role: 'Părinte', stars: 5, text: 'O experiență extraordinară pentru fiica mea! Organizarea a fost impecabilă.', isVisible: true },
    { id: '2', author: 'Andrei Ionescu', role: 'Participant', stars: 5, text: 'Cea mai tare scenă pe care am cântat vreodată. M-am simțit ca un star!', isVisible: true },
    { id: '3', author: 'Elena Dumitrescu', role: 'Profesor Canto', stars: 5, text: 'Recomand acest festival tuturor elevilor mei. Juriul este foarte corect și feedback-ul valoros.', isVisible: true },
    { id: '4', author: 'George Radu', role: 'Părinte', stars: 4, text: 'Atmosferă superbă, sunet bun. Ne vom întoarce cu siguranță la anul.', isVisible: true },
    { id: '5', author: 'Ioana Stan', role: 'Participant', stars: 5, text: 'Am câștigat premiul II și sunt foarte mândră! Mulțumesc VoiceUP!', isVisible: true },
];

const StarRating: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex gap-1 text-yellow-400 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < count ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const ReviewsSection: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);

    const loadReviews = () => {
        const stored = localStorage.getItem('reviewsConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Filter only visible reviews
                const visible = parsed.filter((r: Review) => r.isVisible !== false);
                if (visible.length > 0) setReviews(visible);
            } catch (e) { console.error(e); }
        }
    };

    useEffect(() => {
        loadReviews();
        // Listen for updates from Admin
        window.addEventListener('reviewsUpdated', loadReviews);
        return () => window.removeEventListener('reviewsUpdated', loadReviews);
    }, []);

    // NOTE: To create a perfect infinite scroll without JS calculations, we use a CSS-only technique.
    // We render TWO identical sets of reviews in a flex container.
    // We animate the container to move left by -50% (the width of one set).
    // When it reaches -50%, it instantly snaps back to 0%, creating an seamless loop.
    // Ideally, we need enough reviews to fill the screen width. If few reviews, we duplicate them more.
    
    const displayReviews = [...reviews];
    // Ensure we have enough items for a smooth scroll even on large screens
    if (displayReviews.length < 5) {
        displayReviews.push(...reviews); // Duplicate to fill space if needed
    }

    return (
        <div className="overflow-hidden py-10 relative">
            <div className="text-center mb-10 px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mb-4">
                    Ce spun participanții
                </h2>
                <div className="w-24 h-1 bg-brand-yellow mx-auto rounded-full"></div>
            </div>

            {/* Gradient Masks for Fade Effect */}
            <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none"></div>

            {/* Scrolling Track */}
            <div className="scrolling-track-container">
                <div className="scrolling-track">
                    {/* Set 1 */}
                    {displayReviews.map((review, idx) => (
                        <div key={`set1-${review.id}-${idx}`} className="review-card">
                            <ReviewCardContent review={review} />
                        </div>
                    ))}
                    {/* Set 2 (Duplicate for Seamless Loop) */}
                    {displayReviews.map((review, idx) => (
                        <div key={`set2-${review.id}-${idx}`} className="review-card">
                            <ReviewCardContent review={review} />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .scrolling-track-container {
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                }
                
                .scrolling-track {
                    display: flex;
                    gap: 24px;
                    width: max-content;
                    /* Move -50% because track contains 2 sets of items. -50% is exactly the width of 1 set. */
                    animation: scroll-left 60s linear infinite;
                }
                
                .scrolling-track:hover {
                    animation-play-state: paused;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                .review-card {
                    flex: 0 0 300px;
                    width: 300px;
                }
                
                @media (min-width: 768px) {
                    .review-card {
                        flex: 0 0 350px;
                        width: 350px;
                    }
                }
            `}</style>
        </div>
    );
};

const ReviewCardContent: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between h-full transform transition-transform hover:-translate-y-1 hover:shadow-xl">
        <div>
            <StarRating count={review.stars} />
            <p className="text-gray-600 text-sm italic mb-6 leading-relaxed line-clamp-4">"{review.text}"</p>
        </div>
        <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {review.author.charAt(0)}
            </div>
            <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{review.author}</h4>
                <p className="text-xs text-brand-purple font-semibold uppercase truncate">{review.role}</p>
            </div>
        </div>
    </div>
);

export default ReviewsSection;
