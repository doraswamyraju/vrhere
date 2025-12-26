import React, { useState } from 'react';
import { X, CreditCard, RefreshCw, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuoteModal = ({ isOpen, onClose, selectedPlan }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' });
  const navigate = useNavigate();

  // Load Razorpay Script Dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create Order via Backend (Pointing to Port 5001)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // FIX: WE ARE NOW SENDING ALL CLIENT DATA TO THE BACKEND
        body: JSON.stringify({ 
            amount: selectedPlan?.price || 1,
            client_name: formData.name,       // <--- Sending Name
            client_email: formData.email,     // <--- Sending Email (Crucial!)
            client_mobile: formData.mobile,   // <--- Sending Phone
            service_name: selectedPlan?.name || 'Consultation' // <--- Sending Service
        }),
      });

      const orderData = await response.json();

      if (!orderData.id) {
        console.error("Backend Error:", orderData);
        alert('Server error. Could not generate order. Check console.');
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay Options
      const options = {
        key: "rzp_test_RuKdTFadwm3UGT", // Your Actual Test Key
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VR Here Solutions",
        description: `Payment for ${selectedPlan?.name}`,
        order_id: orderData.id,
        handler: async function (response) {
          // Success Callback
          console.log("Payment Successful", response);
          onClose();
          setIsSubmitting(false);
          
          // REDIRECT TO DASHBOARD
          navigate('/dashboard', { 
  state: { 
    email: formData.email,
    name: formData.name 
  } 
});
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: "#DC2626", // Red brand color
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
        setIsSubmitting(false);
      });

    } catch (error) {
      console.error(error);
      alert('Something went wrong during payment initialization.');
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition bg-white rounded-full p-1"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="bg-slate-900 p-6 text-center border-b-4 border-red-600">
          <h3 className="text-white font-bold text-xl">
            {selectedPlan?.id === 'consultation' ? 'Book Consultation' : 'Get Started'}
          </h3>
          <p className="text-slate-400 text-sm mt-1">{selectedPlan?.name || "Expert Guidance"}</p>
        </div>

        <div className="p-6">
          <div className="mb-6 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start">
             <CreditCard className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
             <div>
                <div className="font-bold text-slate-900 text-sm">
                  Amount: {selectedPlan ? formatCurrency(selectedPlan.price) : '...'}
                </div>
                {selectedPlan?.isAdjustable ? (
                    <p className="text-xs text-green-700 font-bold mt-1 flex items-center">
                      <RefreshCw className="w-3 h-3 mr-1"/> Fully adjustable against final package
                    </p>
                ) : (
                    <p className="text-xs text-slate-500 mt-1">+ Government Fees as applicable</p>
                )}
             </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <input 
              required 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" 
              placeholder="Full Name" 
            />
            <input 
              required 
              type="tel" 
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" 
              placeholder="Mobile Number" 
            />
            <input 
              required 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none transition-shadow hover:shadow-inner" 
              placeholder="Email Address" 
            />
            <button 
              disabled={isSubmitting} 
              type="submit" 
              className="w-full bg-red-600 text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition transform active:scale-95 flex items-center justify-center shadow-lg shadow-red-600/20"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ${selectedPlan ? formatCurrency(selectedPlan.price) : ''}`}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> Secure Payment Gateway
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;