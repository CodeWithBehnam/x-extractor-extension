# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-15

### Added
- **Mass Extraction**: Extract up to 1000 posts in a single session (increased from 100)
- **Analytics Dashboard**: 
  - Time of Day chart showing 24-hour posting patterns
  - Day of Week chart showing weekly distribution
  - Peak time detection for hours and days
  - Date range filtering (7/30/90 days, All Time)
  - Interactive tooltips with counts and percentages
- **Anti-Detection Features**:
  - Human-like scrolling with random delays (500-2000ms)
  - Scroll randomization with jitter (200-500px)
  - Smooth scrolling with easing functions
  - Exponential backoff for rate limit errors (429/403)
  - Request throttling (1000-3000ms between posts)
  - Strategic pauses every 50 posts
  - Viewport-based scroll simulation
- **Data Export**: CSV export with complete metadata and ISO 8601 timestamps
- **UI/UX**:
  - Neobrutalism design system
  - Responsive layout for all screen sizes
  - Real-time progress tracking
  - Collapsible analytics section
  - Peak time summary cards
- **Testing**: Comprehensive test suite with 48+ tests
- **Documentation**:
  - Complete README with badges and screenshots
  - Contributing guidelines
  - Installation guide
  - Analytics implementation details

### Changed
- Extended extraction timeout from 5 minutes to 30 minutes
- Increased maximum attempts multiplier from 2x to 3x
- Updated UI labels to reflect 1-1000 post range

### Technical
- Built with React 18.2.0
- Chart.js 4.4.8 for analytics visualizations
- Vite 5.0.0 for build tooling
- Vitest 1.0.0 for testing
- Chrome Manifest V3 compliance
- Bundle size: 590KB (142KB gzipped)

### Dependencies
- Added `chart.js@^4.4.8`
- Added `react-chartjs-2@^5.3.0`
- Updated all dependencies to latest compatible versions

## [Unreleased]

### Planned
- Export to JSON and PDF formats
- Heatmap visualization (hour × day grid)
- Advanced filtering by engagement metrics
- Sentiment analysis integration
- Scheduling and automation features
- Firefox and Safari support

---

[1.0.0]: https://github.com/behnamebrahimi/x-extractor-extension/releases/tag/v1.0.0
