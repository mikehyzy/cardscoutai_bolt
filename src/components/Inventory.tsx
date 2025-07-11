import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  SortAsc, 
  Plus, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Award,
  Package
} from 'lucide-react'

interface InventoryItem {
  id: string
  card_name: string
  player_name: string
  year: number
  set_name: string
  card_number: string
  grade_company: string
  grade: number
  purchase_price: number
  current_value: number
  purchase_date: string
  platform: string
  status: 'owned' | 'listed' | 'sold'
  profit_loss: number
  profit_percentage: number
}

// Sample inventory data
const sampleInventory: InventoryItem[] = [
  {
    id: '1',
    card_name: '2019 Topps Chrome Ronald Acuña Jr. RC',
    player_name: 'Ronald Acuña Jr.',
    year: 2019,
    set_name: 'Topps Chrome',
    card_number: '1',
    grade_company: 'PSA',
    grade: 10,
    purchase_price: 450,
    current_value: 625,
    purchase_date: '2024-01-15',
    platform: 'eBay',
    status: 'owned',
    profit_loss: 175,
    profit_percentage: 38.9
  },
  {
    id: '2',
    card_name: '2018 Bowman Chrome Juan Soto Auto',
    player_name: 'Juan Soto',
    year: 2018,
    set_name: 'Bowman Chrome',
    card_number: 'CPA-JS',
    grade_company: 'BGS',
    grade: 9.5,
    purchase_price: 1200,
    current_value: 1850,
    purchase_date: '2023-12-08',
    platform: 'COMC',
    status: 'listed',
    profit_loss: 650,
    profit_percentage: 54.2
  },
  {
    id: '3',
    card_name: '2020 Topps Chrome Vladimir Guerrero Jr.',
    player_name: 'Vladimir Guerrero Jr.',
    year: 2020,
    set_name: 'Topps Chrome',
    card_number: '100',
    grade_company: 'PSA',
    grade: 9,
    purchase_price: 285,
    current_value: 340,
    purchase_date: '2024-02-20',
    platform: 'Alt',
    status: 'owned',
    profit_loss: 55,
    profit_percentage: 19.3
  },
  {
    id: '4',
    card_name: '2021 Bowman Chrome Wander Franco RC',
    player_name: 'Wander Franco',
    year: 2021,
    set_name: 'Bowman Chrome',
    card_number: 'BCP-150',
    grade_company: 'PSA',
    grade: 10,
    purchase_price: 180,
    current_value: 95,
    purchase_date: '2024-01-30',
    platform: 'StockX',
    status: 'owned',
    profit_loss: -85,
    profit_percentage: -47.2
  },
  {
    id: '5',
    card_name: '2019 Topps Chrome Pete Alonso RC',
    player_name: 'Pete Alonso',
    year: 2019,
    set_name: 'Topps Chrome',
    card_number: '204',
    grade_company: 'BGS',
    grade: 9,
    purchase_price: 125,
    current_value: 180,
    purchase_date: '2024-03-05',
    platform: 'eBay',
    status: 'owned',
    profit_loss: 55,
    profit_percentage: 44.0
  },
  {
    id: '6',
    card_name: '2020 Bowman Chrome Jasson Dominguez',
    player_name: 'Jasson Dominguez',
    year: 2020,
    set_name: 'Bowman Chrome',
    card_number: 'BCP-100',
    grade_company: 'PSA',
    grade: 10,
    purchase_price: 320,
    current_value: 425,
    purchase_date: '2024-02-12',
    platform: 'COMC',
    status: 'listed',
    profit_loss: 105,
    profit_percentage: 32.8
  }
]

const statusColors = {
  owned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  listed: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  sold: 'bg-green-500/20 text-green-400 border-green-500/30'
}

const gradeColors = {
  10: 'bg-green-500/20 text-green-400',
  9.5: 'bg-emerald-500/20 text-emerald-400',
  9: 'bg-yellow-500/20 text-yellow-400',
  8.5: 'bg-orange-500/20 text-orange-400',
  8: 'bg-red-500/20 text-red-400'
}

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(sampleInventory)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('purchase_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedInventory = inventory
    .filter(item => {
      const matchesSearch = item.player_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.card_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof InventoryItem]
      let bValue = b[sortBy as keyof InventoryItem]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const totalValue = inventory.reduce((sum, item) => sum + item.current_value, 0)
  const totalCost = inventory.reduce((sum, item) => sum + item.purchase_price, 0)
  const totalProfit = totalValue - totalCost
  const totalProfitPercentage = ((totalProfit / totalCost) * 100)

  const stats = [
    {
      title: 'Total Items',
      value: inventory.length.toString(),
      subtitle: `${inventory.filter(i => i.status === 'owned').length} owned`,
      icon: Package,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Portfolio Value',
      value: `$${totalValue.toLocaleString()}`,
      subtitle: `Cost: $${totalCost.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Unrealized P&L',
      value: `$${totalProfit.toLocaleString()}`,
      subtitle: `${totalProfitPercentage.toFixed(1)}% return`,
      icon: totalProfit >= 0 ? TrendingUp : TrendingDown,
      color: totalProfit >= 0 ? 'from-green-400 to-emerald-500' : 'from-red-400 to-red-500'
    },
    {
      title: 'Listed Items',
      value: inventory.filter(i => i.status === 'listed').length.toString(),
      subtitle: 'Active listings',
      icon: Eye,
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
                placeholder="Search cards or players..."
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
                <option value="owned">Owned</option>
                <option value="listed">Listed</option>
                <option value="sold">Sold</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                <option value="purchase_date">Purchase Date</option>
                <option value="current_value">Current Value</option>
                <option value="profit_percentage">Profit %</option>
                <option value="player_name">Player Name</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
              >
                <SortAsc className={`w-5 h-5 ${sortOrder === 'desc' ? 'rotate-180' : ''} transition-transform`} />
              </button>
            </div>
          </div>
          
          <button className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>
      </motion.div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedInventory.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                  {item.player_name}
                </h3>
                <p className="text-sm text-slate-400 mb-2">{item.card_name}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${gradeColors[item.grade as keyof typeof gradeColors] || 'bg-gray-500/20 text-gray-400'}`}>
                    {item.grade_company} {item.grade}
                  </span>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Purchase Price</p>
                <p className="text-lg font-bold text-white">${item.purchase_price}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Current Value</p>
                <p className="text-lg font-bold text-white">${item.current_value}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {item.profit_loss >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`font-semibold ${item.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${Math.abs(item.profit_loss)} ({Math.abs(item.profit_percentage).toFixed(1)}%)
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">{item.platform}</p>
                <p className="text-xs text-slate-500">{new Date(item.purchase_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {Math.floor((new Date().getTime() - new Date(item.purchase_date).getTime()) / (1000 * 60 * 60 * 24))} days held
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-slate-400 hover:text-blue-400 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-1 text-slate-400 hover:text-green-400 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAndSortedInventory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No cards found</h3>
          <p className="text-slate-500">Try adjusting your search or filters</p>
        </motion.div>
      )}
    </div>
  )
}