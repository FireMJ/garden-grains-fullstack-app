import Hero from '@/components/Hero';
import FeaturedCategories from '@/components/FeaturedCategories';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}
