import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // Adjust the path as needed
import styles from './Sidebar.module.css';
import { BsGrid, BsCarFront, BsCardList } from "react-icons/bs";
import { TbLogout } from "react-icons/tb";
import { LiaCarSideSolid } from "react-icons/lia";
import { GiHamburgerMenu } from "react-icons/gi";

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar state
    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            {/* Hamburger menu for mobile */}
            <GiHamburgerMenu className={styles.hamburger} onClick={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Sidebar */}
            <div className={`${styles.sidebar} ${sidebarOpen ? styles.active : ''}`}>
                <div className={styles.titleContainer}>
                    <BsGrid className={styles.icon} />
                    <h2 className={styles.title}>Admin Panel</h2>
                </div>
                <ul>
                    <li onClick={() => router.push('/add-vehicle')}>
                        <BsCarFront className={styles.carIcon} /> Add Vehicle
                    </li>
                    
                    <li onClick={() => router.push('/dashboard')}>
                        <LiaCarSideSolid className={styles.carIcon} /> View Vehicles
                    </li>
                    <li onClick={() => router.push('/viewbooking')}>
                        <BsCardList className={styles.carIcon} /> View Bookings
                    </li>
                    <li onClick={handleLogout}>
                        <TbLogout className={styles.carIcon} />
                        Logout
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
