import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Target,
  Zap,
  PieChart,
  Activity
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
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  AreaChart,
  Area,
  Pie
} from 'recharts'

const monthlyData = [
  { month: 'Jan', revenue: 2400, profit: 1200, transactions: 12 },
  { month: 'Feb', revenue: 3200, profit: 1800, transactions: 16 },
  { month: 'Mar', revenue: 2800, profit: 1400, transactions: 14 },
  { month: 'Apr', revenue: 4100, profit: 2100, transactions: 18 },
  { month: 'May', revenue: 3800, profit: 1950, transactions: 20 },
  { month: 'Jun', revenue: 4500, profit: 2400, transactions: 22 },
]

const platformData = [
  { platform: 'eBay', value: 45, profit: 2400, color: '#3B82F6' },
  { platform: 'COMC', value: 28, profit: 1800, color: '#8B5CF6' },
  { platform: 'Alt', value: 15, profit: 950, color: '#EC4899' },
  { platform: 'StockX', value: 12, profit: 720, color: '#10B981' },
]

const performanceData = [
  { date: '2024-01-01', portfolio: 8500, benchmark: 8500 },
  { date: '2024-01-08', portfolio: 8750, benchmark: 8600 },
  { date: '2024-01-15', portfolio: 9200, benchmark: 8800 },
  { date: '2024-01-22', portfolio: 9650, benchmark: 9100 },
  { date: '2024-01-29', portfolio: 10200, benchmark: 9400 },
  { date: '2024-02-05', portfolio: 10800, benchmark: 9700 },
  { date: '2024-02-12', portfolio: 11400, benchmark: 10000 },
  { date: '2024-02-19', portfolio: 11850, benchmark: 10200 },
  { date: '2024-02-26', portfolio: 12300, benchmark: 10500 },
  { date: '2024-03-05', portfolio: 12850, benchmark: 10800 },
]

const cardTypeData = [
  { type: 'Rookie Cards', count: 45, value: 6500 },
  { type: 'Autographs', count: 28, value: 4200 },
  { type: 'Parallels', count: 32, value: 2800 },
  { type: 'Vintage', count: 15, value: 3200 },
  { type: 'Prospects', count: 22, value: 1800 },
]

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('6M')
  const [selectedMetric, setSelectedMetric] = useState('profit')

  const stats = [
    {
      title: 'Total ROI',
      value: '42.8%',
      change: '+5.2%',
      positive: true,
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$4,500',
      change: '+18.5%',
      positive: true,
      icon: DollarSign,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Avg Hold Time',
      value: '45 days',
      change: '-12 days',
      positive: true,
      icon: Calendar,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Win Rate',
      value: '78.5%',
      change: '+3.2%',
      positive: true,
      icon: Target,
      color: 'from-orange-400 to-yellow-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
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
        {/* Revenue Chart */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue & Profit Trends</h3>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:border-green-500"
              >
                <option value="1M">1M</option>
                <option value="3M">3M</option>
                <option value="6M">6M</option>
                <option value="1Y">1Y</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#22C55E" 
                fill="#22C55E"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Platform Distribution */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Platform Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {platformData.map((item) => (
              <div key={item.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-300">{item.platform}</span>
                </div>
                <span className="text-sm font-medium text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Portfolio vs Benchmark</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
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
                dataKey="portfolio" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="benchmark" 
                stroke="#6B7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Card Type Analysis */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h3 className="text-lg font-semibold text-white mb-6">Card Type Analysis</h3>
          <div className="space-y-4">
            {cardTypeData.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30">
                <div>
                  <p className="text-sm font-medium text-white">{item.type}</p>
                  <p className="text-xs text-slate-400">{item.count} cards</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">${item.value.toLocaleString()}</p>
                  <div className="w-20 h-2 bg-slate-600 rounded-full mt-1">
                    <div 
                      className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                      style={{ width: `${(item.value / 6500) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Transaction Volume */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Transaction Volume</h3>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400">Auto-trading enabled</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="transactions" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}