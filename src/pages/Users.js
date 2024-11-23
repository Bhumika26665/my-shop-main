// src/pages/UserPage.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/users');
            setUsers(response.data);
            setError(null);
        } catch (error) {
            setError('Error fetching users');
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold text-center mb-8">Users</h1>
            {loading && <p className="text-center">Loading users...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <UserForm
                            fetchUsers={fetchUsers}
                            editUser={editUser}
                            setEditUser={setEditUser}
                        />
                    </div>
                    <div>
                        <UserList
                            users={users}
                            setEditUser={setEditUser}
                            fetchUsers={fetchUsers}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;
