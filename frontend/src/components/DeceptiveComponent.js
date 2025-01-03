
import React, { useEffect, useState } from 'react';

const DeceptiveComponent = () => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch deceptive comments from backend when the component mounts
  useEffect(() => {
    const fetchDeceptiveComment = async () => {
      try {
        const response = await fetch('http://localhost:8000/deceptive-comments', {
          method: 'GET',  // or 'POST' based on your backend route
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch deceptive comments');
        }

        const data = await response.text(); // Since it's a simple string being returned
        setComment(data); // Set the deceptive comment in the state
        setLoading(false);
      } catch (error) {
        setError(error.message); // Handle any errors that occurred during the fetch
        setLoading(false);
      }
    };

    fetchDeceptiveComment();
  }, []); // Empty dependency array to only run once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
  
    </div>
    
  );
};

export default DeceptiveComponent;
