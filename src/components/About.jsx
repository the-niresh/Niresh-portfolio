import aboutImg from '../assets/about.jpg'
import { ABOUT_TECHNOLOGIES, ABOUT_TEXT } from '../constants'
import { motion } from "framer-motion"

const About = () => {
    return (
        <div className="border-b border-neutral-900 pb-8 ">
            <h2 className="my-20 text-center text-4xl">About
                <span className="text-neutral-500 "> Me</span>
            </h2>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 lg:p-8">
                    <motion.div 
                    whileInView={{opacity:1, x:0}}
                    initial={{opacity:0, x:-100}}
                    transition={{duration: 0.5}}
                    className="flex items-center justify-center">
                        <img className="rounded-2xl" src={aboutImg} alt="About" />
                    </motion.div>
                    
                </div>
                <motion.div 
                whileInView={{opacity:1, x:0}}
                initial={{opacity:0, x:100}}
                transition={{duration: 0.5}}
                className="w-full lg:w-1/2 ">
                        <div className="flex justify-center lg:justify-start ">
                            <p className="my-2 max-w-xl py-6">{ABOUT_TEXT}</p>
                        </div>
                        <h6 className="mb-2 text-center font-semibold lg:text-left">Skills</h6>
                        <div className="mt-4 flex flex-wrap gap-2">
                                {ABOUT_TECHNOLOGIES.map((tech, index) => (
                                    <span key={index} className="max-w-full break-words rounded bg-neutral-900 px-2 py-1 text-sm font-medium text-green-300">{tech}</span>
                                ))}
                            </div>
                    </motion.div>
            </div>
        </div>
    )
}

export default About
