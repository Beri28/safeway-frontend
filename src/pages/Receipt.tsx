import React, { useState, useEffect } from 'react';
import { Booking } from '../apiTypes';
import { useLocation, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react';
import { getBookingForReceipt, getBus, getUser, getUserForReceipt } from '../api';


// Helper component for displaying individual detail items
const DetailItem = ({ label, value }:{ label:any, value:any }) => (
  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

// Main App component
const Receipt = () => {
  // State to hold the ticket details
  const [ticketDetails, setTicketDetails] = useState<Booking | null>(null);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState<string>('');
  const { id,busId,userId } = useParams<{ id: string,busId:string,userId:string }>();
//   const location = useLocation()
//     const id = location.state?.id as string
//     const busId = location.state?.busId as string
//     const userId = location.state?.userId as string

  // Function to get URL parameters
  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      id: params.get('id'),
      busId: params.get('busId'),
      userId: params.get('userId'),
    };
  };

  useEffect(() => {
    // const { id, busId, userId } = getUrlParams();

    // Log the parameters to the console for debugging
    console.log('Route Params:', { id });

    if (!id) {
      setError('Ticket ID is missing from the URL parameters.');
      setLoading(false);
      return;
    }

    const loadTicket = async () => {
      try {
        setLoading(true);
        const booking=await getBookingForReceipt(id)
        console.log(booking)
        // const user = await getUserForReceipt(userId);
        // const route = await getBus(busId);
        if (booking) {
          setTicketDetails({...booking});
        } else {
          setError(`No ticket found for ID: ${id}`);
        }
      } catch (err) {
        console.error('Error fetching ticket details:', err);
        setError('Failed to load ticket details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
        <div className="text-lg font-medium text-gray-700">Loading ticket details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md text-center">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!ticketDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg shadow-md text-center">
          <p className="font-bold">No Ticket Data</p>
          <p>The ticket details could not be loaded or do not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
          SafeWay Bus Ticket
        </h1>

        <div className="space-y-4">
          <DetailItem label="Ticket ID" value={ticketDetails._id} />
          <DetailItem label="Passenger" value={ticketDetails.user?.name} />
          <DetailItem label="From" value={ticketDetails.bus?.from} />
          <DetailItem label="To" value={ticketDetails.bus?.to} />
          <DetailItem label="Date" value={ticketDetails.bus?.date} />
          <DetailItem label="Time" value={ticketDetails.bus?.departureTime} />
          <DetailItem label="Agency" value={ticketDetails.bus?.agency} />
          <DetailItem label="Seat" value={ticketDetails.seat} />
          <DetailItem label="Price" value={ticketDetails.bus?.price} />
          {/* <DetailItem label="Status" value={ticketDetails.status} /> */}
          <DetailItem label="Purchased" value={new Date(ticketDetails.createdAt).toLocaleString()} />
        </div>

        <div className="mt-8 text-center">
          {/* <img
            src="https://placehold.co/150x150/000/fff?text=QR+Code" // Placeholder for QR code
            alt="QR Code for Ticket Validation"
            className="mx-auto rounded-lg shadow-sm"
          /> */}
          <QRCodeSVG value={`https://safeway-frontend.vercel.app/Ticket:${id}/${ticketDetails.user?.name}/${ticketDetails.seat}`} size={50} />
          <p className="text-sm text-gray-500 mt-3">Scan QR for ticket validation</p>
        </div>

        <p className="text-center text-gray-600 mt-8 text-lg font-semibold">
          Thank you for booking with SafeWay!
        </p>
      </div>
    </div>
  );
};



export default Receipt;
