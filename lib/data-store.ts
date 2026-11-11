import { generateSignedTableToken } from "./qr-crypto";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Indian" | "Tandoor" | "Chinese" | "Continental" | "Brews";
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
  zone: "Bamboo Cottage" | "Garden Patio" | "Fairy Pavilion";
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

// Initial Menu featuring Indian, Tandoor, Chinese, Continental & Cafe Brews
const INITIAL_MENU: MenuItem[] = [
  {
    id: "ind-1",
    name: "Royal Saffron Chicken Biryani",
    description: "Long-grain basmati slow-cooked in dum with aromatic saffron, fried onions & raita.",
    price: 320,
    category: "Indian",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "biryani-addon",
        name: "Accompaniments",
        type: "single",
        options: [
          { id: "raita-std", name: "Mint Boondi Raita", price: 0, isDefault: true },
          { id: "extra-egg", name: "Add Masala Boiled Egg", price: 35 },
          { id: "extra-kebab", name: "Add 2pc Chicken Tikka", price: 110 },
        ],
      },
    ],
  },
  {
    id: "ind-2",
    name: "Paneer Butter Masala & Garlic Naan",
    description: "Velvety tomato-cashew makhani gravy with char-grilled malai paneer and 2 butter naans.",
    price: 290,
    category: "Indian",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "tan-1",
    name: "Smoky Charcoal Chicken Tikka Kebab",
    description: "Tender morsels marinated overnight in hung curd, Kashmiri chili & roasted cumin over charcoal.",
    price: 340,
    category: "Tandoor",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 16,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "spice-lvl",
        name: "Spice Level",
        type: "single",
        options: [
          { id: "sp-mild", name: "Mild & Smoky", price: 0 },
          { id: "sp-med", name: "Classic Medium", price: 0, isDefault: true },
          { id: "sp-hot", name: "Fiery Desi Tadka", price: 0 },
        ],
      },
    ],
  },
  {
    id: "tan-2",
    name: "Tandoori Malai Broccoli & Paneer Platter",
    description: "Creamy cardamom-marinated paneer & florets blistered in the clay tandoor with mint chutney.",
    price: 280,
    category: "Tandoor",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chi-1",
    name: "Kolkata Street Hakka Noodles & Chilli Chicken",
    description: "Wok-tossed smoky noodles paired with crispy garlic-soy chilli chicken & spring onions.",
    price: 295,
    category: "Chinese",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "chi-2",
    name: "Crispy Honey Chilli Lotus Stem & Fried Rice",
    description: "Golden glazed lotus stems tossed with roasted sesame, served over burnt garlic veg fried rice.",
    price: 260,
    category: "Chinese",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 12,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "con-1",
    name: "Creamy Alfredo Olive & Mushroom Penne",
    description: "Al-dante penne folded in aged parmesan garlic cream sauce with black olives & herb garlic bread.",
    price: 310,
    category: "Continental",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 14,
    imageUrl: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "pasta-top",
        name: "Add-ons",
        type: "single",
        options: [
          { id: "p-veg", name: "Standard Herb Veg", price: 0, isDefault: true },
          { id: "p-chk", name: "Add Herb Grilled Chicken", price: 80 },
          { id: "p-chs", name: "Extra Baked Mozzarella", price: 55 },
        ],
      },
    ],
  },
  {
    id: "con-2",
    name: "Herb-Crusted Chicken Steak & Mash",
    description: "Pan-seared rosemary chicken breast with truffle mashed potatoes, sautéed greens & pepper jus.",
    price: 390,
    category: "Continental",
    dietary: "NON_VEG",
    isAvailable: true,
    prepTime: 18,
    imageUrl: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brew-1",
    name: "Swade Signature Cold Coffee & Gelato",
    description: "Double espresso shaken with velvety cream and topped with a scoop of Belgian vanilla.",
    price: 190,
    category: "Brews",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    addonGroups: [
      {
        id: "milk",
        name: "Choice of Milk",
        type: "single",
        options: [
          { id: "milk-whole", name: "Classic Dairy Cream", price: 0, isDefault: true },
          { id: "milk-oat", name: "Oat Milk Upgrade", price: 45 },
        ],
      },
      {
        id: "shot",
        name: "Espresso Boost",
        type: "single",
        options: [
          { id: "shot-reg", name: "Standard Roast", price: 0, isDefault: true },
          { id: "shot-extra", name: "Extra Espresso Shot", price: 45 },
        ],
      },
    ],
  },
  {
    id: "brew-2",
    name: "Mango Mint Garden Cooler",
    description: "Chilled Alphonso mango fizz muddled with fresh garden mint and lime zest.",
    price: 150,
    category: "Brews",
    dietary: "VEGAN",
    isAvailable: true,
    prepTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "brew-3",
    name: "Artisanal Hazelnut Cappuccino",
    description: "100% Arabica espresso shot poured with roasted hazelnut syrup and silky micro-foam.",
    price: 175,
    category: "Brews",
    dietary: "VEG",
    isAvailable: true,
    prepTime: 5,
    imageUrl: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80",
  },
];

