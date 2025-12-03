import { NAME, HERO_CONTENT_1, HERO_CONTENT_2,HERO_CONTENT_3 } from "../constants"
import profilePic from "../assets/NireshProfile.png"
import { motion } from "framer-motion"

const container = (delay) => ({
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: delay } }
})

const Hero = () => {
    return (
        <div className="border-b border-neutral-900  pb-4 lg:mb-36">
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2">
                    <div className="flex flex-col items-center lg:items-start">
                        <motion.h1
                            variants={container(0)}
                            initial="hidden"
                            animate="visible"
                            className="pb-16 text-6xl font-thin tracking-tighter lg:mt-16 lg:text-8xl"
                        >
                            <strong>{NAME}</strong>
                        </motion.h1>
                        <motion.span
                            variants={container(0.5)}
                            initial="hidden"
                            animate="visible"
                            className="bg-gradient-to-r from-pink-300 via-slate-100 to-purple-500 bg-clip-text text-3xl tracking-tighter text-transparent">
                            AI Full-Stack Developer • AI Automations Specialist
                        </motion.span>
                        <motion.p
                            variants={container(1)}
                            initial="hidden"
                            animate="visible"
                            className="my-2 max-w-xl py-3 font-light tracking-tighter">
                            {HERO_CONTENT_1}
                        </motion.p>
                        <motion.p
                            variants={container(1)}
                            initial="hidden"
                            animate="visible"
                            className="my-2 max-w-xl py-3 font-light tracking-tighter">
                            {HERO_CONTENT_2}
                        </motion.p>
                        <motion.p
                            variants={container(1)}
                            initial="hidden"
                            animate="visible"
                            className="my-2 max-w-xl py-3 font-light tracking-tighter">
                            {HERO_CONTENT_3}
                        </motion.p>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 lg:p-8 ">
                    <div className="flex justify-center">
                        <motion.img
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 1.2 }}
                            className="rounded-2xl" height={650} width={365} src={profilePic} alt="Niresh" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero