import { motion } from 'framer-motion'
export default function Testimonials(): React.JSX.Element {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Enthusiast',
      image: '../src/assets/testimonials/customer-2.png',
      rating: 5,
      text: 'Shoppora has the best collection! The quality is amazing and the delivery was super fast. Highly recommend!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Tech Lover',
      image: '../src/assets/testimonials/customer-4.png',
      rating: 5,
      text: 'Incredible deals on electronics. I found exactly what I was looking for at an unbeatable price. Great experience!',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Home Decorator',
      image: '../src/assets/testimonials/customer-7.png',
      rating: 4,
      text: 'Love the variety of home decor items. Customer service was helpful when I had questions about a product.',
    },
  ]

  return (
    <section className="bg-linear-to-br from-indigo-950 via-purple-950 to-indigo-900 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-white">
            What Our Customers Say
          </h2>
          <p className="text-slate-400">
            Read reviews from thousands of satisfied shoppers
          </p>
        </div>

        <div className="grid cursor-pointer grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.08 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              key={testimonial.id}
              className="rounded-xl border border-slate-600 bg-slate-700/50 p-6 transition-colors hover:border-pink-500"
            >
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="mb-3 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-300">
                {testimonial.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
