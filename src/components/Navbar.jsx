import logo from "../assets/NireshLogo.png"
import { FaLinkedin } from "react-icons/fa"
import { FaGithub } from "react-icons/fa"
import { FaSquareXTwitter } from "react-icons/fa6"
import { FaInstagram } from "react-icons/fa"
import { LiaFileDownloadSolid } from "react-icons/lia";
import { WEBSITE_URL, LINKEDIN_URL, GITHUB_URL, INSTAGRAM_URL, TWITTER_URL, CV_URL } from "../constants"

const Navbar = () => {
  return (
    <nav className="mb-20 flex items-center justify-between py-6">
      <div className="flex flex-shrink-0 items-center">
        <a href={WEBSITE_URL}><img className="mx-2" height={67} width={120} src={logo} alt="logo" /></a>
      </div>
      <div className="m-8 flex items-center justify-center gap-4 text-2xl">
        <a href={LINKEDIN_URL} target="_blank"><FaLinkedin /></a>
        <a href={GITHUB_URL} target="_blank"><FaGithub /></a>
        <a href={INSTAGRAM_URL} target="_blank"><FaInstagram /></a>
        <a href={TWITTER_URL} target="_blank"><FaSquareXTwitter /></a>
        <a href={CV_URL} target="_blank"><LiaFileDownloadSolid /></a>
      </div>
    </nav>
  )
}

export default Navbar
