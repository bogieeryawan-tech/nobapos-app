import type { Branch, CompletedOrder, MenuItem } from '../types';
import { formatRupiah } from '../utils';

export type InsightConfidence = 'high' | 'medium' | 'low';

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: InsightConfidence;
  metric?: string;
}

interface GenerateAIInsightsOptions {
  orders: CompletedOrder[];
  menuItems: MenuItem[];
  branches: Branch[];
  timeframeDays?: number;
  referenceDate?: Date;
}

interface ItemStats {
  item: MenuItem;
  quantity: number;
  revenue: number;
}

const CONFIDENCE_LABELS: Record<InsightConfidence, number> = {
  high: 0.45,
  medium: 0.2,
  low: 0,
};

const determineConfidence = (share: number, minimumOrders: number): InsightConfidence => {
  if (minimumOrders >= 50 && share >= CONFIDENCE_LABELS.high) return 'high';
  if (minimumOrders >= 20 && share >= CONFIDENCE_LABELS.medium) return 'medium';
  return 'low';
};

const buildItemStats = (orders: CompletedOrder[], menuItems: MenuItem[]): Map<number, ItemStats> => {
  const stats = new Map<number, ItemStats>();

  menuItems.forEach(item => {
    stats.set(item.id, {
      item,
      quantity: 0,
      revenue: 0,
    });
  });

  orders.forEach(order => {
    order.items.forEach(orderItem => {
      const existing = stats.get(orderItem.id);
      if (existing) {
        existing.quantity += orderItem.quantity;
        existing.revenue += orderItem.price * orderItem.quantity;
      }
    });
  });

  return stats;
};

const getTimeframeOrders = (orders: CompletedOrder[], timeframeDays: number, referenceDate: Date): CompletedOrder[] => {
  const end = new Date(referenceDate);
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  start.setDate(start.getDate() - (timeframeDays - 1));

  return orders.filter(order => {
    const orderDate = new Date(order.timestamp);
    return orderDate >= start && orderDate <= end;
  });
};

const safePercentageChange = (current: number, previous: number): number | null => {
  if (previous === 0) {
    return current === 0 ? null : 100;
  }
  return ((current - previous) / previous) * 100;
};

