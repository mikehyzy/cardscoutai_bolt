import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Shield, 
  Bell, 
  DollarSign,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Zap,
  Globe,
  Smartphone,
  Mail,
  Key
} from 'lucide-react'

interface UserSettings {
  email: string
  bankroll: number
  riskTolerance: number
  maxPositionSize: number
  autoTrading: boolean
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    dealAlerts: boolean
    priceAlerts: boolean
    newsAlerts: boolean
  }
  apiKeys: {
    ebay: string
    comc: string
    alt: string
    stockx: string
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [settings, setSettings] = useState<UserSettings>({
    email: 'trader@example.com',
    bankroll: 25000,
    riskTolerance: 15,
    maxPositionSize: 2500,
    autoTrading: true,
    notifications: {
      email: true,
      sms: false,
      push: true,
      dealAlerts: true,
      priceAlerts: true,
      newsAlerts: false
    },
    apiKeys: {
      ebay: 'ebay_key_****',
      comc: 'comc_key_****',
      alt: 'alt_key_****',
      stockx: 'stockx_key_****'
    }
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'trading', name: 'Trading', icon: DollarSign },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'integrations', name: 'Integrations', icon: Globe },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const updateNotification = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const updateApiKey = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: {
        ...prev.apiKeys,
        [platform]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <p className="text-slate-400 mt-1">Configure your trading preferences and account settings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 h-fit"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Account Type</label>
                  <div className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg">
                    <span className="text-green-400 font-medium">Pro Trader</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-medium">Auto-trading is currently enabled</span>
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  Your account is configured for automated trading with real-time market scanning and deal execution.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Trading Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Total Bankroll ($)</label>
                  <input
                    type="number"
                    value={settings.bankroll}
                    onChange={(e) => updateSetting('bankroll', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Risk Tolerance (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={settings.riskTolerance}
                    onChange={(e) => updateSetting('riskTolerance', Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Max Position Size ($)</label>
                <input
                  type="number"
                  value={settings.maxPositionSize}
                  onChange={(e) => updateSetting('maxPositionSize', Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Maximum amount to invest in a single card
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h4 className="text-white font-medium">Auto-Trading</h4>
                  <p className="text-sm text-slate-400">Automatically execute trades based on your criteria</p>
                </div>
                <button
                  onClick={() => updateSetting('autoTrading', !settings.autoTrading)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoTrading ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoTrading ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-medium">Risk Management</span>
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  Current settings allow for ${(settings.bankroll * settings.riskTolerance / 100).toLocaleString()} total risk exposure
                </p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateNotification('email', !settings.notifications.email)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.email ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-green-400" />
                    <div>
                      <h4 className="text-white font-medium">SMS Notifications</h4>
                      <p className="text-sm text-slate-400">Receive alerts via text message</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateNotification('sms', !settings.notifications.sms)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.sms ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.sms ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <p className="text-sm text-slate-400">Browser notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateNotification('push', !settings.notifications.push)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications.push ? 'bg-green-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h4 className="text-white font-medium mb-4">Alert Types</h4>
                <div className="space-y-3">
                  {[
                    { key: 'dealAlerts', label: 'Deal Alerts', desc: 'New profitable deals found' },
                    { key: 'priceAlerts', label: 'Price Alerts', desc: 'Watchlist price targets hit' },
                    { key: 'newsAlerts', label: 'News Alerts', desc: 'Market moving news' }
                  ].map((alert) => (
                    <div key={alert.key} className="flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{alert.label}</span>
                        <p className="text-sm text-slate-400">{alert.desc}</p>
                      </div>
                      <button
                        onClick={() => updateNotification(alert.key as keyof typeof settings.notifications, !settings.notifications[alert.key as keyof typeof settings.notifications])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.notifications[alert.key as keyof typeof settings.notifications] ? 'bg-green-500' : 'bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.notifications[alert.key as keyof typeof settings.notifications] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-slate-400 mb-3">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Enable 2FA
                  </button>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Change Password</h4>
                  <p className="text-sm text-slate-400 mb-3">Update your account password</p>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Session Management</h4>
                  <p className="text-sm text-slate-400 mb-3">Manage your active sessions</p>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                    Sign Out All Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">API Integrations</h3>
                <button
                  onClick={() => setShowApiKeys(!showApiKeys)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 hover:text-white transition-colors"
                >
                  {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showApiKeys ? 'Hide' : 'Show'} Keys</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {Object.entries(settings.apiKeys).map(([platform, key]) => (
                  <div key={platform} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium capitalize">{platform} API</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Key className="w-4 h-4 text-slate-400" />
                      <input
                        type={showApiKeys ? 'text' : 'password'}
                        value={key}
                        onChange={(e) => updateApiKey(platform, e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-600/50 border border-slate-500 rounded-lg text-white text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">All integrations active</span>
                </div>
                <p className="text-sm text-slate-300 mt-2">
                  Your API connections are working properly and data is being synced in real-time.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}