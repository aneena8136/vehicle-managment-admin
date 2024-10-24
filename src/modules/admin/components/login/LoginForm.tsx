import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import the context
import Swal from 'sweetalert2';
import styles from './LoginForm.module.css';

const LOGIN_ADMIN_MUTATION = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginAdmin, { loading, error }] = useMutation(LOGIN_ADMIN_MUTATION);
  const router = useRouter();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const { data } = await loginAdmin({
        variables: { email, password },
      });
      if (data?.loginAdmin) {
        console.log('Login successful:', data);
        login();
        // Store the token in local storage
        localStorage.setItem('authToken', data.loginAdmin.token);

        // SweetAlert2 success message
        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
          icon: 'success',
          confirmButtonText: 'Continue',
        }).then(() => {
          router.push('/dashboard'); // Redirect after confirmation
        });
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message);
    }
  };

  return (
    <section className={styles.gradientForm}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            <div className={styles.textCenter}>
              <img
                src="https://media.istockphoto.com/id/1290071290/vector/rental-car-icon.jpg?s=612x612&w=0&k=20&c=q4EsvU3jJJYbcZTJ1EzKh6c-Dvy39HagvAUgTCRK9bE="
                alt="logo"
                className={styles.logo}
              />
              <h4 className={styles.title}>We are The Lotus Team</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className={styles.label}>Email</label>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className={styles.label}>Password</label>
              </div>

              <button type="submit" disabled={loading} className={styles.button}>
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
              {error && <p className={styles.errorMessage}>Error: {error.message}</p>}
            </form>
          </div>
        </div>
        <div className={styles.infoPanel}>
          <h4 className={styles.heading}>We are more than just a company</h4>
          <p className={styles.description}>
            We provide more than just cars – we offer freedom, convenience, and peace of mind. Whether you're heading out for a weekend getaway or need a reliable vehicle for your daily commute, we are here to get you moving.
          </p>
          <h2 className={styles.quote}>Drive the difference.</h2>
          <h3 className={styles.subQuote}>Your journey, our wheels.</h3>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;