export const generateAIInsights = ({
  orders,
  menuItems,
  branches,
  timeframeDays = 30,
  referenceDate = new Date(),
}: GenerateAIInsightsOptions): AIInsight[] => {
  if (orders.length === 0) {
    return [];
  }

  const recentOrders = getTimeframeOrders(orders, timeframeDays, referenceDate);
  if (recentOrders.length === 0) {
    return [];
  }

  const insights: AIInsight[] = [];
  const itemStats = buildItemStats(recentOrders, menuItems);
  const totalItemsSold = Array.from(itemStats.values()).reduce((acc, stat) => acc + stat.quantity, 0);

  // Top performing item insight
  const sortedByQuantity = Array.from(itemStats.values())
    .filter(stat => stat.quantity > 0)
    .sort((a, b) => b.quantity - a.quantity);

  if (sortedByQuantity.length > 0) {
    const topItem = sortedByQuantity[0];
    const share = totalItemsSold > 0 ? topItem.quantity / totalItemsSold : 0;
    const confidence = determineConfidence(share, recentOrders.length);
    insights.push({
      id: 'top-item',
      title: `Menu Terlaris: ${topItem.item.name}`,
      description: `Dalam ${timeframeDays} hari terakhir, ${topItem.item.name} terjual ${topItem.quantity} porsi dan menyumbang ${formatRupiah(topItem.revenue)}. Pertimbangkan untuk menonjolkan menu ini di promosi atau bundling paket premium.`,
      confidence,
      metric: `${topItem.quantity} terjual • ${formatRupiah(topItem.revenue)}`,
    });
  }

  // Underperforming item insight
  const unsoldItems = Array.from(itemStats.values()).filter(stat => stat.quantity === 0);
  const lowPerformer = unsoldItems.length > 0
    ? unsoldItems[0]
    : sortedByQuantity[sortedByQuantity.length - 1];

  if (lowPerformer) {
    const share = totalItemsSold > 0 ? lowPerformer.quantity / totalItemsSold : 0;
    const confidence = determineConfidence(Math.max(share, 0.05), recentOrders.length);
    const message = lowPerformer.quantity === 0
      ? `${lowPerformer.item.name} belum terjual sama sekali. Coba evaluasi posisi menu, foto, atau tawarkan diskon flash sale.`
      : `${lowPerformer.item.name} hanya terjual ${lowPerformer.quantity} porsi. Pertimbangkan untuk membuat promo bundling atau mengganti resep agar lebih menarik.`;

    insights.push({
      id: 'underperforming-item',
      title: 'Menu Perlu Perhatian',
      description: message,
      confidence,
      metric: lowPerformer.quantity === 0 ? '0 penjualan' : `${lowPerformer.quantity} terjual`,
    });
  }

  // Branch performance insight
  if (branches.length > 1) {
    const branchTotals = branches.map(branch => {
      const branchOrders = recentOrders.filter(order => order.branchId === branch.id);
      const branchRevenue = branchOrders.reduce((sum, order) => sum + order.total, 0);
      return {
        branch,
        orders: branchOrders.length,
        revenue: branchRevenue,
      };
    });

    const activeBranches = branchTotals.filter(b => b.orders > 0);
    if (activeBranches.length > 0) {
      const bestBranch = [...activeBranches].sort((a, b) => b.revenue - a.revenue)[0];
      const weakestBranch = [...activeBranches].sort((a, b) => a.revenue - b.revenue)[0];
      const confidence = determineConfidence(
        bestBranch.revenue / activeBranches.reduce((sum, b) => sum + b.revenue, 0),
        recentOrders.length,
      );

      if (bestBranch.branch.id !== weakestBranch.branch.id) {
        insights.push({
          id: 'branch-performance',
          title: 'Performa Cabang',
          description: `${bestBranch.branch.name} memimpin dengan omzet ${formatRupiah(bestBranch.revenue)} dari ${bestBranch.orders} transaksi. ${weakestBranch.branch.name} tertinggal dengan ${formatRupiah(weakestBranch.revenue)}. Pertimbangkan untuk menyalin strategi cabang terbaik ke cabang lain.`,
          confidence,
          metric: `${bestBranch.branch.name} vs ${weakestBranch.branch.name}`,
        });
      }
    }
  }

  // Sales momentum insight (last 7 vs previous 7 days)
  const last7DaysOrders = getTimeframeOrders(orders, 7, referenceDate);
  const previousWindowReference = new Date(referenceDate);
  previousWindowReference.setDate(previousWindowReference.getDate() - 7);
  const previous7DaysOrders = getTimeframeOrders(orders, 7, previousWindowReference);

  const last7Revenue = last7DaysOrders.reduce((sum, order) => sum + order.total, 0);
  const prev7Revenue = previous7DaysOrders.reduce((sum, order) => sum + order.total, 0);
  const momentum = safePercentageChange(last7Revenue, prev7Revenue);

  if (momentum !== null) {
    const trend = momentum >= 0 ? 'naik' : 'turun';
    const confidence: InsightConfidence = Math.abs(momentum) > 15 ? 'high' : Math.abs(momentum) > 5 ? 'medium' : 'low';
    insights.push({
      id: 'sales-momentum',
      title: 'Momentum Penjualan 7 Hari Terakhir',
      description: `Pendapatan ${trend} ${momentum.toFixed(1)}% dibandingkan 7 hari sebelumnya. ${momentum >= 0 ? 'Pertahankan strategi promosi yang berjalan.' : 'Periksa stok, pelayanan, atau cuaca yang mungkin mempengaruhi penjualan.'}`,
      confidence,
      metric: `${formatRupiah(last7Revenue)} vs ${formatRupiah(prev7Revenue)}`,
    });
  }

  // Busiest hour insight
  const hours = new Array(24).fill(0);
  recentOrders.forEach(order => {
    const orderDate = new Date(order.timestamp);
    hours[orderDate.getHours()] += 1;
  });

  const busiestHourIndex = hours.reduce((maxIndex, count, index, arr) => (count > arr[maxIndex] ? index : maxIndex), 0);
  const busiestHourCount = hours[busiestHourIndex];

  if (busiestHourCount > 0) {
    const startHour = busiestHourIndex.toString().padStart(2, '0');
    const endHour = ((busiestHourIndex + 1) % 24).toString().padStart(2, '0');
    const confidence = busiestHourCount / recentOrders.length >= 0.2 ? 'high' : busiestHourCount / recentOrders.length >= 0.1 ? 'medium' : 'low';

    insights.push({
      id: 'busiest-hour',
      title: 'Jam Tersibuk',
      description: `Transaksi terbanyak terjadi pukul ${startHour}.00 - ${endHour}.00 dengan ${busiestHourCount} pesanan. Pastikan stok dan kru siap di jam ini.`,
      confidence,
      metric: `${busiestHourCount} pesanan`,
    });
  }

  return insights;
};
