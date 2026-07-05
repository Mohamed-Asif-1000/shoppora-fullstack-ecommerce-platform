import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Electronics from '../assets/categories/electronics.jpg'
import Decors from '../assets/categories/decors.jpg'
import Beauty from '../assets/categories/beauty.jpg'
import Sports from '../assets/categories/sports.jpg'
import Fashion from '../assets/categories/fashion.jpg'
import Books from '../assets/categories/books.jpg'

export default function Categories(): React.JSX.Element {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      search: 'Electronics',
      image: Electronics,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      name: 'Fashion',
      search: 'Fashion',
      image: Fashion,
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 3,
      name: 'Home & Living',
      search: 'Decors',
      image: Decors,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 4,
      name: 'Sports & Outdoors',
      search: 'Sports',
      image: Sports,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 5,
      name: 'Beauty & Personal Care',
      search: 'Beauty',
      image: Beauty,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 6,
      name: 'Books & Media',
      search: 'Books',
      image: Books,
      color: 'from-indigo-500 to-indigo-600',
    },
  ]

  return (
    <section id="categories" className="bg-slate-900/60 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-white">
            Browse by Category
          </h2>
          <p className="text-slate-400">Find what you're looking for</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
                type: 'spring',
                stiffness: 260,
                damping: 20,
              }}
              className="relative h-56 cursor-pointer overflow-hidden rounded-xl"
            >
              <Link
                to={`/search?q=${encodeURIComponent(category.search)}`}
                aria-label={`Browse ${category.name}`}
                className="group relative h-56 cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-105"
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-30 transition-opacity group-hover:opacity-50`}
                />

                {/* Image and text */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center opacity-75">
                  <div className="mb-3 h-36 w-full overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full transform object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
