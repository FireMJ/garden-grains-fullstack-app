// src/context/PaymentContext.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';
import { VodaPayPayment, TEST_API_KEYS } from '@/lib/payment/vodapay';

interface PaymentContextType {
  processPayment: (amount: number, orderDetails: any) => Promise<any>;
  verifyPaymentStatus: (transactionId: string) => Promise<any>;
  paymentLoading: boolean;
  paymentError: string | null;
  testMode: boolean;
  setTestMode: (mode: boolean) => void;
  environment: 'sandbox' | 'uat' | 'production';
  setEnvironment: (env: 'sandbox' | 'uat' | 'production') => void;
  selectedTestApiKey: string;
  setSelectedTestApiKey: (key: string) => void;
}

// Create the context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Provider component
export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [testMode, setTestMode] = useState(true);
  const [environment, setEnvironment] = useState<'sandbox' | 'uat' | 'production'>('sandbox');
  const [selectedTestApiKey, setSelectedTestApiKey] = useState(TEST_API_KEYS[0]);

  const processPayment = async (amount: number, orderDetails: any) => {
    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const paymentGateway = new VodaPayPayment({
        apiKey: testMode ? selectedTestApiKey : process.env.NEXT_PUBLIC_VODAPAY_PROD_API_KEY!,
        isTest: testMode,
        environment: testMode ? environment : 'production',
      });

      const paymentData = {
        amount,
        currency: 'ZAR',
        reference: `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        returnUrl: `${window.location.origin}/payment/return`,
        notifyUrl: `${window.location.origin}/api/payment/webhook`,
        customer: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          phone: orderDetails.customerPhone,
        },
        billing: {
          address: orderDetails.billingAddress,
          city: orderDetails.billingCity,
          country: 'ZA',
          postalCode: orderDetails.billingPostalCode,
        },
        items: orderDetails.items,
      };

      const result = await paymentGateway.initiatePayment(paymentData);
      
      if (result.success && result.redirectUrl) {
        // Redirect to payment page
        window.location.href = result.redirectUrl;
        return result;
      } else {
        setPaymentError(result.error || 'Payment processing failed');
        return result;
      }
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment processing failed');
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPaymentStatus = async (transactionId: string) => {
    setPaymentLoading(true);
    try {
      const paymentGateway = new VodaPayPayment({
        apiKey: testMode ? selectedTestApiKey : process.env.NEXT_PUBLIC_VODAPAY_PROD_API_KEY!,
        isTest: testMode,
        environment: testMode ? environment : 'production',
      });

      const result = await paymentGateway.verifyPayment(transactionId);
      return result;
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : 'Payment verification failed');
      throw error;
    } finally {
      setPaymentLoading(false);
    }
  };

  const value: PaymentContextType = {
    processPayment,
    verifyPaymentStatus,
    paymentLoading,
    paymentError,
    testMode,
    setTestMode,
    environment,
    setEnvironment,
    selectedTestApiKey,
    setSelectedTestApiKey,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

// Custom hook to use the payment context
export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}