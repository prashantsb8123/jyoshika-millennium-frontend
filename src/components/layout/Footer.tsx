import React from 'react';
import { ShieldCheck, Award, Truck, RefreshCw, PhoneCall, Mail, MapPin, Send, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream text-ink-soft border-t border-line pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Trust Guarantees Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-line text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-gold-pale/50 text-gold border border-gold/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-ink">100% Genuine Products</h4>
            <p className="text-xs text-ink-soft">Sourced directly from authorized brands</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-gold-pale/50 text-gold border border-gold/30">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-ink">Quality Guarantee</h4>
            <p className="text-xs text-ink-soft">Every product checked before it ships</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-gold-pale/50 text-gold border border-gold/30">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-ink">Free Insured Shipping</h4>
            <p className="text-xs text-ink-soft">Insured courier transit to your doorstep</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 rounded-full bg-gold-pale/50 text-gold border border-gold/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-ink">30-Day Returns</h4>
            <p className="text-xs text-ink-soft">Full refund guarantee with zero restocking fee</p>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info Column */}
          <div className="md:col-span-2 space-y-4">
            <a href="#" className="flex flex-col">
              <span className="font-serif text-2xl font-bold text-ink">JYOSHIKA MILLENNIUM</span>
              <span className="text-[9px] tracking-[0.3em] text-ink-soft uppercase font-medium">Online Shopping</span>
            </a>

            <p className="text-xs text-ink-soft leading-relaxed max-w-sm">
              Jyoshika Millennium brings you a curated selection of fine jewellery, accessories and gifts —
              quality craftsmanship, fair prices, and a shopping experience you can trust.
            </p>

            {/* Newsletter */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-serif font-semibold text-gold uppercase tracking-wider block">
                Join Our Newsletter
              </span>
              <p className="text-[11px] text-ink-soft">Get updates on new arrivals, offers and exclusive deals.</p>
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-white border border-line px-3 py-2 text-xs text-ink flex-1 focus:outline-none focus:border-gold"
                />
                <button className="btn-primary px-4 py-2">
                  Subscribe <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-ink-soft">
              <li><a href="#category-necklace" className="hover:text-ink transition-colors">Necklace</a></li>
              <li><a href="#category-ring" className="hover:text-ink transition-colors">Ring</a></li>
              <li><a href="#category-bangles" className="hover:text-ink transition-colors">Bangles</a></li>
              <li><a href="#category-other" className="hover:text-ink transition-colors">Other</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-ink-soft">
              <li><a href="#account" className="hover:text-ink transition-colors">Track Your Order</a></li>
              <li><a href="#faq" className="hover:text-ink transition-colors">Shipping & Returns</a></li>
              <li><a href="#faq" className="hover:text-ink transition-colors">FAQs</a></li>
              <li><a href="#contact" className="hover:text-ink transition-colors">Contact Us</a></li>
              <li><a href="#faq" className="hover:text-ink transition-colors">Payment Options</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-xs font-semibold text-gold uppercase tracking-wider mb-4">Get In Touch</h4>
            <div className="space-y-3 text-xs text-ink-soft">
              <div>
                <p className="font-semibold text-ink flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" /> Visit Us
                </p>
                <p className="text-[11px]">
                  Gokul Park, Samarth Nagar, Near Elamma Tayi Temple, Vijayapur - 586109
                </p>
              </div>
              <div className="pt-2 border-t border-line text-[11px] space-y-1.5">
                <p className="flex items-center gap-1 text-ink-soft">
                  <PhoneCall className="w-3 h-3 text-gold" /> 8867722750 / 8867722751
                </p>
                <a
                  href="https://wa.me/918867722750?text=Hello%20Jyoshika%20Millennium%2C%20I%20have%20a%20question."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-ink-soft hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-gold" /> WhatsApp: 8867722750
                </a>
                <p className="flex items-center gap-1 text-ink-soft">
                  <Mail className="w-3 h-3 text-gold" /> support@jyoshikamillennium.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between text-xs text-ink-soft gap-4">
          <p>© {new Date().getFullYear()} Jyoshika Millennium Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#faq" className="hover:underline">Privacy Policy</a>
            <span>•</span>
            <a href="#faq" className="hover:underline">Terms of Service</a>
            <span>•</span>
            <a href="#admin-login" className="text-gold hover:underline font-semibold">Admin Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
