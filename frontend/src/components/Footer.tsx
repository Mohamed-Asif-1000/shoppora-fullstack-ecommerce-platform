import { useState } from "react";
import { Heart, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { subscribeNewsletter } from "../services/api";

export default function Footer(): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      await subscribeNewsletter(email);
      setMessage("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Subscription failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/80 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-pink-600">
                <span className="text-lg font-bold text-white">S</span>
              </div>
              <span className="text-2xl font-bold text-pink-400">Shoppora</span>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              Your destination for premium products at unbeatable prices. Shop
              smarter, not harder.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.2, color: "#f472b6" }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-slate-400 transition hover:text-pink-400"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#f472b6" }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-slate-400 transition hover:text-pink-400"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#f472b6" }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-slate-400 transition hover:text-pink-400"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, color: "#f472b6" }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="text-slate-400 transition hover:text-pink-400"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/electronics"
                  className="transition hover:text-pink-400"
                >
                  Electronics
                </a>
              </li>
              <li>
                <a href="/fashion" className="transition hover:text-pink-400">
                  Fashion
                </a>
              </li>
              <li>
                <a href="/home" className="transition hover:text-pink-400">
                  Home & Living
                </a>
              </li>
              <li>
                <a href="/sports" className="transition hover:text-pink-400">
                  Sports & Outdoors
                </a>
              </li>
              <li>
                <a href="/deals" className="transition hover:text-pink-400">
                  Hot Deals
                </a>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Help & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/contact" className="transition hover:text-pink-400">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/shipping" className="transition hover:text-pink-400">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="/returns" className="transition hover:text-pink-400">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="/faq" className="transition hover:text-pink-400">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/track" className="transition hover:text-pink-400">
                  Track Order
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" className="transition hover:text-pink-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/blog" className="transition hover:text-pink-400">
                  Blog
                </a>
              </li>
              <li>
                <a href="/careers" className="transition hover:text-pink-400">
                  Careers
                </a>
              </li>
              <li>
                <a href="/privacy" className="transition hover:text-pink-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="transition hover:text-pink-400">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-8 border-t border-slate-800 pt-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-2 font-semibold text-white">
                Subscribe to Our Newsletter
              </h4>
              <p className="mb-4 text-sm text-slate-400">
                Get exclusive deals and latest updates straight to your inbox.
              </p>
            </div>
            <div>
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (message) setMessage("");
                  }}
                  placeholder="Enter your email"
                  className="w-full flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-pink-500 px-6 py-2 font-medium text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </motion.button>
              </form>
              {message ? (
                <p className="mt-3 text-sm text-pink-400">{message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800/50 bg-slate-950/60">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
            <p>
              &copy; {currentYear} Shoppora. All rights reserved. Made with{" "}
              <Heart className="inline h-4 w-4 text-pink-500" /> by Team
              Shoppora.
            </p>
            <div className="flex gap-6">
              <a href="/privacy" className="transition hover:text-pink-400">
                Privacy
              </a>
              <a href="/terms" className="transition hover:text-pink-400">
                Terms
              </a>
              <a
                href="/accessibility"
                className="transition hover:text-pink-400"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
