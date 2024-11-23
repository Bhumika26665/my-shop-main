import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig'; // Adjust according to your setup

const useFetchData = (endpoint, token) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(response.data);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(); // Fetch data on initial render
    }, [endpoint, token]);

    return { data, error, loading, fetchData }; // Make sure to return fetchData
};

export default useFetchData;
