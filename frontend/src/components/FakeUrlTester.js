import React, { useState, useEffect } from 'react';

const FakeUrlTester = () => {
  const [fakeUrl, setFakeUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch a fake URL from the backend
  useEffect(() => {
    const fetchFakeUrl = async () => {
      try {
        const response = await fetch('http://localhost:8000/deceptive-comments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch a fake URL');
        }

        const data = await response.text(); // Fake comment returned as plain text
        setFakeUrl(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFakeUrl();
  }, []);

  if (loading) {
    return <p>Loading fake URL...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Test Fake URL</h2>
      <p>
        <a href={fakeUrl} target="_blank" rel="noopener noreferrer">
          {fakeUrl}
        </a>
      </p>
    </div>
  );
};

export default FakeUrlTester;
