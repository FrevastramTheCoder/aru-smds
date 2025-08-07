import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

/**
 * Admin panel for managing users and their roles.
 */
function AdminPanel() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAuthenticated || currentUser?.role !== 'admin') {
        setError('Access denied. Admin role required.');
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setError('');
      } catch (error) {
        console.error('Error fetching users:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (error.response?.status === 401) {
          setError('Unauthorized: Please log in again.');
          logout();
          navigate('/login');
        } else if (error.response?.status === 403) {
          setError('Access denied. Admin role required.');
        } else {
          setError(error.response?.data?.message || 'Failed to load users.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [isAuthenticated, currentUser, logout, navigate]);

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/api/auth/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      setError('');
    } catch (error) {
      console.error('Error updating role:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to update role.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setError('');
    } catch (error) {
      console.error('Error deleting user:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 401) {
        setError('Unauthorized: Please log in again.');
        logout();
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return <div className="p-4 text-red-500">Access denied. Admin role required.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="card-title text-2xl font-bold mb-4">Admin Panel</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <div className="loading-spinner">Loading users...</div>
        ) : (
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Verified</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="dark:bg-gray-800">
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                      {user.is_email_verified ? 'Yes' : 'No'}
                    </td>
                    <td className="px-4 py-2 border text-center">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;