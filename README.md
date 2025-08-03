# GramConnect Lite

A static web application combining Festival Reminders and Local Complaint Tracker for Indian users. Built with Next.js + Tailwind CSS using only client-side logic and localStorage persistence.

## Features

### 🎉 Festival Reminders
- **Static Dataset**: 12+ major Indian festivals (2025-2026) with traditional foods
- **Smart Notifications**: Browser notifications for upcoming festivals
- **Cultural Foods**: 5 traditional food items per festival with descriptions
- **Regional Coverage**: Pan-India and regional festivals
- **Offline Ready**: All data stored locally, works without internet

### 📢 Complaint Tracker
- **Local Complaints**: Submit and track civic issues (Water, Electricity, Sanitation, Road, Garbage)
- **Status Management**: Track complaint lifecycle (Submitted → In Review → Resolved)
- **Image Support**: Upload photos with complaints (stored as base64)
- **Public Feed**: View all community complaints with filtering options
- **Persistent Storage**: All data saved in browser localStorage

### 🔧 Admin Panel
- **Complaint Management**: Update complaint statuses locally
- **Notice System**: Create civic and festival announcements
- **Local Control**: No authentication needed, purely client-side admin

## Technical Stack

- **Frontend**: Next.js 13+ (App Router), React, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Storage**: localStorage with versioning and migration support
- **Icons**: Lucide React
- **Deployment**: Static export ready for any hosting platform

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Export static files
npm run build && npx next export
```

## Project Structure

```
gramconnect-lite/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home dashboard
│   ├── festivals/[id]/    # Festival detail pages
│   ├── complaints/        # Complaint tracker page
│   └── admin/             # Admin panel
├── components/            # Reusable UI components
│   ├── FestivalCard.tsx   # Festival display card
│   ├── FestivalDetail.tsx # Detailed festival view
│   ├── ComplaintForm.tsx  # Complaint submission form
│   ├── ComplaintFeed.tsx  # Public complaints feed
│   ├── FilterControls.tsx # Filtering interface
│   ├── NoticeBanner.tsx   # Admin notices display
│   └── ReminderWidget.tsx # Festival reminders widget
├── lib/                   # Utilities and helpers
│   ├── types.ts          # TypeScript definitions
│   ├── storage.ts        # localStorage abstraction
│   └── utils.ts          # Helper functions
├── data/                  # Static data files
│   └── festivals_2025_2026.json  # Festival database
└── public/               # Static assets
```

## Data Management

### localStorage Schema
All data is stored in browser localStorage under the key `gramconnect_data`:

```json
{
  "complaints": [...],      // User submitted complaints
  "reminders": [...],       // Festival reminder preferences
  "notices": [...],         // Admin created notices
  "version": 1              // Schema version for migrations
}
```

### Festival Data
Static JSON file containing:
- 12+ Indian festivals spanning 2025-2026
- Regional and pan-India celebrations
- 5 traditional foods per festival
- Cultural significance descriptions

## Features Overview

### Home Dashboard
- Upcoming festivals (next 30 days)
- Active festival notices
- Festival reminder widget
- Quick statistics

### Festival Details
- Complete festival information
- Traditional foods with descriptions
- Notification toggle for reminders
- Cultural celebration tips

### Complaint System
- Category-based submissions
- Image upload support
- Status tracking (Submitted/In Review/Resolved)
- Filtering and search capabilities
- Public complaint feed

### Admin Panel
- Complaint status management
- Notice creation and management
- Local data administration
- Usage statistics

## Browser Compatibility

- **Notifications**: Requires modern browsers with Notification API support
- **Storage**: Uses localStorage (available in all modern browsers)
- **Images**: FileReader API for image processing
- **Responsive**: Works on mobile, tablet, and desktop

## Deployment Options

The app exports as static files and can be hosted on:

- **Netlify**: Drag and drop the `out/` folder
- **Vercel**: Connect repository for automatic deployments
- **GitHub Pages**: Upload static files to gh-pages branch
- **Any Static Host**: Upload the built files to any web server

### Build Commands
```bash
npm run build        # Build the application
npx next export      # Export static files to 'out/' directory
```

## Privacy & Data

- **No Backend**: Everything runs in the browser
- **Local Storage**: All data stays on user's device
- **No Analytics**: No tracking or external data collection
- **Offline First**: Works without internet connection
- **Privacy Focused**: User data never leaves their browser

## Customization

### Adding Festivals
Edit `data/festivals_2025_2026.json` to add more festivals:

```json
{
  "id": "new-festival-2025",
  "name": "Festival Name",
  "date": "2025-MM-DD",
  "region_tags": ["Region"],
  "description": "Festival description",
  "foods": [
    {
      "name": "Food Name",
      "short_note": "Food description"
    }
  ]
}
```

### Styling
- Edit `tailwind.config.ts` for theme customization
- Modify `app/globals.css` for global styles
- Component styles use Tailwind classes

### Storage
- Extend `lib/types.ts` for new data structures
- Modify `lib/storage.ts` for new storage methods
- Update version number for schema migrations

## Development

### Local Development
```bash
npm run dev          # Start development server on http://localhost:3000
npm run lint         # Run ESLint
npm run build        # Build for production
```

### Environment
- **Node.js**: 18+ recommended
- **Package Manager**: npm, yarn, or pnpm
- **TypeScript**: Fully typed codebase

## License

MIT License - feel free to use for personal or commercial projects.

## Contributing

This is a static application template. Fork the repository and customize for your needs:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues or questions:
1. Check the existing codebase and comments
2. Review the component documentation
3. Test in different browsers
4. Create an issue with reproduction steps

---

**GramConnect Lite** - Connecting communities through festivals and civic engagement, powered by modern web technologies and local-first architecture.