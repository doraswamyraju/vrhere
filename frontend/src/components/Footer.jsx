import React from 'react';
import { Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] text-slate-300 pt-16 pb-8 border-t border-slate-800 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-3 space-y-8">
            <Link to="/" className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                 <span className="text-black font-black text-xl">VR</span>
               </div>
               <div>
                 <h2 className="text-2xl font-extrabold text-white leading-none group-hover:text-red-500 transition-colors">VR HERE</h2>
                 <p className="text-[10px] text-red-500 font-bold tracking-widest uppercase mt-1">Business Solutions</p>
               </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              #31, Dwarawati, Subodaya Colony,<br/>
              Kukatpally, Hyderabad - 500072<br/>
              Telangana, India.
            </p>
            <div className="space-y-2">
               <a href="tel:+918008530606" className="flex items-center text-slate-400 hover:text-white transition"><Phone className="w-4 h-4 mr-2" /> +91 80085 30606</a>
               <a href="mailto:vrherebms@gmail.com" className="flex items-center text-slate-400 hover:text-white transition"><Mail className="w-4 h-4 mr-2" /> vrherebms@gmail.com</a>
            </div>
            <a href="https://goo.gl/maps/placeholder" target="_blank" rel="noreferrer" className="inline-flex items-center text-red-500 hover:text-red-400 text-sm font-bold transition transform hover:translate-x-1">
              Open on Google Maps <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Columns 2-4: Links Grid */}
          <div className="lg:col-span-9 grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Start a Business</h3>
              <ul className="space-y-3 text-sm">
                {['Private Limited Company', 'Limited Liability Partnership', 'One Person Company', 'Section 8 Company', 'Partnership Firm'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Grow & Manage</h3>
              <ul className="space-y-3 text-sm">
                {['GST Filing', 'Accounting Services', 'MSME Loans', 'GeM Registration', 'ISO Certification'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-white transition-colors block py-1 transform hover:translate-x-1 duration-200">{item}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-red-500 font-bold text-sm uppercase tracking-wider mb-6">Industrial</h3>
              <ul className="space-y-3 text-sm">
                {['Machinery Sourcing', 'Factory License', 'Pollution Control NOC', 'Turnkey Setup', 'Import Export Code'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-white transition-colors block py-1">{item}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} VR HERE Business Management Solutions. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;