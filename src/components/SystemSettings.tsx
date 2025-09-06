// src/components/SystemSettings.tsx
import { useState } from 'react';

// Sample settings data
const initialSettings = {
  system: {
    notifications: true,
    autoBackup: true,
    backupFrequency: "daily",
    dataRetention: "365",
    language: "english",
    theme: "light"
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordComplexity: "medium",
    loginAttempts: "5",
    ipWhitelist: ""
  },
  notifications: {
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    caseUpdates: true,
    newCriminalAlerts: true,
    reportGeneration: false
  }
};

export const SystemSettings = () => {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("system");

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log("Saving settings:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        {["system", "security", "notifications"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Settings Form */}
      <div className="max-w-2xl">
        {activeTab === "system" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Enable Notifications</label>
              <input
                type="checkbox"
                checked={settings.system.notifications}
                onChange={(e) => handleSettingChange("system", "notifications", e.target.checked)}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="font-medium">Auto Backup</label>
              <input
                type="checkbox"
                checked={settings.system.autoBackup}
                onChange={(e) => handleSettingChange("system", "autoBackup", e.target.checked)}
                className="rounded"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Backup Frequency</label>
              <select
                value={settings.system.backupFrequency}
                onChange={(e) => handleSettingChange("system", "backupFrequency", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="font-medium block mb-2">Data Retention (days)</label>
              <input
                type="number"
                value={settings.system.dataRetention}
                onChange={(e) => handleSettingChange("system", "dataRetention", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Two-Factor Authentication</label>
              <input
                type="checkbox"
                checked={settings.security.twoFactorAuth}
                onChange={(e) => handleSettingChange("security", "twoFactorAuth", e.target.checked)}
                className="rounded"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange("security", "sessionTimeout", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="font-medium block mb-2">Password Complexity</label>
              <select
                value={settings.security.passwordComplexity}
                onChange={(e) => handleSettingChange("security", "passwordComplexity", e.target.value)}
                className="border rounded-md px-3 py-2 w-full"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="font-medium">Email Alerts</label>
              <input
                type="checkbox"
                checked={settings.notifications.emailAlerts}
                onChange={(e) => handleSettingChange("notifications", "emailAlerts", e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">SMS Alerts</label>
              <input
                type="checkbox"
                checked={settings.notifications.smsAlerts}
                onChange={(e) => handleSettingChange("notifications", "smsAlerts", e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">Case Updates</label>
              <input
                type="checkbox"
                checked={settings.notifications.caseUpdates}
                onChange={(e) => handleSettingChange("notifications", "caseUpdates", e.target.checked)}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-medium">New Criminal Alerts</label>
              <input
                type="checkbox"
                checked={settings.notifications.newCriminalAlerts}
                onChange={(e) => handleSettingChange("notifications", "newCriminalAlerts", e.target.checked)}
                className="rounded"
              />
            </div>
          </div>
        )}

        <button
          onClick={saveSettings}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};