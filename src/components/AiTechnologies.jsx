
import { motion } from "framer-motion"
import { AiOutlineOpenAI } from "react-icons/ai";
import { RiSupabaseFill } from "react-icons/ri";
import { RiAnthropicFill } from "react-icons/ri";
// import { ri/RiClaudeFill } from "react-icons/ri";
import { RiClaudeFill } from "react-icons/ri";
import { SiN8N } from "react-icons/si";
import { SiPuppeteer } from "react-icons/si";

const iconVariants = (duration) => ({
    initial: { y: -10 },
    animate: {
        y: [10, -10],
        transition: {
            duration: duration,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse"
        }
    }
})

const AiTechnologies = () => {
    return (
        <div className="border-b border-neutral-800 pb-24">
            <motion.h2
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: -100 }}
                transition={{ duration: 1.5 }}
                className="my-20 text-center text-4xl">Ai Technologies</motion.h2>
            <motion.div
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -100 }}
                transition={{ duration: 2 }}
                className="flex flex-wrap items-center justify-center gap-4">
                
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <AiOutlineOpenAI className="text-7xl text-teal-500" />
                </motion.div>
                {/* <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <RiClaudeFill className="text-7xl text-blue-500" />
                </motion.div> */}
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <RiSupabaseFill className="text-7xl text-emerald-500" />
                </motion.div>
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <RiAnthropicFill className="text-7xl text-gray-400" />
                </motion.div>
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <RiClaudeFill className="text-7xl text-orange-600" />
                </motion.div>
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <SiN8N className="text-7xl text-pink-600" />
                </motion.div>
                <motion.div
                    variants={iconVariants(1.7)}
                    initial="initial"
                    animate="animate" className="rounded-2xl border-4 border-neutral-800 p-4">
                    <SiPuppeteer className="text-7xl text-green-400" />
                </motion.div>

            </motion.div>
        </div>
    )
}

export default AiTechnologies
