// Chart configuration
export const getChartOptions = (chartType) => ({
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  scales: chartType === 'pie' ? undefined : {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      title: {
        display: true,
        text: 'Units Sold'
      }
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Revenue ($)'
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y2: {
      type: 'linear',
      display: true,
      position: 'right',
      title: {
        display: true,
        text: 'Total Stock'
      },
      grid: {
        drawOnChartArea: false,
      },
    }
  },
  plugins: {
    title: {
      display: true,
      text: chartType === 'pie' ? 'Stock Distribution by Warehouse' : 'Product Sales Overview',
    },
  },
}); 