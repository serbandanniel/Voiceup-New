
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { SectionConfig, Partner } from '../../types';
import { DEFAULT_PARTNERS } from '../../config';
import SectionTitle from '../ui/SectionTitle';

const PartnersSection: React.FC<{ section: SectionConfig }> = ({ section }) => {
    const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);

    useEffect(() => {
        const stored = localStorage.getItem('partnersConfig');
        if(stored) {
            try { setPartners(JSON.parse(stored)); } catch(e) { console.error(e); }
        }
    }, []);

    const canLoop = partners.length >= 10;

    return (
    <div className="max-w-screen-xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <SectionTitle section={section} />
            <p className="mt-4 text-lg text-gray-600 animate-on-scroll" style={{ transitionDelay: '0.1s' }}>
                Mulțumim partenerilor noștri care fac acest vis posibil pentru tinerii artiști.
            </p>
        </div>
        <div className="animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
             <Swiper 
                className="partnerSwiper" 
                modules={[Autoplay]} 
                spaceBetween={20} 
                slidesPerView={2} 
                loop={canLoop} 
                centerInsufficientSlides={!canLoop}
                autoplay={{
                    delay: 2500, 
                    disableOnInteraction: false,
                    stopOnLastSlide: !canLoop
                }} 
                breakpoints={{
                    640: {slidesPerView: 3, spaceBetween: 30}, 
                    768: {slidesPerView: 4, spaceBetween: 40}, 
                    1024: {slidesPerView: 5, spaceBetween: 50}
                }}
            >
                {partners.map((p, i) => (
                    <SwiperSlide key={i} className="flex justify-center items-center">
                        <a href={p.link} target="_blank" rel="noreferrer">
                           <img src={p.img} alt="Partner" className="max-h-[100px] w-auto max-w-[180px] hover:scale-110 transition-transform duration-300" />
                        </a>
                    </SwiperSlide>
                ))}
             </Swiper>
        </div>
    </div>
    );
};

export default PartnersSection;
