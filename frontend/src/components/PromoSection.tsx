import NewArrivals from '../assets/promo/new-arrival-01.jpg'
import SummerSale from '../assets/promo/summer-sales.jpg'
import { motion } from 'framer-motion'

export default function PromoSection(): React.JSX.Element {
  return (
    <section className="bg-linear-to-br from-indigo-950 via-purple-950 to-indigo-900 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Promo */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl md:h-80"
          >
            {/* Background Image */}
            <img
              src={SummerSale}
              alt="Electronics Sale"
              className="absolute inset-0 h-full w-full object-cover text-white transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end p-8">
              <p className="mb-2 text-sm font-semibold text-blue-200">
                SUMMER SALE
              </p>
              <h3 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                Up to 50% Off
              </h3>
              <p className="mb-4 text-sm text-blue-100">
                On selected electronics and gadgets
              </p>
              <button className="w-fit rounded-full bg-white px-6 py-2 font-semibold text-blue-600 transition hover:bg-blue-50">
                Shop Now
              </button>
            </div>
          </motion.div>

          {/* Right Promo */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="group relative h-64 cursor-pointer overflow-hidden rounded-2xl md:h-80"
          >
            {/* Background Image */}
            <img
              src={NewArrivals}
              alt="New Fashion Collection"
              className="absolute inset-0 h-full w-full object-cover text-white transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-end p-8">
              <p className="mb-2 text-sm font-semibold text-pink-200">
                NEW ARRIVALS
              </p>
              <h3 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                Fresh Collection
              </h3>
              <p className="mb-4 text-sm text-pink-100">
                Discover the latest trends and styles
              </p>
              <button className="w-fit rounded-full bg-white px-6 py-2 font-semibold text-pink-600 transition hover:bg-pink-50">
                Explore
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
