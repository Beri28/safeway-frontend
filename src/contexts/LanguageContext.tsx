import React, { createContext, useContext, useState, ReactNode } from 'react';

const translations = {
  en: {
    bookYourTicket: 'Book Your Ticket',
    confirmPay: 'Confirm & Pay',
    bookingConfirmed: 'Booking Confirmed',
    passengerDetails: 'Passenger Details',
    reviewConfirm: 'Review & Confirm',
    continueToPayment: 'Continue to Payment',
    payNow: 'Pay Now',
    processing: 'Processing Payment...',
    close: 'Close',
    leaveReview: 'Leave a Review',
    submitReview: 'Submit Review',
    thankYou: 'Thank you for your feedback!',
    bookingHistory: 'Booking History',
    noBookings: 'No bookings yet.'
  },
  fr: {
    bookYourTicket: 'Réservez votre billet',
    confirmPay: 'Confirmer et payer',
    bookingConfirmed: 'Réservation confirmée',
    passengerDetails: 'Détails du passager',
    reviewConfirm: 'Vérifier et confirmer',
    continueToPayment: 'Continuer au paiement',
    payNow: 'Payer maintenant',
    processing: 'Traitement du paiement...',
    close: 'Fermer',
    leaveReview: 'Laisser un avis',
    submitReview: 'Soumettre l\'avis',
    thankYou: 'Merci pour votre retour!',
    bookingHistory: 'Historique des réservations',
    noBookings: 'Aucune réservation.'
  }
};

interface LanguageContextType {
  lang: 'en' | 'fr';
  setLang: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<'en' | 'fr'>('en');
  const t = (key: string) => {
    if (translations[lang] && Object.prototype.hasOwnProperty.call(translations[lang], key)) {
      return translations[lang][key];
    }
    return key;
  };
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
