'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Gallery from '@/components/sections/Gallery';
import ContactSection from '@/components/sections/ContactSection';

const RobotGuide = dynamic(() => import('@/components/3d/RobotGuide'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Gallery />
        <ContactSection />
      </main>
      <Footer />
      <RobotGuide />
    </>
  );
}
