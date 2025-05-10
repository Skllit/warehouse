// Dummy data for testing
export const dummyData = {
  '68120614ddca770a6579a14a': { // Branch 1
    summary: {
      totalSales: 25000,
      totalOrders: 150,
      averageOrderValue: 166.67,
      totalBranches: 3,
      uniqueProducts: 8
    },
    products: [
      {
        _id: '1',
        name: 'Running Shoes',
        quantity: 45,
        revenue: 5444.55,
        stock: {
          warehouse1: 20,
          warehouse2: 15,
          warehouse3: 10
        }
      },
      {
        _id: '2',
        name: 'Laptop',
        quantity: 25,
        revenue: 37500,
        stock: {
          warehouse1: 10,
          warehouse2: 8,
          warehouse3: 7
        }
      },
      {
        _id: '3',
        name: 'Smart Watch',
        quantity: 80,
        revenue: 12000,
        stock: {
          warehouse1: 30,
          warehouse2: 25,
          warehouse3: 25
        }
      }
    ]
  },
  '68120614ddca770a6579a14b': { // Branch 2
    summary: {
      totalSales: 18000,
      totalOrders: 120,
      averageOrderValue: 150,
      totalBranches: 3,
      uniqueProducts: 8
    },
    products: [
      {
        _id: '1',
        name: 'Running Shoes',
        quantity: 30,
        revenue: 3629.70,
        stock: {
          warehouse1: 15,
          warehouse2: 10,
          warehouse3: 5
        }
      },
      {
        _id: '2',
        name: 'Laptop',
        quantity: 15,
        revenue: 22500,
        stock: {
          warehouse1: 8,
          warehouse2: 5,
          warehouse3: 2
        }
      },
      {
        _id: '3',
        name: 'Smart Watch',
        quantity: 60,
        revenue: 9000,
        stock: {
          warehouse1: 25,
          warehouse2: 20,
          warehouse3: 15
        }
      }
    ]
  }
};

// Default empty data
export const defaultSalesData = {
  summary: {
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    totalBranches: 0,
    uniqueProducts: 0,
  },
  products: [],
  branches: [],
  trend: [],
};

// Dummy data for sales analytics
export const dummySalesData = {
  summary: {
    totalSales: 150000,
    totalOrders: 450,
    averageOrderValue: 333.33,
    totalBranches: 3,
    uniqueProducts: 12
  },
  branchWiseSales: [
    {
      branchId: '1',
      branchName: 'Main Branch',
      totalSales: 65000,
      totalOrders: 200,
      averageOrderValue: 325,
      dailySales: [
        { date: '2024-03-01', amount: 2500 },
        { date: '2024-03-02', amount: 3200 },
        { date: '2024-03-03', amount: 2800 },
        { date: '2024-03-04', amount: 3500 },
        { date: '2024-03-05', amount: 4200 },
        { date: '2024-03-06', amount: 3800 },
        { date: '2024-03-07', amount: 4500 }
      ],
      productWiseSales: [
        {
          productId: '1',
          productName: 'Running Shoes',
          totalQuantity: 120,
          totalRevenue: 24000
        },
        {
          productId: '2',
          productName: 'Casual Shirts',
          totalQuantity: 250,
          totalRevenue: 25000
        },
        {
          productId: '3',
          productName: 'Jeans',
          totalQuantity: 180,
          totalRevenue: 16000
        }
      ]
    },
    {
      branchId: '2',
      branchName: 'North Branch',
      totalSales: 45000,
      totalOrders: 150,
      averageOrderValue: 300,
      dailySales: [
        { date: '2024-03-01', amount: 1800 },
        { date: '2024-03-02', amount: 2200 },
        { date: '2024-03-03', amount: 1900 },
        { date: '2024-03-04', amount: 2500 },
        { date: '2024-03-05', amount: 2800 },
        { date: '2024-03-06', amount: 2400 },
        { date: '2024-03-07', amount: 3100 }
      ],
      productWiseSales: [
        {
          productId: '1',
          productName: 'Running Shoes',
          totalQuantity: 80,
          totalRevenue: 16000
        },
        {
          productId: '2',
          productName: 'Casual Shirts',
          totalQuantity: 150,
          totalRevenue: 15000
        },
        {
          productId: '3',
          productName: 'Jeans',
          totalQuantity: 120,
          totalRevenue: 14000
        }
      ]
    },
    {
      branchId: '3',
      branchName: 'South Branch',
      totalSales: 40000,
      totalOrders: 100,
      averageOrderValue: 400,
      dailySales: [
        { date: '2024-03-01', amount: 1500 },
        { date: '2024-03-02', amount: 1800 },
        { date: '2024-03-03', amount: 1600 },
        { date: '2024-03-04', amount: 2200 },
        { date: '2024-03-05', amount: 2500 },
        { date: '2024-03-06', amount: 2100 },
        { date: '2024-03-07', amount: 2800 }
      ],
      productWiseSales: [
        {
          productId: '1',
          productName: 'Running Shoes',
          totalQuantity: 60,
          totalRevenue: 12000
        },
        {
          productId: '2',
          productName: 'Casual Shirts',
          totalQuantity: 100,
          totalRevenue: 10000
        },
        {
          productId: '3',
          productName: 'Jeans',
          totalQuantity: 90,
          totalRevenue: 18000
        }
      ]
    }
  ]
}; 