'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaCreditCard, FaMobile, FaUniversity, FaApple, FaGoogle, FaLock, FaShieldAlt, FaArrowLeft, FaInfoCircle } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import Link from 'next/link';
import { TestCards } from '@/lib/vodapay/config';

export default function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('CARD');
  const [showTestCards, setShowTestCards] = useState(false);
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [selectedBank, setSelectedBank] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error('Invalid order ID');
        router.push('/menu');
        return;
      }
      
      try {
        console.log('Fetching order:', orderId);
        const orderRef = doc(db, 'orders', orderId);
        const orderDoc = await getDoc(orderRef);
        
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() });
        } else {
          toast.error('Order not found');
          router.push('/menu');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, user, router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const fillTestCard = (cardType: keyof typeof TestCards) => {
    const card = TestCards[cardType];
    setCardNumber(card.number);
    setExpiryDate(card.expiry);
    setCvv(card.cvv);
    setCardName('Test User');
    // Use toast.success instead of toast.info
    toast.success(`✓ Test card loaded: ${card.message}`);
  };

  const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    const loadingToast = toast.loading('Processing payment with VodaPay...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      let paymentSuccess = true;
      let responseCode = '00';
      let responseMessage = 'Approved';
      const transactionId = generateTransactionId();
      
      if (cardNumber.includes('4444444444444405')) {
        paymentSuccess = false;
        responseCode = '05';
        responseMessage = 'Do not honour';
      } else if (cardNumber.includes('4444444444444451')) {
        paymentSuccess = false;
        responseCode = '51';
        responseMessage = 'Insufficient Funds';
      } else if (cardNumber.includes('4444444444444454')) {
        paymentSuccess = false;
        responseCode = '54';
        responseMessage = 'Card Expired';
      } else if (cardNumber.includes('4444444444444499')) {
        paymentSuccess = false;
        responseCode = '99';
        responseMessage = '3DSecure Fail';
      }
      
      const paymentMethodName = paymentMethod === 'CARD' ? 'Credit/Debit Card' : 
                                paymentMethod === 'INSTANT_EFT' ? 'Instant EFT' : 
                                paymentMethod === 'DIGITAL_WALLET' ? 'Digital Wallet' : 'Unknown';
      
      if (paymentSuccess) {
        const orderRef = doc(db, 'orders', orderId!);
        await updateDoc(orderRef, {
          paymentStatus: 'paid',
          paymentMethod: paymentMethodName,
          paymentMethodCode: paymentMethod,
          paymentDate: new Date(),
          status: 'pending',
          vodapayResponseCode: responseCode,
          vodapayResponseMessage: responseMessage,
          transactionId: transactionId,
          cardLastFour: cardNumber.slice(-4),
          bankName: selectedBank || 'N/A'
        });
        
        toast.dismiss(loadingToast);
        toast.success('✅ Payment successful! Redirecting...');
        
        setTimeout(() => {
          router.push(`/payment/success?orderId=${orderId}&method=${paymentMethod}&transactionId=${transactionId}`);
        }, 1500);
      } else {
        toast.dismiss(loadingToast);
        toast.error(`❌ Payment failed: ${responseMessage}`);
        setProcessing(false);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.dismiss();
      toast.error('❌ Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link href="/menu" className="text-green-600 hover:text-green-700">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethodsList = [
    { id: 'CARD', name: 'Credit/Debit Card', icon: FaCreditCard, color: 'blue', description: 'Visa, Mastercard' },
    { id: 'INSTANT_EFT', name: 'Instant EFT', icon: FaUniversity, color: 'indigo', description: 'Pay directly from your bank' },
    { id: 'DIGITAL_WALLET', name: 'Digital Wallet', icon: FaMobile, color: 'green', description: 'Apple Pay, Google Pay, VodaPay' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/checkout" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
          <FaArrowLeft /> Back to Checkout
        </Link>
        
        <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <FaInfoCircle className="text-yellow-600" />
          <span className="text-sm text-yellow-800">
            <strong>VodaPay Sandbox Mode</strong> - Use test card: 4444 4444 4444 4400 | Expiry: 12/25 | CVV: 123
          </span>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
                <p className="text-purple-100 text-sm">Secure payment powered by VodaPay Gateway</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethodsList.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          paymentMethod === method.id
                            ? `border-${method.color}-600 bg-${method.color}-50`
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <method.icon className={`text-3xl mx-auto mb-2 ${
                          paymentMethod === method.id ? `text-${method.color}-600` : 'text-gray-400'
                        }`} />
                        <div className={`text-sm font-medium ${
                          paymentMethod === method.id ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {method.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{method.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                
                {paymentMethod === 'CARD' && (
                  <form onSubmit={handlePayment}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">
                          Card Details
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowTestCards(!showTestCards)}
                          className="text-xs text-purple-600 hover:text-purple-700"
                        >
                          {showTestCards ? 'Hide' : 'Show'} Test Cards
                        </button>
                      </div>
                      
                      {showTestCards && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-yellow-800 mb-2">VodaPay Sandbox Test Cards:</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button onClick={() => fillTestCard('approved')} className="text-left text-green-700 hover:text-green-800 p-1 rounded hover:bg-green-50">
                              ✅ 4444 4444 4444 4400 - Approved
                            </button>
                            <button onClick={() => fillTestCard('insufficientFunds')} className="text-left text-red-700 hover:text-red-800 p-1 rounded hover:bg-red-50">
                              ❌ 4444 4444 4444 4451 - Insufficient Funds
                            </button>
                            <button onClick={() => fillTestCard('doNotHonour')} className="text-left text-orange-700 hover:text-orange-800 p-1 rounded hover:bg-orange-50">
                              ⚠️ 4444 4444 4444 4405 - Do Not Honour
                            </button>
                            <button onClick={() => fillTestCard('threeDSecureFail')} className="text-left text-red-700 hover:text-red-800 p-1 rounded hover:bg-red-50">
                              🔒 4444 4444 4444 4499 - 3DSecure Fail
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="Card Number"
                          maxLength={19}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Cardholder Name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="CVV"
                          maxLength={4}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50"
                    >
                      {processing ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing Payment...
                        </span>
                      ) : (
                        `Pay R${order.total?.toFixed(2)} with Card`
                      )}
                    </button>
                  </form>
                )}
                
                {paymentMethod === 'INSTANT_EFT' && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <h3 className="font-semibold text-indigo-900 mb-3">Instant EFT</h3>
                      <div className="space-y-3">
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        >
                          <option value="">Select Your Bank</option>
                          <option value="ABSA">ABSA</option>
                          <option value="FNB">FNB</option>
                          <option value="Standard Bank">Standard Bank</option>
                          <option value="Nedbank">Nedbank</option>
                          <option value="Capitec">Capitec</option>
                          <option value="Discovery Bank">Discovery Bank</option>
                          <option value="TymeBank">TymeBank</option>
                        </select>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Phone Number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                        <button
                          onClick={handlePayment}
                          disabled={processing}
                          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition font-semibold"
                        >
                          Pay R{order.total?.toFixed(2)} via Instant EFT
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'DIGITAL_WALLET' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-semibold text-green-900 mb-3 text-center">Digital Wallets</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={handlePayment}
                          className="p-4 bg-white border rounded-lg hover:shadow-md transition text-center"
                        >
                          <FaApple className="text-3xl text-gray-700 mx-auto mb-2" />
                          <span className="text-xs">Apple Pay</span>
                        </button>
                        <button
                          onClick={handlePayment}
                          className="p-4 bg-white border rounded-lg hover:shadow-md transition text-center"
                        >
                          <FaGoogle className="text-3xl text-blue-600 mx-auto mb-2" />
                          <span className="text-xs">Google Pay</span>
                        </button>
                        <button
                          onClick={handlePayment}
                          className="p-4 bg-white border rounded-lg hover:shadow-md transition text-center"
                        >
                          <FaMobile className="text-3xl text-purple-600 mx-auto mb-2" />
                          <span className="text-xs">VodaPay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <FaLock className="text-green-600" />
                    <span>PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaShieldAlt className="text-green-600" />
                    <span>3D Secure Verified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMobile className="text-green-600" />
                    <span>VodaPay Sandbox</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-900">#{order.id.slice(-8)}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="space-y-2">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.quantity}x {item.name}</span>
                      <span className="text-gray-900">R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-gray-900">R{order.deliveryFee?.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t mt-3 pt-3">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>Total:</span>
                    <span className="text-purple-600 text-lg">R{order.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
