import React from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Eye,
  AlertTriangle,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const profitData = [
  { date: '2024-01', profit: 1200 },
  { date: '2024-02', profit: 1800 },
  { date: '2024-03', profit: 2400 },
  { date: '2024-04', profit: 1950 },
  { date: '2024-05', profit: 3200 },
  { date: '2024-06', profit: 2800 },
]

const platformData = [
  { platform: 'eBay', volume: 45, profit: 2400 },
  { platform: 'COMC', volume: 28, profit: 1800 },
  { platform: 'Alt', volume: 15, profit: 950 },
  { platform: 'StockX', volume: 12, profit: 720 },
]

const recentDeals = [
  {
    id: 1,
    player: 'Vladimir Guerrero Jr.',
    card: '2019 Topps Chrome RC PSA 10',
    buyPrice: 245,
    currentValue: 320,
    profit: 75,
    platform: 'eBay',
    time: '2 hours ago'
  },
  {
    id: 2,
    player: 'Ronald Acuña Jr.',
    card: '2018 Bowman Chrome Auto BGS 9.5',
    buyPrice: 890,
    currentValue: 1250,
    profit: 360,
    platform: 'COMC',
    time: '4 hours ago'
  },
  {
    id: 3,
    player: 'Juan Soto',
    card: '2018 Topps Update RC PSA 10',
    buyPrice: 125,
    currentValue: 185,
    profit: 60,
    platform: 'Alt',
    time: '6 hours ago'
  }
]

const alerts = [
  {
    id: 1,
    type: 'deal',
    message: 'High-value deal detected: Wander Franco RC below market',
    time: '5 min ago',
    urgent: true
  },
  {
    id: 2,
    type: 'news',
    message: 'Call-up alert: Jordan Walker promoted to majors',
    time: '12 min ago',
    urgent: false
  },
  {
    id: 3,
    type: 'inventory',
    message: 'Auto-repriced 12 listings based on market changes',
    time: '1 hour ago',
    urgent: false
  }
]

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Portfolio Value',
      value: '$12,847.50',
      change: '+18.2%',
      positive: true,
      icon: DollarSign,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Unrealized P&L',
      value: '$2,156.00',
      change: '+12.4%',
      positive: true,
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Inventory Count',
      value: '127',
      change: '+5 today',
      positive: true,
      icon: Package,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Active Watchlist',
      value: '43',
      change: '8 alerts',
      positive: false,
      icon: Eye,
      color: 'from-orange-400 to-red-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.positive ? 'text-green-400' : 'text-orange-400'}`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profit Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Profit Over Time</h3>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Live Trading Active</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Live Alerts</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  alert.urgent 
                    ? 'border-orange-500/30 bg-orange-500/10' 
                    : 'border-slate-600 bg-slate-700/30'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {alert.urgent ? (
                    <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium leading-tight">
                      {alert.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Platform Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="platform" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="profit" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Deals */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Recent Acquisitions</h3>
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-4">
            {recentDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{deal.player}</p>
                  <p className="text-xs text-slate-400 mt-1">{deal.card}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-slate-300">
                      Buy: <span className="text-red-400">${deal.buyPrice}</span>
                    </span>
                    <span className="text-xs text-slate-300">
                      Now: <span className="text-green-400">${deal.currentValue}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-400">+${deal.profit}</p>
                  <p className="text-xs text-slate-400">{deal.platform}</p>
                  <p className="text-xs text-slate-500 mt-1">{deal.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}