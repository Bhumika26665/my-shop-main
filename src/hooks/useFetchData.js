import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; // Adjust according to your setup

const useFetchData = (endpoint) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(endpoint);
            setData(response.data);
        } catch (err) {
            setError('Error fetching data');
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data on initial render
    }, [endpoint]);

    return { data, error, loading, fetchData }; // Make sure to return fetchData
};

export default useFetchData;
