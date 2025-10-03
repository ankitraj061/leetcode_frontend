'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { axiosClient } from '../utils/axiosClient';

export default function PayButton({ plan = 'monthly' }: { plan?: 'monthly' | 'yearly' }) {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((s: any) => s.auth);

  useEffect(() => {
    // add razorpay script if not present
    if (!document.querySelector('#razorpay-script')) {
      const s = document.createElement('script');
      s.id = 'razorpay-script';
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  const handlePay = async () => {
    setLoading(true);
    try {
      const resp = await axiosClient.post('/api/payments/create-order', { plan });
      const { order, key } = resp.data;

      const options: any = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'TrueCode',
        description: `Subscription: ${plan}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            await axiosClient.post('/api/payments/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan
            });
            alert('Payment successful! Subscription activated.');
          } catch (err) {
            console.error('verify error', err);
            alert('Payment verification failed on server.');
          }
        },
        prefill: {
          name: user?.firstName + ' ' + user?.lastName,
          email: user?.emailId
        },
        notes: {
          plan
        },
        theme: {
          color: '#3B82F6' // Brand color
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('create order err', err);
      alert('Unable to start payment, try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonText = plan === 'monthly' ? 'Start Monthly Plan' : 'Start Yearly Plan';
  const price = plan === 'monthly' ? '₹1/month' : '₹6/year';

  return (
    <button 
      disabled={loading} 
      onClick={handlePay} 
      className="w-full bg-brand hover:bg-brand-hover text-inverse py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-inverse mr-2"></div>
          Processing...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span>{buttonText}</span>
          <span className="ml-2 text-sm opacity-90">({price})</span>
        </div>
      )}
    </button>
  );
}
