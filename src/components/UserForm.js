import React, { useState } from 'react';

const UserForm = ({ fetchUsers, editUser, setEditUser }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle form submission (add/edit user)
        fetchUsers();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <button type="submit">{editUser ? 'Update User' : 'Add User'}</button>
        </form>
    );
};

export default UserForm;
