import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ExternalLink,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Target
} from 'lucide-react'

interface Deal {
  id: string
  card_name: string
  player_name: string
  asking_price: number
  market_value: number
  profit_potential: number
  profit_percentage: number
  platform: string
  url: string
  status: 'pending' | 'purchased' | 'rejected'
  discovered_at: string
  confidence_score: number
  seller_rating: number
  risk_level: 'low' | 'medium' | 'high'
}

const sampleDeals: Deal[] = [
  {
    id: '1',
    card_name: '2021 Topps Chrome Julio Rodriguez RC PSA 10',
    player_name: 'Julio Rodriguez',
    asking_price: 385,
    market_value: 520,
    profit_potential: 135,
    profit_percentage: 35.1,
    platform: 'eBay',
    url: 'https://ebay.com/item/12345',
    status: 'pending',
    discovered_at: '2024-01-15T14:30:00Z',
    confidence_score: 92,
    seller_rating: 4.8,
    risk_level: 'low'
  },
  {
    id: '2',
    card_name: '2020 Bowman Chrome Spencer Torkelson Auto BGS 9.5',
    player_name: 'Spencer Torkelson',
    asking_price: 240,
    market_value: 350,
    profit_potential: 110,
    profit_percentage: 45.8,
    platform: 'COMC',
    url: 'https://comc.com/card/67890',
    status: 'pending',
    discovered_at: '2024-01-15T13:45:00Z',
    confidence_score: 88,
    seller_rating: 4.9,
    risk_level: 'low'
  },
  {
    id: '3',
    card_name: '2019 Bowman Chrome Wander Franco Auto PSA 9',
    player_name: 'Wander Franco',
    asking_price: 180,
    market_value: 220,
    profit_potential: 40,
    profit_percentage: 22.2,
    platform: 'Alt',
    url: 'https://alt.com/card/54321',
    status: 'pending',
    discovered_at: '2024-01-15T12:15:00Z',
    confidence_score: 65,
    seller_rating: 4.2,
    risk_level: 'high'
  },
  {
    id: '4',
    card_name: '2022 Topps Chrome Bobby Witt Jr. RC PSA 10',
    player_name: 'Bobby Witt Jr.',
    asking_price: 95,
    market_value: 135,
    profit_potential: 40,
    profit_percentage: 42.1,
    platform: 'StockX',
    url: 'https://stockx.com/card/98765',
    status: 'purchased',
    discovered_at: '2024-01-15T11:20:00Z',
    confidence_score: 94,
    seller_rating: 5.0,
    risk_level: 'low'
  },
  {
    id: '5',
    card_name: '2021 Bowman Chrome Marcelo Mayer Auto BGS 9',
    player_name: 'Marcelo Mayer',
    asking_price: 320,
    market_value: 280,
    profit_potential: -40,
    profit_percentage: -12.5,
    platform: 'eBay',
    url: 'https://ebay.com/item/11111',
    status: 'rejected',
    discovered_at: '2024-01-15T10:00:00Z',
    confidence_score: 45,
    seller_rating: 3.8,
    risk_level: 'high'
  }
]

const statusColors = {
  pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  purchased: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const riskColors = {
  low: 'bg-green-500/20 text-green-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400'
}

const platformColors = {
  eBay: 'bg-blue-500/20 text-blue-400',
  COMC: 'bg-purple-500/20 text-purple-400',
  Alt: 'bg-pink-500/20 text-pink-400',
  StockX: 'bg-green-500/20 text-green-400'
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>(sampleDeals)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [riskFilter, setRiskFilter] = useState<string>('all')
  const [isScanning, setIsScanning] = useState(false)

  const filteredDeals = deals.filter(deal => {
    const matchesStatus = statusFilter === 'all' || deal.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || deal.platform === platformFilter
    const matchesRisk = riskFilter === 'all' || deal.risk_level === riskFilter
    return matchesStatus && matchesPlatform && matchesRisk
  })

  const stats = [
    {
      title: 'Active Deals',
      value: deals.filter(d => d.status === 'pending').length.toString(),
      subtitle: 'Awaiting decision',
      icon: Clock,
      color: 'from-orange-400 to-yellow-500'
    },
    {
      title: 'Avg Profit Potential',
      value: `${(deals.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.profit_percentage, 0) / deals.filter(d => d.status === 'pending').length || 0).toFixed(1)}%`,
      subtitle: 'Expected return',
      icon: TrendingUp,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Total Opportunity',
      value: `$${deals.filter(d => d.status === 'pending').reduce((sum, d) => sum + d.profit_potential, 0).toLocaleString()}`,
      subtitle: 'Potential profit',
      icon: DollarSign,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Success Rate',
      value: `${((deals.filter(d => d.status === 'purchased').length / deals.filter(d => d.status !== 'pending').length) * 100 || 0).toFixed(1)}%`,
      subtitle: 'Deals executed',
      icon: Target,
      color: 'from-purple-400 to-pink-500'
    }
  ]

  const handleScan = () => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
    }, 3000)
  }

  const handleDecision = (dealId: string, decision: 'purchased' | 'rejected') => {
    setDeals(prev => prev.map(deal => 
      deal.id === dealId ? { ...deal, status: decision } : deal
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
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="purchased">Purchased</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Platforms</option>
              <option value="eBay">eBay</option>
              <option value="COMC">COMC</option>
              <option value="Alt">Alt</option>
              <option value="StockX">StockX</option>
            </select>
            
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
          
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Markets'}</span>
          </button>
        </div>
      </motion.div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDeals.map((deal, index) => (
          <motion.div
            key={deal.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">{deal.player_name}</h3>
                <p className="text-sm text-slate-400 mb-3">{deal.card_name}</p>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[deal.status]}`}>
                    {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${platformColors[deal.platform as keyof typeof platformColors]}`}>
                    {deal.platform}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${riskColors[deal.risk_level]}`}>
                    {deal.risk_level.charAt(0).toUpperCase() + deal.risk_level.slice(1)} Risk
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Confidence</p>
                <p className="text-lg font-bold text-white">{deal.confidence_score}%</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Asking Price</p>
                <p className="text-lg font-bold text-white">${deal.asking_price}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Market Value</p>
                <p className="text-lg font-bold text-white">${deal.market_value}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Profit</p>
                <p className={`text-lg font-bold ${deal.profit_potential >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${Math.abs(deal.profit_potential)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {deal.profit_potential >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                )}
                <span className={`font-semibold ${deal.profit_potential >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(deal.profit_percentage).toFixed(1)}% potential
                </span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Seller Rating</p>
                <p className="text-sm font-medium text-white">{deal.seller_rating}/5.0</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400">
                  {new Date(deal.discovered_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                {deal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleDecision(deal.id, 'purchased')}
                      className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDecision(deal.id, 'rejected')}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDeals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Zap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No deals found</h3>
          <p className="text-slate-500">Try adjusting your filters or scan for new opportunities</p>
        </motion.div>
      )}
    </div>
  )
}