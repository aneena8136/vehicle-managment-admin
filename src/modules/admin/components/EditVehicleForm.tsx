"use client";
import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';
import styles from "./EditVehicleForm.module.css";

// GraphQL query to fetch the vehicle data by ID
const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    getVehicleById(id: $id) {
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
      availableQty
      otherImages
    }
  }
`;

// GraphQL mutation to edit/update vehicle details
const EDIT_VEHICLE = gql`
  mutation EditVehicle(
    $id: ID!
    $name: String
    $manufacturer: String
    $model: String
    $fuelType: FuelType
    $gearType: GearType
    $seats: Int
    $price: Float
    $primaryImageFile: Upload
    $secondaryImageFile: Upload
    $otherImageFiles: [Upload]
    $availableQty: Int
  ) {
    editVehicle(
      id: $id
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

const EditVehicleForm = ({ id }) => {
  const router = useRouter();
  console.log('hii')

  const [formData, setFormData] = useState({
    name: "",
    manufacturer: "",
    model: "",
    fuelType: "",
    gearType: "",
    seats: 0,
    price: 0,
    availableQty: 0,
  });

  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [secondaryImageFile, setSecondaryImageFile] = useState(null);

  const [otherImageFiles, setOtherImageFiles] = useState([]);

  const { loading, error, data } = useQuery(GET_VEHICLE, {
    variables: { id },
    onCompleted: (data) => {
      const vehicle = data.getVehicleById;
      setFormData({
        name: vehicle.name,
        manufacturer: vehicle.manufacturer,
        model: vehicle.model,
        fuelType: vehicle.fuelType,
        gearType: vehicle.gearType,
        seats: vehicle.seats,
        price: vehicle.price,
        availableQty: vehicle.availableQty,
      });

      setOtherImageFiles(vehicle.otherImages || []);
    },
  });

  const [editVehicle] = useMutation(EDIT_VEHICLE);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFile) => { 
    console.log('hiiiii')
    const file = e.target.files[0];
    setFile(file);
  };

  // Corrected function to handle multiple other images
  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
    setOtherImageFiles(files); // Update state with new files
    console.log("Selected otherImageFiles:", files); // Log the selected files
  };

  useEffect(() => {
    // Log after state update to confirm the state change
    console.log("Updated otherImageFiles state:", otherImageFiles);
  }, [otherImageFiles]);

  const handleSubmit = async (e) => { 

    e.preventDefault();
    try {
      console.log("entred to edit inside try")
      console.log({
        id,
        ...formData,
        price: parseFloat(formData.price),
        seats: parseInt(formData.seats),
        availableQty: parseInt(formData.availableQty),
        primaryImageFile,
        secondaryImageFile,
        otherImageFiles,
      });
      console.log("otherImageFiles before mutation:", otherImageFiles);
      await editVehicle({
        variables: {
          id,
          ...formData,
          price: parseFloat(formData.price),
          seats: parseInt(formData.seats),
          availableQty: parseInt(formData.availableQty),
          primaryImageFile,
          secondaryImageFile,
          otherImageFiles, // Pass as is, should be an array
        },
      });
      Swal.fire("Vehicle Updated Succesfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error editing vehicle:", error);
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Edit Vehicle</h2>

      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="manufacturer">Manufacturer:</label>
        <input
          type="text"
          id="manufacturer"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="model">Model:</label>
        <input
          type="text"
          id="model"
          name="model"
          value={formData.model}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="fuelType">Fuel Type:</label>
        <select
          id="fuelType"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Fuel Type</option>
          <option value="PETROL">Petrol</option>
          <option value="DIESEL">Diesel</option>
          <option value="CNG">CNG</option>
          <option value="EV">Electric</option>
        </select>
      </div>

      <div>
        <label htmlFor="gearType">Gear Type:</label>
        <select
          id="gearType"
          name="gearType"
          value={formData.gearType}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Gear Type</option>
          <option value="MANUAL">Manual</option>
          <option value="AUTOMATIC">Automatic</option>
        </select>
      </div>

      <div>
        <label htmlFor="seats">Seats:</label>
        <input
          type="number"
          id="seats"
          name="seats"
          value={formData.seats}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="availableQty">Available Quantity:</label>
        <input
          type="number"
          id="availableQty"
          name="availableQty"
          value={formData.availableQty}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor="primaryImage">Primary Image:</label>
        <input
          type="file"
          id="primaryImage"
          onChange={(e) => handleFileChange(e, setPrimaryImageFile)}
        />
      </div>

      <div>
        <label htmlFor="secondaryImage">Secondary Image:</label>
        <input
          type="file"
          id="secondaryImage"
          onChange={(e) => handleFileChange(e, setSecondaryImageFile)}
        />
      </div>

      <div>
        <label htmlFor="otherImages">Other Images:</label>
        <input
          type="file"
          id="otherImages"
          multiple
          onChange={handleOtherImagesChange}
        />
      </div>

      <button type="submit">Update Vehicle</button>
    </form>
  );
};

export default EditVehicleForm;
