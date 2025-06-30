import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Plus, 
  Search, 
  Bell, 
  TrendingUp, 
  Star,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Target,
  Activity,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react'

interface WatchlistItem {
  id: string
  player_name: string
  team: string
  position: string
  prospect_rank: number
  alert_price: number
  current_price: number
  price_change: number
  price_change_percentage: number
  status: 'active' | 'triggered' | 'paused'
  last_updated: string
  notes: string
  priority: 'high' | 'medium' | 'low'
}

const sampleWatchlist: WatchlistItem[] = [
  {
    id: '1',
    player_name: 'Termarr Johnson',
    team: 'Pittsburgh Pirates',
    position: '2B',
    prospect_rank: 15,
    alert_price: 150,
    current_price: 175,
    price_change: -25,
    price_change_percentage: -12.5,
    status: 'active',
    last_updated: '2024-01-15T14:30:00Z',
    notes: 'Top draft pick with excellent plate discipline',
    priority: 'high'
  },
  {
    id: '2',
    player_name: 'Druw Jones',
    team: 'Arizona Diamondbacks',
    position: 'OF',
    prospect_rank: 8,
    alert_price: 200,
    current_price: 185,
    price_change: 15,
    price_change_percentage: 8.8,
    status: 'triggered',
    last_updated: '2024-01-15T13:45:00Z',
    notes: 'Son of Andruw Jones, elite defensive tools',
    priority: 'high'
  },
  {
    id: '3',
    player_name: 'Jackson Holliday',
    team: 'Baltimore Orioles',
    position: 'SS',
    prospect_rank: 3,
    alert_price: 400,
    current_price: 520,
    price_change: -45,
    price_change_percentage: -7.9,
    status: 'active',
    last_updated: '2024-01-15T12:15:00Z',
    notes: 'MLB debut expected soon, massive upside',
    priority: 'high'
  },
  {
    id: '4',
    player_name: 'Wyatt Langford',
    team: 'Texas Rangers',
    position: 'OF',
    prospect_rank: 12,
    alert_price: 120,
    current_price: 145,
    price_change: 8,
    price_change_percentage: 5.8,
    status: 'active',
    last_updated: '2024-01-15T11:20:00Z',
    notes: 'College standout with power potential',
    priority: 'medium'
  },
  {
    id: '5',
    player_name: 'Colton Cowser',
    team: 'Baltimore Orioles',
    position: 'OF',
    prospect_rank: 25,
    alert_price: 80,
    current_price: 92,
    price_change: 3,
    price_change_percentage: 3.4,
    status: 'paused',
    last_updated: '2024-01-15T10:00:00Z',
    notes: 'Solid prospect but crowded OF in Baltimore',
    priority: 'low'
  }
]

const statusColors = {
  active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  triggered: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const priorityColors = {
  high: 'bg-red-500/20 text-red-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-green-500/20 text-green-400'
}

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(sampleWatchlist)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  const filteredWatchlist = watchlist.filter(item => {
    const matchesSearch = item.player_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.team.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = [
    {
      title: 'Active Alerts',
      value: watchlist.filter(item => item.status === 'active').length.toString(),
      subtitle: 'Monitoring prices',
      icon: Eye,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Triggered Alerts',
      value: watchlist.filter(item => item.status === 'triggered').length.toString(),
      subtitle: 'Price targets hit',
      icon: Bell,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Avg Target Price',
      value: `$${Math.round(watchlist.reduce((sum, item) => sum + item.alert_price, 0) / watchlist.length)}`,
      subtitle: 'Alert threshold',
      icon: DollarSign,
      color: 'from-orange-400 to-yellow-500'
    },
    {
      title: 'High Priority',
      value: watchlist.filter(item => item.priority === 'high').length.toString(),
      subtitle: 'Top prospects',
      icon: Star,
      color: 'from-purple-400 to-pink-500'
    }
  ]

  const toggleStatus = (id: string) => {
    setWatchlist(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'active' ? 'paused' : 'active' }
        : item
    ))
  }

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
                  <p className="text-xs text-slate-400 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search prospects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="triggered">Triggered</option>
                <option value="paused">Paused</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Player</span>
          </button>
        </div>
      </motion.div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWatchlist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                    {item.player_name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[item.priority]}`}>
                    {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-2">{item.team} • {item.position}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                    Rank #{item.prospect_rank}
                  </span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Alert Price</p>
                <p className="text-lg font-bold text-white">${item.alert_price}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Current Price</p>
                <p className="text-lg font-bold text-white">${item.current_price}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Change</p>
                <div className="flex items-center space-x-1">
                  {item.price_change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  )}
                  <span className={`text-sm font-bold ${item.price_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {item.price_change_percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {item.status === 'triggered' && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">
                    Price alert triggered! Target reached.
                  </span>
                </div>
              </div>
            )}

            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">Notes</p>
              <p className="text-sm text-slate-300">{item.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">
                  Updated {new Date(item.last_updated).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStatus(item.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    item.status === 'active' 
                      ? 'text-orange-400 hover:text-orange-300 hover:bg-orange-500/10' 
                      : 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10'
                  }`}
                >
                  {item.status === 'active' ? (
                    <Bell className="w-4 h-4" />
                  ) : (
                    <Target className="w-4 h-4" />
                  )}
                </button>
                <button className="p-2 text-slate-400 hover:text-green-400 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredWatchlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Eye className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No prospects found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  )
}