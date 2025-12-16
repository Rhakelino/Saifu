import {
    Utensils, Bus, ShoppingBag, Film, Zap, Stethoscope,
    GraduationCap, Home, Repeat, MoreHorizontal, Banknote, Briefcase,
    TrendingUp, Gift, Receipt, PlusCircle, Gamepad2, Dumbbell,
    Dog, Baby, Coffee, Beer, Plane, Umbrella, Sparkles,
    Shirt, Smartphone, Wrench, PiggyBank, Landmark, DollarSign,
    Store, CreditCard, Bitcoin, Wallet, LayoutGrid, Settings, Tag
} from 'lucide-react';

export const iconMap = {
    // Categories
    'restaurant': Utensils,
    'commute': Bus,
    'shopping_bag': ShoppingBag,
    'movie': Film,
    'bolt': Zap,
    'medical_services': Stethoscope,
    'school': GraduationCap,
    'home': Home,
    'subscriptions': Repeat,
    'more_horiz': MoreHorizontal,
    'payments': Banknote,
    'work': Briefcase,
    'trending_up': TrendingUp,
    'redeem': Gift,
    'receipt_long': Receipt,
    'add_circle': PlusCircle,
    'sports_esports': Gamepad2,
    'fitness_center': Dumbbell,
    'pets': Dog,
    'child_care': Baby,
    'local_cafe': Coffee,
    'local_bar': Beer,
    'flight': Plane,
    'beach_access': Umbrella,
    'spa': Sparkles,
    'checkroom': Shirt,
    'devices': Smartphone,
    'build': Wrench,
    'savings': PiggyBank,
    'account_balance': Landmark,
    'attach_money': DollarSign,
    'card_giftcard': Gift,
    'store': Store,

    // Wallets
    'credit_card': CreditCard,
    'currency_bitcoin': Bitcoin,
    'wallet': Wallet,
    'category': LayoutGrid, // Default category
    'settings': Settings,
    'tag': Tag,
};

// Helper to get icon component, fallback to Tag or other default
export const getIcon = (name) => {
    return iconMap[name] || Tag;
};
