import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Technologies from './components/Technologies'
import AiTechnologies from './components/AiTechnologies'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Reading from './Pages/Reading'
import Blog from './components/Blog'

const Home = () => (
  <>
    <Hero />
    <About />
    <Technologies />
    <AiTechnologies />
    <Experience />
    <Projects />
    <Blog />
    <Contact />
  </>
)

const App = () => {
  return (
    <BrowserRouter>
      <div className='overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900'>
        <Analytics />
        <div className="fixed top-0 -z-10 h-full w-full">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
          <div className="relative h-full w-full bg-slate-950"><div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div><div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div></div>
        </div>
        <div className="container mx-auto px-8">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:slug" element={<Reading />} />
            <Route path="/projects/:slug" element={<Reading />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
