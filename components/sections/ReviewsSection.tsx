import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Review, SectionConfig } from '../../types';
import SectionTitle from '../ui/SectionTitle';
import { toast } from 'sonner';

// Fallback Default Reviews
const DEFAULT_REVIEWS: Review[] = [
    { id: '1', author: 'Maria Popescu', role: 'Părinte', stars: 5, text: 'O experiență extraordinară pentru fiica mea! Organizarea a fost impecabilă.', isVisible: true },
    { id: '2', author: 'Andrei Ionescu', role: 'Participant', stars: 5, text: 'Cea mai tare scenă pe care am cântat vreodată. M-am simțit ca un star!', isVisible: true },
    { id: '3', author: 'Elena Dumitrescu', role: 'Profesor Canto', stars: 5, text: 'Recomand acest festival tuturor elevilor mei. Juriul este foarte corect și feedback-ul valoros.', isVisible: true },
    { id: '4', author: 'George Radu', role: 'Părinte', stars: 4, text: 'Atmosferă superbă, sunet bun. Ne vom întoarce cu siguranță la anul.', isVisible: true },
    { id: '5', author: 'Ioana Stan', role: 'Participant', stars: 5, text: 'Am câștigat premiul II și sunt foarte mândră! Mulțumesc VoiceUP!', isVisible: true },
];

const StarRating: React.FC<{ count: number }> = ({ count }) => (
    <div className="flex gap-0.5 text-yellow-400">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < count ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const ReviewCardContent: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_4px_20px_-5px_rgba(0,0,0,0.08),0_15px_35px_-2px_rgba(0,0,0,0.05)] border border-gray-100 h-full flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-xl group">
        
        {/* Accent Top Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-purple to-brand-pink opacity-90"></div>

        {/* Header: User Info & Stars */}
        <div className="flex justify-between items-start mb-5 pt-2">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-50 border-2 border-white shadow-md flex items-center justify-center text-brand-purple font-black text-sm shrink-0">
                    {review.author.charAt(0)}
                </div>
                {/* Name & Role */}
                <div>
                    <h4 className="font-black text-gray-900 text-base leading-tight">{review.author}</h4>
                    {review.role && <p className="text-[11px] font-bold text-brand-pink uppercase tracking-widest mt-0.5">{review.role}</p>}
                </div>
            </div>
            
            {/* Stars */}
            <div className="bg-yellow-50/50 px-3 py-1.5 rounded-full border border-yellow-100/50">
                <StarRating count={review.stars} />
            </div>
        </div>

        {/* Content */}
        <div className="flex-grow relative">
            {/* Quote Icon Background */}
            <div className="absolute -top-4 -left-2 text-6xl text-gray-100 font-serif leading-none -z-10 opacity-60">"</div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed italic pl-1 relative z-10 font-medium">
                {review.text}
            </p>
        </div>
    </div>
);

const AddReviewModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: (review: any) => void }> = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        author: '',
        role: '',
        stars: 5,
        text: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.author || !formData.text) return;
        onSubmit(formData);
        setFormData({ author: '', role: '', stars: 5, text: '' });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in relative">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Adaugă Recenzie</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="flex flex-col items-center justify-center mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2">Nota Ta</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, stars: star })}
                                    className={`text-3xl transition-transform hover:scale-110 ${star <= formData.stars ? 'text-yellow-400' : 'text-gray-200'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Numele Tău <span className="text-red-500">*</span></label>
                            <input required value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="ex: Maria Ionescu" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Status (Opțional)</label>
                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none font-bold">
                                <option value="">Alege...</option>
                                <option value="Parinte">Părinte</option>
                                <option value="Profesor">Profesor</option>
                                <option value="Participant">Participant</option>
                                <option value="Fan">Fan</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Mesajul Tău <span className="text-red-500">*</span></label>
                        <textarea required rows={4} value={formData.text} onChange={e => setFormData({ ...formData, text: e.target.value })} placeholder="Povestește-ne experiența ta..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none resize-none font-medium" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-brand-purple text-white font-black rounded-xl shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1">Trimite Recenzia</button>
                </form>
            </div>
        </div>
    );
};

const ReviewsSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadReviews = () => {
        const stored = localStorage.getItem('reviewsConfig');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const visible = parsed.filter((r: Review) => r.isVisible !== false);
                if (visible.length > 0) setReviews(visible);
            } catch (e) { console.error(e); }
        }
    };

    useEffect(() => {
        loadReviews();
        window.addEventListener('reviewsUpdated', loadReviews);
        return () => window.removeEventListener('reviewsUpdated', loadReviews);
    }, []);

    const handleAddReview = (data: any) => {
        const newReview: Review = { id: Date.now().toString(), ...data, isVisible: true };
        const updatedReviews = [newReview, ...reviews];
        setReviews(updatedReviews);
        const stored = localStorage.getItem('reviewsConfig');
        let allReviews = DEFAULT_REVIEWS;
        if(stored) { try { allReviews = JSON.parse(stored); } catch(e){} }
        localStorage.setItem('reviewsConfig', JSON.stringify([newReview, ...allReviews]));
        toast.success("Mulțumim! Recenzia ta a fost adăugată.");
    };

    return (
        <div className="max-w-screen-xl mx-auto overflow-hidden pt-10 pb-0">
            <div className="text-center mb-6 md:mb-14 px-4">
                <SectionTitle section={section} />
                <div className="mt-6">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-white text-brand-purple border-2 border-brand-purple/10 px-6 py-2.5 rounded-full font-black text-sm shadow-sm hover:bg-brand-purple hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Adaugă Recenzie
                    </button>
                </div>
            </div>

            <div className="reviews-slider-container relative pb-4 animate-on-scroll group">
                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1} 
                    centeredSlides={true}
                    loop={reviews.length > 1}
                    autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true
                    }}
                    navigation={{
                        nextEl: '.review-next',
                        prevEl: '.review-prev',
                    }}
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1.2, spaceBetween: 30 },
                        1024: { slidesPerView: 2.5, spaceBetween: 40, centeredSlides: true },
                    }}
                    className="!pb-10 !px-6 md:!px-12"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review.id} className="h-auto py-2">
                            <ReviewCardContent review={review} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Desktop Navigation Arrows */}
                <button className="review-prev absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button className="review-next absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-100 hidden md:flex items-center justify-center text-brand-purple hover:bg-brand-purple hover:text-white transition-all transform hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>

            <AddReviewModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={handleAddReview} 
            />

            <style>{`
                .reviews-slider-container .swiper-pagination-bullet {
                    background: #CBD5E1;
                    opacity: 1;
                    width: 8px;
                    height: 8px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .reviews-slider-container .swiper-pagination-bullet-active {
                    background: #7C3AED;
                    width: 28px;
                    border-radius: 99px;
                }
                .reviews-slider-container .swiper-slide {
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
                .reviews-slider-container .swiper-slide:not(.swiper-slide-active) {
                    opacity: 0.4;
                    transform: scale(0.9);
                }
            `}</style>
        </div>
    );
};

export default ReviewsSection;