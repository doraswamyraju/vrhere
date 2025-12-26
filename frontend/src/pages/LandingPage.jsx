import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Factory, Stamp, Calculator, Briefcase, Globe, IndianRupee, Lightbulb, MoreHorizontal, 
  Phone, Menu, X, ChevronDown, Clock, ArrowRight, CheckCircle2, 
  Mail, MapPin, CheckCircle, Users, MessageSquare, Loader2, Zap, ShieldCheck, Check
} from 'lucide-react';

/* --- CONFIGURATION --- */
const API_BASE = "http://147.93.107.21:5001"; 
const RZP_KEY = "rzp_test_RtagNJvnau2Mtm";

const PACKAGES = [
  {
    id: 'consultation',
    name: 'Expert Consultation',
    price: 499,
    description: 'Speak with our CA/CS experts. Fee fully adjusted against final registration.',
    features: ['30 Mins CA/CS Call', 'Structure Advice', 'Name Availability Check', 'Compliance Roadmap'],
    buttonText: 'Book Now @ ₹499'
  },
  {
    id: 'standard',
    name: 'Pvt Ltd Registration',
    price: 6499,
    description: 'The essential package for incorporating your startup.',
    features: ['2 DSC & 2 DIN', 'Name Approval (RUN)', 'MOA & AOA Drafting', 'COI Issuance', 'PAN & TAN'],
    buttonText: 'Start Registration'
  },
  {
    id: 'comprehensive',
    name: 'Startup Launchpad',
    price: 14999,
    isPopular: true,
    description: 'Complete setup including GST and initial registrations.',
    features: ['Everything in Standard', 'GST Registration', 'MSME Registration', 'PF & ESIC Setup', 'Bank Account Support'],
    buttonText: 'Get Started'
  }
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async (plan) => {
    if (!window.Razorpay) {
      alert("Payment gateway is still loading. Please wait.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price }),
      });
      const order = await res.json();

      const options = {
        key: RZP_KEY,
        amount: order.amount,
        currency: "INR",
        name: "VRHERE",
        description: plan.name,
        order_id: order.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${API_BASE}/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert(`Payment Success! Redirecting...`);
            navigate('/customer');
          } else {
            alert("Verification failed.");
          }
        },
        prefill: { name: "Client", email: "support@vrhere.co.in", contact: "8008530606" },
        theme: { color: "#dc2626" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="font-sans text-slate-800 bg-white">
      {loading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl flex flex-col items-center shadow-2xl">
                <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                <p className="font-bold text-slate-900 text-center px-4">Connecting to Secure Gateway...</p>
            </div>
        </div>
      )}

      {/* HEADER */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white border-b py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center mr-3">
              <span className="text-white font-black text-xl">VR</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none">VR HERE</span>
              <span className="text-[9px] font-bold text-red-600 uppercase tracking-widest mt-0.5">Business Solutions</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#pricing" className="text-sm font-bold text-slate-700 hover:text-red-600">Pricing</a>
            <button onClick={() => navigate('/customer')} className="text-sm font-bold text-slate-700 hover:text-red-600">Portal Login</button>
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg hover:bg-red-700 flex items-center">
              <Phone className="w-4 h-4 mr-2" /> +91 80085 30606
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-48 pb-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-red-600 mb-6 uppercase tracking-wider">
               <Zap className="w-3 h-3 mr-2" /> Professional Compliance Partner
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
              Launch Your <span className="text-red-600">Company</span> <br />In 7 Days.
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
              Expert-led Private Limited registration, ISO certification, and tax compliance for modern Indian startups.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => document.getElementById('pricing').scrollIntoView({behavior:'smooth'})} className="bg-black text-white px-10 py-5 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-800 flex items-center transition-all">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 rotate-2">
                <h3 className="text-2xl font-black mb-8">The VR HERE Advantage</h3>
                <div className="space-y-6">
                  {['Expert Review Process', '100% Data Privacy', 'Transparent Pricing', 'Paperless Incorporation'].map((item, i) => (
                    <div key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-red-100 transition">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4">
                        <Check className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">Choose Your Plan</h2>
            <p className="text-slate-500 font-bold text-lg">Transparent pricing with no hidden charges.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className={`p-10 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col relative ${pkg.isPopular ? 'border-red-600 shadow-2xl scale-105 bg-white z-10' : 'border-slate-100 bg-slate-50 hover:border-red-200'}`}>
                {pkg.isPopular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest">Most Popular</div>}
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                <div className="text-5xl font-black text-black mb-6">{formatCurrency(pkg.price)}<span className="text-xs text-slate-400 ml-1">+ Govt Fees</span></div>
                <div className="space-y-4 mb-10 flex-1">
                   {pkg.features.map((feat, idx) => (
                     <div key={idx} className="flex items-start text-sm font-bold text-slate-700">
                       <CheckCircle2 className="w-4 h-4 text-green-500 mr-3 mt-0.5" /> {feat}
                     </div>
                   ))}
                </div>
                <button onClick={() => handlePayment(pkg)} className={`w-full py-4 rounded-xl font-black text-lg transition ${pkg.isPopular ? 'bg-red-600 text-white shadow-lg' : 'bg-black text-white hover:bg-slate-800'}`}>
                   {pkg.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12 text-center border-t border-slate-800">
        <p className="text-sm font-bold text-slate-500">&copy; {new Date().getFullYear()} VR HERE Business Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;