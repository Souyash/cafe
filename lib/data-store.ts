import { generateSignedTableToken } from "./qr-crypto";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Brews" | "Bakery" | "Mains" | "Combos";
  dietary: "VEG" | "NON_VEG" | "VEGAN";
  isAvailable: boolean;
  prepTime: number; // minutes
  imageUrl: string;
  addonGroups?: {
    id: string;
    name: string;
    type: "single" | "multiple";
    options: { id: string; name: string; price: number; isDefault?: boolean }[];
  }[];
}

export interface CafeTable {
  id: string;
  number: number;
  label: string;
  zone: "Indoor Main" | "Patio" | "Rooftop" | "Bar Counter";
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "BILL_REQUESTED";
  secretSalt: string;
}

export interface SelectedAddon {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  addons?: SelectedAddon[];
  notes?: string;
}

export type OrderStatus = "PLACED" | "IN_KITCHEN" | "READY_TO_SERVE" | "SERVED" | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: number;
  tableNumber: number;
  tableId: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  paymentMethod?: "RAZORPAY" | "UPI" | "CASH" | "CARD";
  items: OrderItem[];
  subtotal: number;
  gst: number;
  discount: number;
  total: number;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  phone: string;
  name: string;
  loyaltyPoints: number;
  totalSpent: number;
  visitsCount: number;
  lastVisit: string;
}

export interface BillInvoice {
  invoiceNumber: string;
  orderId: string;
  tableNumber: number;
  customerName?: string;
  customerPhone?: string;
  subtotal: number;
  gst: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentRefId?: string;
  paidAt: string;
  items: OrderItem[];
}

// Initial Menu
const INITIAL_MENU: MenuItem[] = [
  {
    id: "brew-1",
    name: "Artisanal Flat White",
    description: "Double espresso ristretto extraction with silky steamed micro-foam.",
    price: 240,
    category: "Brews",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "milk",
        name: "Choice of Milk",
        type: "single",
        options: [
          { id: "milk-whole", name: "Whole Dairy Milk", price: 0, isDefault: true },
          { id: "milk-oat", name: "Oatly Barista Edition", price: 45 },
          { id: "milk-almond", name: "Roasted Almond Milk", price: 45 },
        ],
      },
      {
        id: "shot",
        name: "Espresso Shots",
        type: "single",
        options: [
          { id: "shot-reg", name: "Standard Double Shot", price: 0, isDefault: true },
          { id: "shot-extra", name: "Extra Espresso Shot", price: 50 },
        ],
      },
    ],
  },
  {
    id: "brew-2",
    name: "Ethiopian Yirgacheffe Pour-Over",
    description: "Single-origin pour-over with jasmine floral aroma, peach & citrus notes.",
    price: 290,
    category: "Brews",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 8,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brew-3",
    name: "Valencia Orange Cold Brew",
    description: "18-hour slow steeped dark roast poured over sparkling tonic and fresh orange wheel.",
    price: 270,
    category: "Brews",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brew-4",
    name: "Kyoto Ceremonial Matcha Latte",
    description: "Stone-ground Uji matcha whisked with Madagascar vanilla and choice of milk.",
    price: 310,
    category: "Brews",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 6,
    imageUrl: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "milk-matcha",
        name: "Choice of Milk",
        type: "single",
        options: [
          { id: "m-dairy", name: "Standard Whole Milk", price: 0, isDefault: true },
          { id: "m-oat", name: "Oatly Barista", price: 45 },
        ],
      },
    ],
  },
  {
    id: "bakery-1",
    name: "Classic French Butter Croissant",
    description: "Hand-laminated flaky 32-layer Normandy butter pastry baked golden brown.",
    price: 180,
    category: "Bakery",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bakery-2",
    name: "Belgian Dark Chocolate Pain au Chocolat",
    description: "Layered sourdough viennoiserie stuffed with 70% Callebaut dark chocolate batons.",
    price: 220,
    category: "Bakery",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 3,
    imageUrl: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "bakery-3",
    name: "Burnt Basque Cheesecake Slice",
    description: "Caramelized crust with an ultra-creamy, molten vanilla bean custard center.",
    price: 320,
    category: "Bakery",
    dietary: "CONTAINS_EGG" as unknown as "VEG",
    isAvailable: true,
    prepTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "main-1",
    name: "Truffled Sourdough Avocado Toast",
    description: "Crushed Hass avocado on toasted levain sourdough, marinated heirloom tomatoes, feta & truffle drizzle.",
    price: 380,
    category: "Mains",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "eggs",
        name: "Add-ons",
        type: "single",
        options: [
          { id: "egg-poached", name: "Organic Poached Egg (+₹50)", price: 50 },
          { id: "extra-feta", name: "Extra Crumbled Feta (+₹40)", price: 40 },
        ],
      },
    ],
  },
  {
    id: "main-2",
    name: "Crispy Katsu Chicken Sando",
    description: "Panko-crusted chicken fillet with Japanese sesame cabbage slaw, tonkatsu glaze in fluffy milk bread.",
    price: 440,
    category: "Mains",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "main-3",
    name: "Wild Mushroom & Truffle Melt",
    description: "Portobello and shiitake mushrooms sautéed in thyme butter with Gruyere cheese on toasted brioche.",
    price: 410,
    category: "Mains",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "combo-1",
    name: "The Parisian Morning Combo",
    description: "Flaky Normandy Croissant paired with your choice of Artisanal Flat White or Cappuccino.",
    price: 360,
    category: "Combos",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "combo-2",
    name: "Artisan Power Lunch",
    description: "Truffled Avocado Toast or Katsu Sando + Sparkling Orange Cold Brew with sea salt potato crisps.",
    price: 580,
    category: "Combos",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
  },
];

