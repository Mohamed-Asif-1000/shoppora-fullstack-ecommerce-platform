import { Truck, Lock, RotateCcw, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'
export default function Features(): React.JSX.Element {
  const features = [
    {
      id: 1,
      icon: Truck,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on all orders above $50',
    },
    {
      id: 2,
      icon: Lock,
      title: 'Secure Payment',
      description: 'Complete your payment with trusted partners',
    },
    {
      id: 3,
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '14 day return policy for all products',
    },
    {
      id: 4,
      icon: BadgeCheck,
      title: 'Certified Quality',
      description: 'Trusted sources bringing you premium products',
    },
  ]

  return (
    <section className="bg-indigo-900/60 py-16 relative">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature,index) => {
            const Icon = feature.icon
            return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{once:true}}
                key={feature.id} 
                className="flex flex-col items-center text-center group">
                <div className="mb-4 p-4 rounded-full bg-indigo-800/40 group-hover:bg-indigo-800/60 transition-all duration-300">
                  <Icon className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
