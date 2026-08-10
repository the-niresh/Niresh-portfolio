import { Link, useLocation } from "react-router-dom"
import logo from "../assets/NireshLogo.png"
import { FaLinkedin } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"
import { FaSquareXTwitter } from "react-icons/fa6"
import { FaInstagram } from "react-icons/fa"
import { LiaFileDownloadSolid } from "react-icons/lia";
import { BsWhatsapp } from "react-icons/bs";
import { LINKEDIN_URL, GITHUB_URL, INSTAGRAM_URL, TWITTER_URL, WHATSAPP_URL, CV_URL } from "../constants"

const linkClass = (isActive) =>
  isActive
    ? "border-b-2 border-purple-400 pb-1 text-sm font-medium text-purple-200"
    : "border-b-2 border-transparent pb-1 text-sm text-neutral-400 transition hover:text-neutral-200"

const Navbar = () => {
  const { pathname } = useLocation()
  // /blogs and every /blog/:slug reading are both "Blog" as far as the nav goes.
  const onBlog = pathname.startsWith("/blog")

  return (
    <nav className="mb-20 flex flex-wrap items-center justify-between gap-4 py-6">
      <div className="flex flex-shrink-0 items-center">
        <Link to="/"><img className="mx-2" height={67} width={120} src={logo} alt="Niresh" /></Link>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-6">
        <div className="flex items-center gap-5">
          <Link to="/" aria-current={!onBlog ? "page" : undefined} className={linkClass(!onBlog)}>
            Work
          </Link>
          <Link to="/blogs" aria-current={onBlog ? "page" : undefined} className={linkClass(onBlog)}>
            Blog
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4 text-2xl">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
          <a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" aria-label="X"><FaSquareXTwitter /></a>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><BsWhatsapp /></a>
          <a href={CV_URL} target="_blank" rel="noopener noreferrer" aria-label="Download CV"><LiaFileDownloadSolid /></a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