// Initial Tables - Exactly 7 Physical Bamboo Cottage & Garden Tables
const INITIAL_TABLES: CafeTable[] = [
  { id: "tbl-1", number: 1, label: "Cottage Table 1", zone: "Bamboo Cottage", capacity: 2, status: "OCCUPIED", secretSalt: "salt_tbl_1_2026" },
  { id: "tbl-2", number: 2, label: "Cottage Table 2", zone: "Bamboo Cottage", capacity: 4, status: "OCCUPIED", secretSalt: "salt_tbl_2_2026" },
  { id: "tbl-3", number: 3, label: "Cottage Table 3", zone: "Bamboo Cottage", capacity: 4, status: "AVAILABLE", secretSalt: "salt_tbl_3_2026" },
  { id: "tbl-4", number: 4, label: "Cottage Table 4", zone: "Bamboo Cottage", capacity: 6, status: "AVAILABLE", secretSalt: "salt_tbl_4_2026" },
  { id: "tbl-5", number: 5, label: "Garden Table 5", zone: "Garden Patio", capacity: 2, status: "OCCUPIED", secretSalt: "salt_tbl_5_2026" },
  { id: "tbl-6", number: 6, label: "Garden Table 6", zone: "Garden Patio", capacity: 4, status: "AVAILABLE", secretSalt: "salt_tbl_6_2026" },
  { id: "tbl-7", number: 7, label: "Pavilion Table 7", zone: "Fairy Pavilion", capacity: 6, status: "BILL_REQUESTED", secretSalt: "salt_tbl_7_2026" },
];

// Initial Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: 101,
    tableNumber: 1,
    tableId: "tbl-1",
    customerName: "Souvik Chatterjee",
    customerPhone: "9876543210",
    status: "PLACED",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-1",
        menuItemId: "brew-1",
        name: "Swade Signature Cold Coffee & Gelato",
        price: 235,
        quantity: 2,
        addons: [{ id: "shot-extra", name: "Extra Espresso Shot", price: 45 }],
        notes: "Serve extra chilled",
      },
      {
        id: "item-2",
        menuItemId: "tan-1",
        name: "Smoky Charcoal Chicken Tikka Kebab",
        price: 340,
        quantity: 1,
      },
    ],
    subtotal: 810,
    gst: 40.5,
    discount: 0,
    total: 850.5,
    specialInstructions: "Extra mint chutney on the side",
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-102",
    orderNumber: 102,
    tableNumber: 2,
    tableId: "tbl-2",
    customerName: "Riya Banerjee",
    customerPhone: "9812345678",
    status: "IN_KITCHEN",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-3",
        menuItemId: "chi-1",
        name: "Kolkata Street Hakka Noodles & Chilli Chicken",
        price: 295,
        quantity: 1,
      },
      {
        id: "item-4",
        menuItemId: "brew-2",
        name: "Mango Mint Garden Cooler",
        price: 150,
        quantity: 2,
      },
    ],
    subtotal: 595,
    gst: 29.75,
    discount: 0,
    total: 624.75,
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-103",
    orderNumber: 103,
    tableNumber: 5,
    tableId: "tbl-5",
    customerName: "Arjun Mukherjee",
    customerPhone: "9988776655",
    status: "READY_TO_SERVE",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-5",
        menuItemId: "con-1",
        name: "Creamy Alfredo Olive & Mushroom Penne",
        price: 310,
        quantity: 1,
      },
      {
        id: "item-6",
        menuItemId: "brew-3",
        name: "Artisanal Hazelnut Cappuccino",
        price: 175,
        quantity: 1,
      },
    ],
    subtotal: 485,
    gst: 24.25,
    discount: 0,
    total: 509.25,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "ord-104",
    orderNumber: 104,
    tableNumber: 7,
    tableId: "tbl-7",
    customerName: "Ananya Sen",
    customerPhone: "9123456789",
    status: "SERVED",
    paymentStatus: "PENDING",
    items: [
      {
        id: "item-7",
        menuItemId: "ind-1",
        name: "Royal Saffron Chicken Biryani",
        price: 320,
        quantity: 2,
      },
    ],
    subtotal: 640,
    gst: 32,
    discount: 50,
    total: 622,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
];

// Initial Customers / Loyalty
const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-1", phone: "9876543210", name: "Souvik Chatterjee", loyaltyPoints: 420, totalSpent: 8450, visitsCount: 11, lastVisit: "Today" },
  { id: "cust-2", phone: "9812345678", name: "Riya Banerjee", loyaltyPoints: 280, totalSpent: 5200, visitsCount: 6, lastVisit: "Today" },
  { id: "cust-3", phone: "9988776655", name: "Arjun Mukherjee", loyaltyPoints: 650, totalSpent: 13900, visitsCount: 18, lastVisit: "Today" },
  { id: "cust-4", phone: "9123456789", name: "Ananya Sen", loyaltyPoints: 190, totalSpent: 3800, visitsCount: 4, lastVisit: "Today" },
  { id: "cust-5", phone: "9820011223", name: "Debashis Roy", loyaltyPoints: 940, totalSpent: 22400, visitsCount: 29, lastVisit: "Yesterday" },
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

    const table = this.tables.find((t) => t.number === order.tableNumber);
    if (table) {
      table.status = "OCCUPIED";
    }

    if (order.customerPhone) {
      let cust = this.customers.find((c) => c.phone === order.customerPhone);
      const earnedPoints = Math.floor(order.total * 0.05);
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
          name: order.customerName || "Swade Patron",
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

    const table = this.tables.find((t) => t.number === params.tableNumber);
    if (table) {
      table.status = "AVAILABLE";
    }

    return invoice;
  }
}

const globalForCafe = global as unknown as { cafeStore: CafeStore };
export const cafeStore = globalForCafe.cafeStore || new CafeStore();
if (process.env.NODE_ENV !== "production") globalForCafe.cafeStore = cafeStore;
