# CardScout AI - Baseball Card Trading Platform

A production-ready React SPA with Supabase integration for automated baseball card trading, featuring advanced card scanning capabilities.

## Features

### 🎯 Core Functionality
- **Dashboard**: Real-time portfolio tracking with P&L analytics
- **Inventory Management**: Complete card collection tracking
- **Deal Discovery**: Automated market scanning for profitable opportunities
- **Watchlist**: Prospect monitoring with price alerts
- **Analytics**: Advanced performance metrics and insights

### 📱 Card Scanning
- **Webcam Integration**: Live camera feed with capture functionality
- **Image Upload**: Support for existing card photos
- **AI Recognition**: Automated card identification using computer vision
- **Manual Verification**: Editable card details with confidence scoring
- **Inventory Integration**: Direct addition to collection database

### 🔧 Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage for card images
- **Animations**: Framer Motion

## Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- Modern web browser with camera access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cardscout-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_DEMO_MODE=true
   ```

4. **Database Setup**
   Run the included migrations in your Supabase dashboard:
   - `supabase/migrations/20250630195655_little_ocean.sql`
   - `supabase/migrations/20250630195719_broad_mud.sql`
   - `supabase/migrations/add_raw_scans_table.sql`

5. **Deploy Edge Function**
   ```bash
   supabase functions deploy card-scan
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## Card Scanning Setup

### API Integration
The card scanning feature uses a mock implementation for demonstration. To integrate with a real card identification service:

1. **Update the Edge Function** (`supabase/functions/card-scan/index.ts`)
   - Replace mock response with actual API calls
   - Add your API credentials to Supabase secrets
   - Implement proper error handling

2. **Supported Services**
   - Ximilar Card & Comics Identifier API
   - Custom computer vision models
   - Manual data entry fallback

### Camera Permissions
Ensure your browser has camera access permissions enabled for the scanning feature to work properly.

## Database Schema

### Core Tables
- **users**: User accounts and trading preferences
- **inventory**: Card collection with purchase/value tracking
- **watchlist**: Prospect monitoring and price alerts
- **deals**: Automated deal discovery results
- **transactions**: Complete trading history
- **raw_scans**: Card scanning results and metadata

### Security
- Row Level Security (RLS) enabled on all tables
- User-scoped data access policies
- Secure API key management

## API Endpoints

### Edge Functions
- `POST /functions/v1/card-scan`: Card image processing and identification

### Supabase REST API
- Standard CRUD operations for all data tables
- Real-time subscriptions for live updates
- File upload/download for card images

## Performance Targets

- **P95 API Response Time**: < 500ms
- **P95 Page Load Time**: < 2s
- **Accessibility**: WCAG AA compliant
- **Mobile Responsive**: Full feature parity

## Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run test`: Run test suite

### Code Structure
```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── CardScanner.tsx # Card scanning interface
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript definitions
```

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your Git repository
2. Set environment variables
3. Deploy with automatic builds

### Backend (Supabase)
1. Create new project
2. Run database migrations
3. Deploy edge functions
4. Configure storage buckets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create a GitHub issue
- Check the documentation
- Review the demo implementation

---

**Demo Mode**: The application includes sample data and mock API responses for immediate testing without external dependencies.