// Initial Tables - Exactly 7 Physical Tables
const INITIAL_TABLES: CafeTable[] = [
  { id: "tbl-1", number: 1, label: "Table 1", zone: "Indoor Main", capacity: 2, status: "OCCUPIED", secretSalt: "salt_tbl_1_2026" },
  { id: "tbl-2", number: 2, label: "Table 2", zone: "Indoor Main", capacity: 4, status: "OCCUPIED", secretSalt: "salt_tbl_2_2026" },
  { id: "tbl-3", number: 3, label: "Table 3", zone: "Indoor Main", capacity: 4, status: "AVAILABLE", secretSalt: "salt_tbl_3_2026" },
  { id: "tbl-4", number: 4, label: "Table 4", zone: "Indoor Main", capacity: 6, status: "AVAILABLE", secretSalt: "salt_tbl_4_2026" },
  { id: "tbl-5", number: 5, label: "Table 5", zone: "Patio", capacity: 2, status: "OCCUPIED", secretSalt: "salt_tbl_5_2026" },
  { id: "tbl-6", number: 6, label: "Table 6", zone: "Patio", capacity: 4, status: "AVAILABLE", secretSalt: "salt_tbl_6_2026" },
  { id: "tbl-7", number: 7, label: "Table 7", zone: "Rooftop", capacity: 4, status: "BILL_REQUESTED", secretSalt: "salt_tbl_7_2026" },
];

// Initial Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: 101,
    tableNumber: 1,
    tableId: "tbl-1",
    customerName: "Aarav Sharma",
    customerPhone: "9876543210",
    status: "PLACED",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-1",
        menuItemId: "brew-1",
        name: "Artisanal Flat White",
        price: 285,
        quantity: 2,
        addons: [{ id: "milk-oat", name: "Oatly Barista Edition", price: 45 }],
        notes: "Extra hot please",
      },
      {
        id: "item-2",
        menuItemId: "bakery-1",
        name: "Classic French Butter Croissant",
        price: 180,
        quantity: 1,
      },
    ],
    subtotal: 750,
    gst: 37.5,
    discount: 0,
    total: 787.5,
    specialInstructions: "Please serve croissant warm with salted butter",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-102",
    orderNumber: 102,
    tableNumber: 2,
    tableId: "tbl-2",
    customerName: "Priya Patel",
    customerPhone: "9812345678",
    status: "IN_KITCHEN",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-3",
        menuItemId: "main-1",
        name: "Truffled Sourdough Avocado Toast",
        price: 430,
        quantity: 1,
        addons: [{ id: "egg-poached", name: "Organic Poached Egg", price: 50 }],
      },
      {
        id: "item-4",
        menuItemId: "brew-3",
        name: "Valencia Orange Cold Brew",
        price: 270,
        quantity: 1,
      },
    ],
    subtotal: 700,
    gst: 35,
    discount: 0,
    total: 735,
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-103",
    orderNumber: 103,
    tableNumber: 5,
    tableId: "tbl-5",
    customerName: "Rohan Varma",
    customerPhone: "9988776655",
    status: "READY_TO_SERVE",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-5",
        menuItemId: "main-2",
        name: "Crispy Katsu Chicken Sando",
        price: 440,
        quantity: 1,
      },
      {
        id: "item-6",
        menuItemId: "brew-4",
        name: "Kyoto Ceremonial Matcha Latte",
        price: 310,
        quantity: 1,
      },
    ],
    subtotal: 750,
    gst: 37.5,
    discount: 0,
    total: 787.5,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-104",
    orderNumber: 104,
    tableNumber: 7,
    tableId: "tbl-7",
    customerName: "Ananya Deshmukh",
    customerPhone: "9123456789",
    status: "SERVED",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-7",
        menuItemId: "combo-1",
        name: "The Parisian Morning Combo",
        price: 360,
        quantity: 2,
      },
    ],
    subtotal: 720,
    gst: 36,
    discount: 50,
    total: 706,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// Initial Customers / Loyalty
