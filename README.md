

# Kamel Ride Growth Dashboard
Live Demo: https://kamel-dashboard.vercel.app

## Overview
A dashboard that identifies where to focus efforts to maximize bookings by:

- Analyzing demand by tracking user search behaviour
- Evaluating referral effectiveness by comparing referred vs organic (non-referred) user behavior
- Identifying high-opportunity locations and universities based on demand and conversion patterns
- Visualizing the full funnel from traffic to bookings to support decision-making

The system collects user interactions as events, which serve as the primary source of data for all analytics and dashboard metrics.

## How does it help decision-making?
This dashboard helps identify where to focus efforts to grow traction and improve conversion.

It allows the user to answer:

- Which universities should the company prioritize for expansion based on demand and conversion?
- Where should the company invest resources to maximize bookings?
- Are referrals an effective source of bookings as the company grows? (testing scaling through referrals might be needed in the early stages)
- Where is demand high but conversion is low (shows an opportunity to improve performance)?

## Who is it for?
An operations manager at Kamel Ride responsible for tracking bookings and customer demand to identify growth opportunities and improve revenue.

## Main Goal

### 1 Monitor the System Via Events
- Track website traffic (visitors)
- Monitor search locations and ride views (customer demand)
- Track bookings
- Observe conversion rate (visitors → bookings)

### 2 Track Progress Toward a Goal through events 
- Is traffic increasing over time due to marketing efforts?
- Are more visitors converting into bookings?

## 📈 Traction Metrics
- **Search Volume / Ride Views** → Customer demand  
- **Bookings** → Actual growth  
- **Conversion Rate** → Demand quality  

## Getting Started

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
npm install
npm run dev
```

Then open your browser at `http://localhost:5173`.
