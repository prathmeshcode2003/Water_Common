import React from 'react';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();
  const consumerData = location.state?.consumerData;

  return (
    <div>
      <h1>Dashboard</h1>
      {consumerData ? (
        <div>
          <h2>Welcome, {consumerData.name}</h2>
          <p>Email: {consumerData.email}</p>
          {/* Display other consumer data as needed */}
        </div>
      ) : (
        <p>No consumer data available.</p>
      )}
    </div>
  );
};

export default Dashboard;