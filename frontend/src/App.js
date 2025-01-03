import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const App = () => {
  const [deceptiveComment, setDeceptiveComment] = useState('');
  const [fakeUrls, setFakeUrls] = useState([]);
  const [deceptiveCookies, setDeceptiveCookies] = useState([]);
  const [deceptiveApi, setApiData] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    fetchDeceptiveComment();
    fetchDeceptiveCookies();
    // Uncomment to fetch fake URLs and API data if needed
    // fetchFakeUrls();
    // fetchApiData();
  }, []);

  const fetchDeceptiveComment = async () => {
    try {
      const response = await axios.get('http://localhost:8000/deceptive-comments', { withCredentials: true });
      setDeceptiveComment(response.data);
      console.log('Deceptive comment:', response.data);
    } catch (error) {
      console.error('Error fetching deceptive comment:', error);
    }
  };

  const fetchDeceptiveCookies = async () => {
    try {
      const response = await axios.get('http://localhost:8000/get-deceptive-cookies', { withCredentials: true });
      setDeceptiveCookies(response.data);
      console.log('Cookies on client:', document.cookie); // Logs cookies to the console
    } catch (error) {
      console.error('Error fetching deceptive cookies:', error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
