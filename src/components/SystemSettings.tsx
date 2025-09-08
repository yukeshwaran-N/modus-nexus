// src/components/SystemSettings.tsx
import { useState } from 'react';
import { Save, Download, Upload, Key, User, Shield, Bell, Database, Cpu, History, Lock } from 'lucide-react';
import { EncryptionKeyManager } from '@/components/EncryptionKeyManager';

// Sample settings data
const initialSettings = {
  system: {
    notifications: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    language: "english",
    theme: "light",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    autoLogout: true,
    logoutTimeout: "30"
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordComplexity: "medium",
    loginAttempts: "5",
    ipWhitelist: "",
    encryptionLevel: "aes-256",
    auditLogging: true,
    ipBlocking: true,
    failedLoginLockout: true,
    dataEncryption: true
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    caseUpdates: true,
    newCriminalAlerts: true,
    reportGeneration: false,
    systemAlerts: true,
    backupNotifications: true,
    securityBreachAlerts: true
  },
  api: {
    apiEnabled: true,
    rateLimiting: true,
    maxRequestsPerMinute: "100",
    apiKeyRotation: true,
    corsEnabled: true,
    allowedOrigins: "*",
    webhookSupport: true,
    webhookUrl: ""
  },
  users: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@police.gov",
      role: "administrator",
      status: "active",
      lastLogin: "2024-03-25T10:30:00"
    },
    {
      id: 2,
      name: "Inspector Sharma",
      email: "sharma@police.gov",
      role: "officer",
      status: "active",
      lastLogin: "2024-03-24T15:45:00"
    },
    {
      id: 3,
      name: "Constable Patel",
      email: "patel@police.gov",
      role: "viewer",
      status: "inactive",
      lastLogin: "2024-03-20T09:15:00"
    }
  ],
  auditLogs: [
    {
      id: 1,
      action: "LOGIN",
      user: "admin@police.gov",
      timestamp: "2024-03-25T10:30:00",
      ip: "192.168.1.100",
      status: "SUCCESS"
    },
    {
      id: 2,
      action: "SETTINGS_UPDATE",
      user: "admin@police.gov",
      timestamp: "2024-03-25T09:15:00",
      ip: "192.168.1.100",
      status: "SUCCESS"
    },
    {
      id: 3,
      action: "LOGIN_ATTEMPT",
      user: "unknown",
      timestamp: "2024-03-25T08:30:00",
      ip: "103.21.244.0",
      status: "FAILED"
    }
  ]
};

