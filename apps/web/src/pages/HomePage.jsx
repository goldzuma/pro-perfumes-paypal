
import React from 'react';
import { Helmet } from 'react-helmet';

// Import sections
import AutoScrollCarousel from '@/components/AutoScrollCarousel.jsx';
import FeaturedPerfumesSection from '@/components/FeaturedPerfumesSection.jsx';
import ArabicPerfumesSection from '@/components/ArabicPerfumesSection.jsx';
import WomensPerfumesSection from '@/components/WomensPerfumesSection.jsx';
import MensPerfumesSection from '@/components/MensPerfumesSection.jsx';
import WhyChooseVelourSection from '@/components/WhyChooseVelourSection.jsx';
import TestimonialsSection from '@/components/TestimonialsSection.jsx';
import PaymentMethodsSection from '@/components/PaymentMethodsSection.jsx';
import FinalCTABanner from '@/components/FinalCTABanner.jsx';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Velour Perfumes - Fragrâncias de Luxo Premium</title>
        <meta
          name="description"
          content="Descubra a coleção exclusiva de perfumes importados Velour. Fragrâncias premium das melhores marcas: Chanel, Dior, Guerlain, Tom Ford e Creed."
        />
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* 1. Auto Scroll Carousel Section */}
        <AutoScrollCarousel />

        {/* 2. Featured Perfumes Section */}
        <div id="featured-perfumes">
          <FeaturedPerfumesSection />
        </div>

        {/* 3. Womens Perfumes Section */}
        <WomensPerfumesSection />

        {/* 4. Mens Perfumes Section */}
        <MensPerfumesSection />

        {/* 5. Arabic Perfumes Section */}
        <ArabicPerfumesSection />

        {/* 6. Why Choose Velour Section */}
        <WhyChooseVelourSection />

        {/* 7. Customer Testimonials Section */}
        <TestimonialsSection />

        {/* 8. Payment Methods Section */}
        <PaymentMethodsSection />

        {/* 9. Final CTA Banner */}
        <FinalCTABanner />
      </div>
    </>
  );
};

export default HomePage;
