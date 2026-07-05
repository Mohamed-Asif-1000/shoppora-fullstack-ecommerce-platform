import Laptop from '../assets/hero image/laptop-01.jpg'
import Decors from '../assets/hero image/decors.jpg'
import Shoes from '../assets/hero image/shoes.jpg'
import SmartWatch from '../assets/hero image/smart-watch.jpg'
import { motion } from 'framer-motion'

type HeroProps = {
  scrollToShop: () => void
  scrollToCategories: () => void
}

export default function Hero({
  scrollToShop,
  scrollToCategories,
}: HeroProps): React.JSX.Element {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-indigo-900 via-purple-900 to-purple-800 py-20 text-white">
      {/* Dark corner accents */}
      <div className="absolute top-0 left-0 h-40 w-40 rounded-br-full bg-black/20"></div>
      <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-black/20"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-tr-full bg-black/20"></div>
      <div className="absolute right-0 bottom-0 h-32 w-32 rounded-tl-full bg-black/20"></div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left content */}
          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: -200 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                delay: 0.6,
              }}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm font-medium text-pink-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-pink-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6M9 16h6M9 8h6"
                />
              </svg>
              New Collection 2026
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-5xl leading-tight font-extrabold md:text-6xl"
            >
              <span className="block">
                Discover <span className="text-pink-400">Your</span>
              </span>
              <span className="block">Style</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-lg text-lg text-white/80"
            >
              Explore our curated collection of premium products. Quality meets
              affordability with exclusive deals up to 50% off.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.button
                onClick={scrollToShop}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full bg-pink-500 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-pink-600"
              >
                <span>Shop Now</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </motion.button>

              <motion.button
                onClick={scrollToCategories}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }} // Slightly more delay for a staggered look
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-white transition hover:bg-white/5"
              >
                View Categories
              </motion.button>
            </div>
          </div>

          {/* Right images (4 images arranged like design) */}
          <motion.div className="lg:col-span-6">
            <div className="flex gap-6">
              <div className="flex w-1/2 flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                    delay: 0.6,
                  }}
                  className="flex h-72 items-center justify-center overflow-hidden rounded-xl bg-white"
                >
                  <img
                    src={Laptop}
                    alt="Laptop"
                    className="h-full w-full rounded-lg object-cover shadow-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                    delay: 0.8,
                  }}
                  className="h-44 overflow-hidden rounded-xl"
                >
                  <img
                    src={Decors}
                    alt="Indoor Decors"
                    className="h-full w-full rounded-lg object-cover shadow-lg"
                  />
                </motion.div>
              </div>

              <div className="flex w-1/2 flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                    delay: 1.0,
                  }}
                  className="mt-3 h-44 overflow-hidden rounded-xl"
                >
                  <img
                    src={SmartWatch}
                    alt=" Smart Watch"
                    className="h-full w-full rounded-lg object-cover shadow-lg"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 15,
                    delay: 1.2,
                  }}
                  className="h-52 overflow-hidden rounded-xl"
                >
                  <img
                    src={Shoes}
                    alt="Casual Shoes"
                    className="h-full w-full rounded-lg object-cover shadow-lg"
                    width="200"
                    height="400"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
