"use client";

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation for routing after vehicle addition
import styles from './AddVehicleForm.module.css'; // Import the CSS module for styling
import Swal from 'sweetalert2';
import ImportVehiclesView from '../views/ImportVehiclesView'; // Import component for importing vehicles

// GraphQL mutation for adding a vehicle
const ADD_VEHICLE_MUTATION = gql`
  mutation AddVehicle(
    $name: String!
    $manufacturer: String!
    $model: String!
    $fuelType: FuelType!
    $gearType: GearType!
    $seats: Int!
    $price: Float!
    $primaryImageFile: Upload!
    $secondaryImageFile: Upload!
    $otherImageFiles: [Upload!]!
    $availableQty: Int!
  ) {
    addVehicle(
      name: $name
      manufacturer: $manufacturer
      model: $model
      fuelType: $fuelType
      gearType: $gearType
      seats: $seats
      price: $price
      primaryImageFile: $primaryImageFile
      secondaryImageFile: $secondaryImageFile
       otherImageFiles: $otherImageFiles
      availableQty: $availableQty
    ) {
      id
      name
      manufacturer
      model
      fuelType
      gearType
      seats
      price
      primaryImage
      secondaryImage
      otherImages
      availableQty
    }
  }
`;

// GraphQL query for fetching all vehicles
const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    vehicles {
      id
      name
      manufacturer
      model
      fuelType
      gearType
      seats
      price
      primaryImage
      secondaryImage
      otherImages
      availableQty
    }
  }
`;

const AddVehicleForm = () => {
  // State variables for form input fields
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [gearType, setGearType] = useState('');
  const [seats, setSeats] = useState(0);
  const [price, setPrice] = useState(0);
  const [primaryImageFile, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImageFile, setSecondaryImage] = useState<File | null>(null);
  const [otherImageFiles, setOtherImageFiles] = useState<File[]>([]);
  const [availableQty, setAvailableQty] = useState(0);

  const router = useRouter(); // Initialize the router for navigation

  // Initialize mutation with the GraphQL mutation and refetchQueries
  const [addVehicle, { loading, error }] = useMutation(ADD_VEHICLE_MUTATION, {
    refetchQueries: [{ query: GET_ALL_VEHICLES }], // Refetch vehicles after successful addition
  });

  // Function to handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    const file = e.target.files?.[0]; // Get the selected file from input
    console.log('File selected:', file); // Log for debugging
    setFile(file || null); // Set the state with the selected file or null
  };

  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setOtherImageFiles(prevFiles => [...prevFiles, ...files]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure both primary and secondary images are selected
    if (!primaryImageFile || !secondaryImageFile) {
      alert('Please select both primary and secondary images.');
      return;
    }

    try {
      // Call the mutation with form input values
      const response = await addVehicle({
        variables: {
          name,
          manufacturer,
          model,
          fuelType,
          gearType,
          seats: parseInt(seats.toString()),
          price: parseFloat(price.toString()),
          primaryImageFile,
          secondaryImageFile,
          otherImageFiles,
          availableQty: parseInt(availableQty.toString()),
        },
      });

      console.log('Server response:', response); // Log server response for debugging

      // Check if the mutation was successful
      if (response.data && response.data.addVehicle) {
        Swal.fire("Vehicle Added Succesfully");
        router.push('/dashboard'); // Navigate to dashboard upon success
      } else {
        console.error('Unexpected response format:', response);
        alert('Failed to add vehicle. Please try again.');
      }
    } catch (err) {
      console.error('Error adding vehicle:', err); // Log any errors during the mutation process
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Add Vehicle</h2>

      {/* Import vehicle component */}
      <div className={styles.import}>
        <h4>Import Vehicle</h4>
        <ImportVehiclesView />
      </div>
      
      {/* Form for adding a vehicle */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Input field for vehicle name */}
        <div className={styles.inputGroup}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Input field for manufacturer */}
        <div className={styles.inputGroup}>
          <label>Manufacturer:</label>
          <input
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
          />
        </div>

        {/* Input field for model */}
        <div className={styles.inputGroup}>
          <label>Model:</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        {/* Dropdown for selecting fuel type */}
        <div className={styles.inputGroup}>
          <label>Fuel Type:</label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
          >
            <option value="">Select Fuel Type</option>
            <option value="PETROL">PETROL</option>
            <option value="DIESEL">DIESEL</option>
            <option value="CNG">CNG</option>
            <option value="EV">EV</option>
          </select>
        </div>

        {/* Dropdown for selecting gear type */}
        <div className={styles.inputGroup}>
          <label>Gear Type:</label>
          <select
            value={gearType}
            onChange={(e) => setGearType(e.target.value)}
            required
          >
            <option value="">Select Gear Type</option>
            <option value="MANUAL">MANUAL</option>
            <option value="AUTOMATIC">AUTOMATIC</option>
          </select>
        </div>

        {/* Input field for number of seats */}
        <div className={styles.inputGroup}>
          <label>Seats:</label>
          <input
            type="number"
            value={seats}
            onChange={(e) => setSeats(parseInt(e.target.value))}
            required
          />
        </div>

        {/* Input field for price */}
        <div className={styles.inputGroup}>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            required
          />
        </div>

        {/* File input for primary image */}
        <div className={styles.inputGroup}>
          <label>Primary Image:</label>
          <input
            type="file"
            onChange={(e) => handleFileChange(e, setPrimaryImage)}
            required
          />
        </div>

        {/* File input for secondary image */}
        <div className={styles.inputGroup}>
          <label>Secondary Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, setSecondaryImage)}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Other Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOtherImagesChange}
          />
        </div>

        {/* Input field for available quantity */}
        <div className={styles.inputGroup}>
          <label>Available Quantity:</label>
          <input
            type="number"
            value={availableQty}
            onChange={(e) => setAvailableQty(parseInt(e.target.value))}
            required
          />
        </div>

        {/* Submit button with loading state */}
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Adding Vehicle...' : 'Add Vehicle'}
        </button>

        {/* Display error message if any */}
        {error && <p className={styles.errorMessage}>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default AddVehicleForm;
