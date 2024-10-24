import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import styles from './Dashboard.module.css';
import { useRouter } from 'next/navigation';
import { CiSearch } from "react-icons/ci";
import client from '../../../lib/typesenseClient';
import CustomCarousel from './slider/CustomCarousel'

// GraphQL query to fetch all vehicles from the database
const GET_ALL_VEHICLES = gql`
  query GetAllVehicles {
    getAllVehicles {
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

// GraphQL mutation to delete a vehicle by its ID
const DELETE_VEHICLE = gql`
  mutation DeleteVehicle($id: ID!) {
    deleteVehicle(id: $id)
  }
`;

const Dashboard = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ALL_VEHICLES, {
    onError: (error) => {
      console.error('Apollo error:', error);
    },
  });

  const [deleteVehicle] = useMutation(DELETE_VEHICLE, {
    refetchQueries: [{ query: GET_ALL_VEHICLES }],
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
    },
  });

  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setConfirmDelete(true);
  };

  const confirmDeleteVehicle = async () => {
    if (vehicleToDelete) {
      await deleteVehicle({ variables: { id: vehicleToDelete } });
      setVehicleToDelete(null);
      setConfirmDelete(false);
    }
  };

  const cancelDelete = () => {
    setVehicleToDelete(null);
    setConfirmDelete(false);
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const searchParameters = {
          q: searchQuery,
          query_by: 'name,manufacturer,model',
        };

        const searchResponse = await client.collections('vehicles').documents().search(searchParameters);
        setSearchResults(searchResponse.hits.map(hit => hit.document));
      } catch (error) {
        console.error('Error searching vehicles:', error);
      }
    };

    const timeoutId = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div>
        <p>Error loading vehicles. Please check the console for more details.</p>
        <p>Error message: {error.message}</p>
      </div>
    );
  }

  const vehicles = data?.getAllVehicles || [];
  const displayedVehicles = searchResults.length > 0 ? searchResults : vehicles;

  if (displayedVehicles.length === 0) {
    return <p className={styles.noVehicle}>No vehicles found. The database might be empty.</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Vehicle Dashboard</h1>

      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <CiSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, manufacturer, or model"
            className={styles.searchBox}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.vehicleTable}>
          <thead>
            <tr>
              <th>Images</th>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Model</th>
              <th>Fuel Type</th>
              <th>Gear Type</th>
              <th>Seats</th>
              <th>Price (Rs)</th>
              <th>Available Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedVehicles.map((vehicle: any) => {
              const allImages = [
                vehicle.primaryImage,
                vehicle.secondaryImage,
                ...(vehicle.otherImages || [])
              ].filter(Boolean);

              return (
                <tr key={vehicle.id}>
                  <td>
                  <CustomCarousel images={allImages}  />
                  </td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.manufacturer}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.fuelType}</td>
                  <td>{vehicle.gearType}</td>
                  <td>{vehicle.seats}</td>
                  <td>{vehicle.price}</td>
                  <td>{vehicle.availableQty}</td>
                  <td>
                    <div className={styles.buttonContainer}>
                      <button className={styles.editButton} onClick={() => router.push(`/edit-vehicle/${vehicle.id}`)}>✏️</button>
                      <button className={styles.rentButton} onClick={() => handleDeleteClick(vehicle.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <div className={styles.confirmationPopup}>
          <p>Are you sure you want to delete this vehicle?</p>
          <button onClick={confirmDeleteVehicle}>Yes</button>
          <button onClick={cancelDelete}>No</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;