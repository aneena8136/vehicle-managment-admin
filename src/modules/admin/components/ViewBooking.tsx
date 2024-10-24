import React from 'react';
import { useQuery, gql } from '@apollo/client';
import styles from './ViewBookings.module.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


// GraphQL query to get all bookings
const GET_ALL_BOOKINGS = gql`
  query GetAllBookings {
    getAllBookings {
      id
      pickupTime
      dropoffTime
      totalPrice
      status
      pickupLocation
      dropoffLocation
      vehicle {
        id
        name
      }
      customer {
        id
        name
        email
      }
    }
  }
`;

// Define TypeScript interface for booking data

interface Booking {
  id: string;
  pickupTime: string;
  dropoffTime: string;
  totalPrice: number;
  status: string;
  pickupLocation: string;
  dropoffLocation: string;
  vehicle: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

const ViewBookings: React.FC = () => {
   // Fetch booking data using Apollo useQuery hook
  const { loading, error, data } = useQuery(GET_ALL_BOOKINGS);



  // Display loading or error message if necessary
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

   // Get the list of bookings from the query result
  const bookings: Booking[] = data.getAllBookings;

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('All Bookings', 20, 10);
    doc.autoTable({
      head: [['ID', 'Pickup Time', 'Dropoff Time', 'Total Price', 'Status', 'Pickup Location', 'Dropoff Location', 'Vehicle', 'Customer']],
       // Populate table with booking data
      body: bookings.map((booking) => [
        booking.id,
        new Date(booking.pickupTime).toLocaleString(),
        new Date(booking.dropoffTime).toLocaleString(),
        `$${booking.totalPrice.toFixed(2)}`,
        booking.status,
        booking.pickupLocation,
        booking.dropoffLocation,
        booking.vehicle.name,
        booking.customer.name,
      ]),
    });
    doc.save('bookings.pdf');
  };

  // Function to generate Excel
  const generateExcel = () => {
        // Convert bookings data to a format for Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(
      bookings.map((booking) => ({
        ID: booking.id,
        'Pickup Time': new Date(booking.pickupTime).toLocaleString(),
        'Dropoff Time': new Date(booking.dropoffTime).toLocaleString(),
        'Total Price': `$${booking.totalPrice.toFixed(2)}`,
        Status: booking.status,
        'Pickup Location': booking.pickupLocation,
        'Dropoff Location': booking.dropoffLocation,
        Vehicle: booking.vehicle.name,
        Customer: booking.customer.name,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
    XLSX.writeFile(workbook, 'bookings.xlsx');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>All Bookings</h1>
      <div className={styles.buttonContainer}>
          {/* Button to download PDF */}
        <button onClick={generatePDF} className={styles.downloadButton}>Download PDF</button>
         {/* Button to download Excel */}
        <button onClick={generateExcel} className={styles.downloadButton}>Download Excel</button>
      </div>
      <div className={styles.tableWrapper}>
         {/* Table to display booking information */}
        <table className={styles.bookingsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pickup Time</th>
              <th>Dropoff Time</th>
              <th>Total Price</th>
              <th>Pickup Location</th>
              <th>Dropoff Location</th>
              <th>Vehicle</th>
              
            </tr>
          </thead>
          <tbody>
              {/* Loop through bookings and render each one in the table */}
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{new Date(booking.pickupTime).toLocaleString()}</td>
                <td>{new Date(booking.dropoffTime).toLocaleString()}</td>
                <td>Rs{booking.totalPrice.toFixed(2)}</td>
                <td>{booking.pickupLocation}</td>
                <td>{booking.dropoffLocation}</td>
                <td>{booking.vehicle.name}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewBookings;
