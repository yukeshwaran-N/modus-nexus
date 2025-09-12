import React, { useState, useEffect } from 'react';
import { policeOfficerService, PoliceOfficer, PoliceOfficerInput } from '../services/policeOfficerService';
import { useAuth } from '../context/useAuth';

const PoliceOfficerAdmin: React.FC = () => {
  const { policeOfficer } = useAuth();
  const [officers, setOfficers] = useState<PoliceOfficer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingOfficer, setEditingOfficer] = useState<PoliceOfficer | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    badge_number: '',
    name: '',
    email: '',
    password: '',
    rank: '',
    department: ''
  });

  const isAdmin = policeOfficer?.rank === 'Administrator' || policeOfficer?.rank === 'Chief';

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      setLoading(true);
      const data = await policeOfficerService.getAllOfficers();
      setOfficers(data);
    } catch (error) {
      setError('Failed to load police officers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const result = await policeOfficerService.createOfficer(formData);
      if (result) {
        setSuccess('Police officer created successfully');
        setFormData({ badge_number: '', name: '', email: '', password: '', rank: '', department: '' });
        setIsCreating(false);
        loadOfficers();
      } else {
        setError('Failed to create police officer');
      }
    } catch (error) {
      setError('Failed to create police officer');
    }
  };

  const handleUpdateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingOfficer) return;

    try {
      const result = await policeOfficerService.updateOfficer(editingOfficer.id, formData);
      if (result) {
        setSuccess('Police officer updated successfully');
        setEditingOfficer(null);
        setFormData({ badge_number: '', name: '', email: '', password: '', rank: '', department: '' });
        loadOfficers();
      } else {
        setError('Failed to update police officer');
      }
    } catch (error) {
      setError('Failed to update police officer');
    }
  };

  const handleDeleteOfficer = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;

    try {
      const success = await policeOfficerService.deleteOfficer(id);
      if (success) {
        setSuccess('Police officer deleted successfully');
        loadOfficers();
      } else {
        setError('Failed to delete police officer');
      }
    } catch (error) {
      setError('Failed to delete police officer');
    }
  };

  const startEdit = (officer: PoliceOfficer) => {
    setEditingOfficer(officer);
    setFormData({
      badge_number: officer.badge_number,
      name: officer.name,
      email: officer.email,
      password: '',
      rank: officer.rank,
      department: officer.department
    });
  };

  const cancelEdit = () => {
    setEditingOfficer(null);
    setIsCreating(false);
    setFormData({ badge_number: '', name: '', email: '', password: '', rank: '', department: '' });
  };

  if (!isAdmin) {
    return (
      <div className="admin-container">
        <div className="admin-error">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Police Officer Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsCreating(true)}
          disabled={isCreating || editingOfficer !== null}
        >
          Add New Officer
        </button>
      </div>

      {(isCreating || editingOfficer) && (
        <div className="admin-form">
          <h3>{editingOfficer ? 'Edit Officer' : 'Create New Officer'}</h3>
          <form onSubmit={editingOfficer ? handleUpdateOfficer : handleCreateOfficer}>
            <div className="form-row">
              <div className="form-group">
                <label>Badge Number</label>
                <input
                  type="text"
                  name="badge_number"
                  value={formData.badge_number}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingOfficer}
                  placeholder={editingOfficer ? 'Leave blank to keep current password' : ''}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Rank</label>
                <select
                  name="rank"
                  value={formData.rank}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Rank</option>
                  <option value="Officer">Officer</option>
                  <option value="Detective">Detective</option>
                  <option value="Sergeant">Sergeant</option>
                  <option value="Lieutenant">Lieutenant</option>
                  <option value="Captain">Captain</option>
                  <option value="Commander">Commander</option>
                  <option value="Deputy Chief">Deputy Chief</option>
                  <option value="Chief">Chief</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingOfficer ? 'Update Officer' : 'Create Officer'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="officers-list">
        <h3>Police Officers</h3>
        {loading ? (
          <p>Loading officers...</p>
        ) : officers.length === 0 ? (
          <p>No police officers found.</p>
        ) : (
          <table className="officers-table">
            <thead>
              <tr>
                <th>Badge Number</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rank</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.map(officer => (
                <tr key={officer.id}>
                  <td>{officer.badge_number}</td>
                  <td>{officer.name}</td>
                  <td>{officer.email}</td>
                  <td>{officer.rank}</td>
                  <td>{officer.department}</td>
                  <td>
                    <span className={`status ${officer.is_active ? 'active' : 'inactive'}`}>
                      {officer.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => startEdit(officer)}
                      disabled={isCreating || editingOfficer !== null}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteOfficer(officer.id)}
                      disabled={isCreating || editingOfficer !== null}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PoliceOfficerAdmin;