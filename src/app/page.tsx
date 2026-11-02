import Hero from '@/components/sections/hero';
import Projects from '@/components/sections/projects';
import Experience from '@/components/sections/experience';
import Education from '@/components/sections/education';
import Skills from '@/components/sections/skills';
import About from '@/components/sections/about';
import Contact from '@/components/contact';

// Section order matches `navigation` in src/lib/data.ts, which also numbers them.
export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Experience />
      <Education />
      <Skills />
      <About />
      <Contact />
    </>
  );
}
