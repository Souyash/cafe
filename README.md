# Aura Artisan Cafe & CRM Platform

A production-grade, mobile-first Web Application and Back-Office CRM for a modern cafe, built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and cryptographic **HMAC-SHA256 Table QR Session Security**.

---

## 🚀 Key Modules & Personas

### 1. Dine-In Guest Ordering (`/order?table=[table_number]&token=[token]`)
- **Anti-Spoof QR Security**: Encodes ephemeral HMAC-SHA256 signatures derived from rotating table salts to prevent remote ordering outside the venue.
- **Categorized Menu**: Brews, Bakery, Mains, and Combos with Veg / Non-Veg / Vegan badges and prep timers.
- **Item Customizer**: Choice of milk (Whole, Oatly, Almond), espresso shots, and special cooking instructions.
- **Real-Time Cart Drawer**: Itemized price calculations, 5% cafe GST, and customer phone capture for loyalty points.
- **Live Order Tracker**: Multi-stage progress indicator (`Order Placed` ➔ `In Kitchen` ➔ `Ready to Serve` ➔ `Delivered`).
- **Digital Receipt & Settlement**: Razorpay, UPI, or Cash payment simulation with instant invoice generation.

### 2. Kitchen Display System - KDS (`/staff/kds`)
- **Kanban Board**: 4 real-time columns (`New Orders` | `In Kitchen` | `Ready to Serve` | `Completed`).
- **Web Audio API Acoustic Chime**: Synthesized dual-tone ping alerts cooks whenever a new order is fired.
- **Urgency Monitors**: Dynamic elapsed time counters with color-coded alerts (>12 mins turns urgent).
- **Custom Notes Highlight**: Critical cooking instructions and dietary preferences flagged prominently.

### 3. Back-Office Cafe CRM & Admin Hub (`/admin/dashboard`)
- **Live Floor Map**: Seating occupancy, zone filters (Indoor Main, Patio, Rooftop, Bar Counter).
- **Dynamic Table QR Generator**: High-resolution SVG/PNG generator with embedded cafe branding, copyable URLs, and single-click token rotation.
- **Menu & 86 Inventory Controls**: Live toggle switches for marking items "In Stock" or "Sold Out (86)".
- **Billing & POS Reconciliation**: Settle open table orders with Cash, Card, or UPI with shift reconciliation.
- **Customer Loyalty CRM**: Phone-number-based ledger tracking points (5% cashback), lifetime spend, and visit frequencies.
- **Sales Analytics**: Gross sales GMV, peak ordering hour capacity distributions, and top 5 bestsellers.

---

## 🛠️ Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser:
# Home & Architecture Gateway: http://localhost:3000
# Dine-in Guest Experience (Table 1): http://localhost:3000/order?table=1
# Kitchen Display System (KDS): http://localhost:3000/staff/kds
# Admin Command Center: http://localhost:3000/admin/dashboard
```

