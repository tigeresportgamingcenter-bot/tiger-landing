export const formatHourlyPrice = (value: number) => `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(value / 1000)}K`;