export const SystemSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("system");
  const [isSaving, setIsSaving] = useState(false);
  const [backupFile, setBackupFile] = useState<File | null>(null);

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleUserRoleChange = (userId: number, newRole: string) => {
    setSettings(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    }));
  };

  const handleUserStatusChange = (userId: number, newStatus: string) => {
    setSettings(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Saving settings:", settings);
      alert("Settings saved successfully!");
    } catch (error) {
      alert("Error saving settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'system-settings-backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          alert("Settings imported successfully!");
        } catch (error) {
          alert("Error importing settings. Invalid file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const resetToDefaults = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings(initialSettings);
      alert("Settings reset to defaults.");
    }
  };

  const generateApiKey = () => {
    const newApiKey = `sk_${Math.random().toString(36).substr(2, 32)}`;
    alert(`New API Key Generated:\n${newApiKey}\n\nPlease save this key securely. It won't be shown again.`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <div className="flex gap-2">
          <button
            onClick={exportSettings}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <Upload className="h-4 w-4" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              className="hidden"
            />
          </label>
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {[
          { id: "system", label: "System", icon: <Cpu className="h-4 w-4" /> },
          { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
          { id: "encryption", label: "Encryption", icon: <Lock className="h-4 w-4" /> },
          { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
          { id: "api", label: "API", icon: <Key className="h-4 w-4" /> },
          { id: "users", label: "Users", icon: <User className="h-4 w-4" /> },
          { id: "audit", label: "Audit Logs", icon: <History className="h-4 w-4" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg border p-6">
        {activeTab === "system" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">General Settings</h3>
              <ToggleSetting
                label="Enable Notifications"
                checked={settings.system.notifications}
                onChange={(checked) => handleSettingChange("system", "notifications", checked)}
              />
              <ToggleSetting
                label="Auto Backup"
                checked={settings.system.autoBackup}
                onChange={(checked) => handleSettingChange("system", "autoBackup", checked)}
              />
              <ToggleSetting
                label="Auto Logout"
                checked={settings.system.autoLogout}
                onChange={(checked) => handleSettingChange("system", "autoLogout", checked)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Configuration</h3>
              <SelectSetting
                label="Backup Frequency"
                value={settings.system.backupFrequency}
                options={[
                  { value: "daily", label: "Daily" },
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" }
                ]}
                onChange={(value) => handleSettingChange("system", "backupFrequency", value)}
              />
              <InputSetting
                label="Data Retention (days)"
                type="number"
                value={settings.system.dataRetention}
                onChange={(value) => handleSettingChange("system", "dataRetention", value)}
              />
              <InputSetting
                label="Logout Timeout (minutes)"
                type="number"
                value={settings.system.logoutTimeout}
                onChange={(value) => handleSettingChange("system", "logoutTimeout", value)}
              />
              <SelectSetting
                label="Timezone"
                value={settings.system.timezone}
                options={[
                  { value: "Asia/Kolkata", label: "IST (Asia/Kolkata)" },
                  { value: "UTC", label: "UTC" },
                  { value: "America/New_York", label: "EST (America/New_York)" }
                ]}
                onChange={(value) => handleSettingChange("system", "timezone", value)}
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Authentication</h3>
              <ToggleSetting
                label="Two-Factor Authentication"
                checked={settings.security.twoFactorAuth}
                onChange={(checked) => handleSettingChange("security", "twoFactorAuth", checked)}
              />
              <ToggleSetting
                label="Failed Login Lockout"
                checked={settings.security.failedLoginLockout}
                onChange={(checked) => handleSettingChange("security", "failedLoginLockout", checked)}
              />
              <ToggleSetting
                label="IP Blocking"
                checked={settings.security.ipBlocking}
                onChange={(checked) => handleSettingChange("security", "ipBlocking", checked)}
              />
              <ToggleSetting
                label="Audit Logging"
                checked={settings.security.auditLogging}
                onChange={(checked) => handleSettingChange("security", "auditLogging", checked)}
              />
              <ToggleSetting
                label="Data Encryption"
                checked={settings.security.dataEncryption}
                onChange={(checked) => handleSettingChange("security", "dataEncryption", checked)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Security Policies</h3>
              <InputSetting
                label="Session Timeout (minutes)"
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(value) => handleSettingChange("security", "sessionTimeout", value)}
              />
              <InputSetting
                label="Max Login Attempts"
                type="number"
                value={settings.security.loginAttempts}
                onChange={(value) => handleSettingChange("security", "loginAttempts", value)}
              />
              <SelectSetting
                label="Password Complexity"
                value={settings.security.passwordComplexity}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" }
                ]}
                onChange={(value) => handleSettingChange("security", "passwordComplexity", value)}
              />
              <SelectSetting
                label="Encryption Level"
                value={settings.security.encryptionLevel}
                options={[
                  { value: "aes-128", label: "AES-128" },
                  { value: "aes-256", label: "AES-256" },
                  { value: "rsa-2048", label: "RSA-2048" }
                ]}
                onChange={(value) => handleSettingChange("security", "encryptionLevel", value)}
              />
            </div>
          </div>
        )}

        {activeTab === "encryption" && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg mb-4">Data Encryption</h3>
            <p className="text-gray-600 mb-6">
              Manage encryption settings for sensitive data. All data is encrypted at rest and in transit using AES-256 encryption.
            </p>
            <EncryptionKeyManager />
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Notification Channels</h3>
              <ToggleSetting
                label="Email Alerts"
                checked={settings.notifications.emailAlerts}
                onChange={(checked) => handleSettingChange("notifications", "emailAlerts", checked)}
              />
              <ToggleSetting
                label="SMS Alerts"
                checked={settings.notifications.smsAlerts}
                onChange={(checked) => handleSettingChange("notifications", "smsAlerts", checked)}
              />
              <ToggleSetting
                label="Push Notifications"
                checked={settings.notifications.pushNotifications}
                onChange={(checked) => handleSettingChange("notifications", "pushNotifications", checked)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">Alert Types</h3>
              <ToggleSetting
                label="Case Updates"
                checked={settings.notifications.caseUpdates}
                onChange={(checked) => handleSettingChange("notifications", "caseUpdates", checked)}
              />
              <ToggleSetting
                label="New Criminal Alerts"
                checked={settings.notifications.newCriminalAlerts}
                onChange={(checked) => handleSettingChange("notifications", "newCriminalAlerts", checked)}
              />
              <ToggleSetting
                label="System Alerts"
                checked={settings.notifications.systemAlerts}
                onChange={(checked) => handleSettingChange("notifications", "systemAlerts", checked)}
              />
              <ToggleSetting
                label="Security Breach Alerts"
                checked={settings.notifications.securityBreachAlerts}
                onChange={(checked) => handleSettingChange("notifications", "securityBreachAlerts", checked)}
              />
            </div>
          </div>
        )}

        {activeTab === "api" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">API Configuration</h3>
              <ToggleSetting
                label="API Enabled"
                checked={settings.api.apiEnabled}
                onChange={(checked) => handleSettingChange("api", "apiEnabled", checked)}
              />
              <ToggleSetting
                label="Rate Limiting"
                checked={settings.api.rateLimiting}
                onChange={(checked) => handleSettingChange("api", "rateLimiting", checked)}
              />
              <ToggleSetting
                label="API Key Rotation"
                checked={settings.api.apiKeyRotation}
                onChange={(checked) => handleSettingChange("api", "apiKeyRotation", checked)}
              />
              <ToggleSetting
                label="CORS Enabled"
                checked={settings.api.corsEnabled}
                onChange={(checked) => handleSettingChange("api", "corsEnabled", checked)}
              />
              <ToggleSetting
                label="Webhook Support"
                checked={settings.api.webhookSupport}
                onChange={(checked) => handleSettingChange("api", "webhookSupport", checked)}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">API Settings</h3>
              <InputSetting
                label="Max Requests Per Minute"
                type="number"
                value={settings.api.maxRequestsPerMinute}
                onChange={(value) => handleSettingChange("api", "maxRequestsPerMinute", value)}
              />
              <InputSetting
                label="Allowed Origins"
                type="text"
                value={settings.api.allowedOrigins}
                onChange={(value) => handleSettingChange("api", "allowedOrigins", value)}
                placeholder="https://example.com, https://api.example.com"
              />
              <InputSetting
                label="Webhook URL"
                type="url"
                value={settings.api.webhookUrl}
                onChange={(value) => handleSettingChange("api", "webhookUrl", value)}
                placeholder="https://your-webhook-url.com/endpoint"
              />
              <div>
                <label className="font-medium block mb-2">API Key Management</label>
                <button
                  onClick={generateApiKey}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Generate New API Key
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Name</th>
                    <th className="border p-3 text-left">Email</th>
                    <th className="border p-3 text-left">Role</th>
                    <th className="border p-3 text-left">Status</th>
                    <th className="border p-3 text-left">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="border p-3">{user.name}</td>
                      <td className="border p-3">{user.email}</td>
                      <td className="border p-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="administrator">Administrator</option>
                          <option value="officer">Officer</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </td>
                      <td className="border p-3">
                        <select
                          value={user.status}
                          onChange={(e) => handleUserStatusChange(user.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </td>
                      <td className="border p-3">
                        {new Date(user.lastLogin).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg mb-4">Audit Logs</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-3 text-left">Action</th>
                    <th className="border p-3 text-left">User</th>
                    <th className="border p-3 text-left">Timestamp</th>
                    <th className="border p-3 text-left">IP Address</th>
                    <th className="border p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="border p-3 font-mono text-sm">{log.action}</td>
                      <td className="border p-3">{log.user}</td>
                      <td className="border p-3">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="border p-3 font-mono text-sm">{log.ip}</td>
                      <td className="border p-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          log.status === "SUCCESS" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab !== "encryption" && (
          <div className="mt-8 pt-6 border-t">
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable components for settings
const ToggleSetting = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <div className="flex items-center justify-between">
    <label className="font-medium">{label}</label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded"
    />
  </div>
);

const InputSetting = ({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (value: string) => void; placeholder?: string }) => (
  <div>
    <label className="font-medium block mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded-md px-3 py-2 w-full"
    />
  </div>
);

const SelectSetting = ({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) => (
  <div>
    <label className="font-medium block mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-md px-3 py-2 w-full"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SystemSettings;