const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-1", phone: "9876543210", name: "Aarav Sharma", loyaltyPoints: 420, totalSpent: 8450, visitsCount: 11, lastVisit: "Today" },
  { id: "cust-2", phone: "9812345678", name: "Priya Patel", loyaltyPoints: 280, totalSpent: 5200, visitsCount: 6, lastVisit: "Today" },
  { id: "cust-3", phone: "9988776655", name: "Rohan Varma", loyaltyPoints: 650, totalSpent: 13900, visitsCount: 18, lastVisit: "Today" },
  { id: "cust-4", phone: "9123456789", name: "Ananya Deshmukh", loyaltyPoints: 190, totalSpent: 3800, visitsCount: 4, lastVisit: "Today" },
  { id: "cust-5", phone: "9820011223", name: "Vikram Malhotra", loyaltyPoints: 940, totalSpent: 22400, visitsCount: 29, lastVisit: "Yesterday" },
];

// In-Memory Global Store for Live Session
class CafeStore {
  menu: MenuItem[] = [...INITIAL_MENU];
  tables: CafeTable[] = [...INITIAL_TABLES];
  orders: Order[] = [...INITIAL_ORDERS];
  customers: Customer[] = [...INITIAL_CUSTOMERS];
  bills: BillInvoice[] = [];
  nextOrderNum = 105;

  getTableByNumber(tableNumber: number): CafeTable | undefined {
    return this.tables.find((t) => t.number === tableNumber);
  }

  getTableToken(tableNumber: number): string {
    const table = this.getTableByNumber(tableNumber);
    if (!table) return "";
    return generateSignedTableToken(table.id, table.number, table.secretSalt, 12);
  }

  rotateTableToken(tableNumber: number): string {
    const table = this.getTableByNumber(tableNumber);
    if (!table) return "";
    table.secretSalt = `salt_${table.number}_${Date.now()}`;
    return this.getTableToken(tableNumber);
  }

  addOrder(order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">): Order {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      orderNumber: this.nextOrderNum++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);

    // Update table status to OCCUPIED
    const table = this.tables.find((t) => t.number === order.tableNumber);
    if (table) {
      table.status = "OCCUPIED";
    }

    // Update customer loyalty if phone provided
    if (order.customerPhone) {
      let cust = this.customers.find((c) => c.phone === order.customerPhone);
      const earnedPoints = Math.floor(order.total * 0.05); // 5% points
      if (cust) {
        cust.loyaltyPoints += earnedPoints;
        cust.totalSpent += order.total;
        cust.visitsCount += 1;
        cust.lastVisit = "Just now";
        if (order.customerName) cust.name = order.customerName;
      } else {
        cust = {
          id: `cust-${Date.now()}`,
          phone: order.customerPhone,
          name: order.customerName || "Cafe Patron",
          loyaltyPoints: earnedPoints,
          totalSpent: order.total,
          visitsCount: 1,
          lastVisit: "Just now",
        };
        this.customers.push(cust);
      }
    }

    return newOrder;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order | undefined {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return undefined;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    if (status === "SERVED") {
      const table = this.tables.find((t) => t.number === order.tableNumber);
      if (table) table.status = "OCCUPIED";
    }
    return order;
  }

  toggleMenuItemStock(itemId: string): MenuItem | undefined {
    const item = this.menu.find((m) => m.id === itemId);
    if (item) {
      item.isAvailable = !item.isAvailable;
    }
    return item;
  }

  settleBill(params: {
    orderId: string;
    tableNumber: number;
    paymentMethod: "RAZORPAY" | "UPI" | "CASH" | "CARD";
    paymentRefId?: string;
  }): BillInvoice | undefined {
    const order = this.orders.find((o) => o.id === params.orderId);
    if (!order) return undefined;

    order.paymentStatus = "PAID";
    order.paymentMethod = params.paymentMethod;

    const invoice: BillInvoice = {
      invoiceNumber: `INV-${new Date().getFullYear()}-${order.orderNumber.toString().padStart(4, "0")}`,
      orderId: order.id,
      tableNumber: order.tableNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      subtotal: order.subtotal,
      gst: order.gst,
      discount: order.discount,
      grandTotal: order.total,
      paymentMethod: params.paymentMethod,
      paymentRefId: params.paymentRefId || `TXN_${Date.now().toString().slice(-8)}`,
      paidAt: new Date().toISOString(),
      items: order.items,
    };

    this.bills.push(invoice);

    // Free up table or mark available
    const table = this.tables.find((t) => t.number === params.tableNumber);
    if (table) {
      table.status = "AVAILABLE";
    }

    return invoice;
  }
}

// Global singleton across serverless invocations in dev
const globalForCafe = global as unknown as { cafeStore: CafeStore };
export const cafeStore = globalForCafe.cafeStore || new CafeStore();
if (process.env.NODE_ENV !== "production") globalForCafe.cafeStore = cafeStore;

