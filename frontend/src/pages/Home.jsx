import React from 'react'
import { HeroSection } from '@/components/hero-section'
import { FeaturesSection } from '@/components/features-section'
import { CoursesSection } from '@/components/courses-section'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { RecommendationDemo } from '@/components/recommendation-demo'
import { TechStackSection } from '@/components/tech-stack-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { CTASection } from '@/components/cta-section'
import { Footer } from '@/components/footer'
import { AnimatedBackground, FloatingShapes, CursorGlow } from '@/components/animated-background'
import { ScrollToTop } from '@/components/scroll-to-top'

const Home = () => {
  return (
    <main className="relative min-h-screen">
      {/* Animated background elements */}
      <AnimatedBackground />
      <FloatingShapes />
      <CursorGlow />
      
      {/* Main content */}
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <HowItWorksSection />
        <RecommendationDemo />
        <TestimonialsSection />
        <TechStackSection />
        <CTASection />
        <Footer />
      </div>
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </main>
  )
}

export default Home
