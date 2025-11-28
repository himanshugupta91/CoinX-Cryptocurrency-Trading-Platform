import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { convertToUnixTimestamp } from "./ConvertToChartData";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarketChart } from "@/Redux/Coin/Action";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

const timeSeries = [
  {
    keyword: "DIGITAL_CURRENCY_DAILY",
    key: "Time Series (Daily)",
    lable: "1 Day",
    value: 1,
  },
  {
    keyword: "DIGITAL_CURRENCY_WEEKLY",
    key: "Weekly Time Series",
    lable: "1 Week",
    value: 7,
  },
  {
    keyword: "DIGITAL_CURRENCY_MONTHLY",
    key: "Monthly Time Series",
    lable: "1 Month",
    value: 30,
  },
  {
    keyword: "DIGITAL_CURRENCY_MONTHLY_3",
    key: "3 Month Time Series",
    lable: "3 Month",
    value: 90,
  },
  {
    keyword: "DIGITAL_CURRENCY_MONTHLY_6",
    key: "6 Month Time Series",
    lable: "6 Month",
    value: 180,
  },
  {
    keyword: "DIGITAL_CURRENCY_YEARLY",
    key: "Yearly Time Series",
    lable: "1 year",
    value: 365,
  },
];
const StockChart = ({ coinId }) => {
  const [stockData, setStockData] = useState(null);
  const [activeType, setActiveType] = useState(timeSeries[0]);
  const [loading, setLoading] = useState(false);
  const { coin, auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const series = [
    {
      data: coin.marketChart.data,
    },
  ];

  const [options] = useState({
    chart: {
      id: "area-datetime",
      type: "area",
      height: 450,
      zoom: {
        autoScaleYaxis: true,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
        autoSelected: 'zoom'
      },
      background: 'transparent',
      foreColor: '#9ca3af',
    },
    annotations: {
      // your annotations
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        }
      },
      axisBorder: {
        show: true,
        color: 'rgba(81, 226, 245, 0.2)',
      },
      axisTicks: {
        show: true,
        color: 'rgba(81, 226, 245, 0.2)',
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
        },
        formatter: function (value) {
          return '$' + value.toFixed(2);
        }
      }
    },
    colors: ['#51e2f5'], // Bright blue from new palette
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      colors: ['#51e2f5'],
      strokeColors: '#fff',
      strokeWidth: 2,
      size: 0,
      hover: {
        size: 7,
      }
    },
    tooltip: {
      theme: "dark",
      style: {
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
      },
      x: {
        format: 'dd MMM yyyy'
      },
      y: {
        formatter: function (value) {
          return '$' + value.toFixed(2);
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 50, 100],
        colorStops: [
          {
            offset: 0,
            color: '#51e2f5', // Bright blue
            opacity: 0.7
          },
          {
            offset: 50,
            color: '#9df9ef', // Blue green
            opacity: 0.4
          },
          {
            offset: 100,
            color: '#ffa8b6', // Pink sand
            opacity: 0.1
          }
        ]
      },
    },
    grid: {
      borderColor: 'rgba(81, 226, 245, 0.15)',
      strokeDashArray: 4,
      show: true,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10
      }
    },
  });

  useEffect(() => {
    // const fetchStockData = async () => {
    //   setLoading(true);
    //   setStockData(null)
    //   const data = await fetchData(activeType.keyword, coinId );
    //   console.log("stock data ", data);
    //   const chartData = convertToUnixTimestamp(data[activeType.key]);
    //   console.log("chartData ", chartData);
    //   setStockData(chartData);
    //   setLoading(false);
    // };
    // fetchStockData();
    if (coinId) {
      dispatch(fetchMarketChart({ coinId, days: activeType.value, jwt: localStorage.getItem("jwt") || auth.jwt }));
    }
  }, [coinId, activeType.value]);

  if (coin.marketChart.loading) {
    return (
      <div className="h-full w-full inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-t-4 border-t-gray-200 border-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  console.log("coin reducer", coin);

  return (
    <div className="glass-card p-6 rounded-xl border border-cyan-400/30 animate-fadeIn shadow-lg shadow-cyan-400/10">
      <div id="charts">
        <div className="toolbars flex flex-wrap gap-2 mb-6">
          {timeSeries.map((item) => (
            <Button
              onClick={() => setActiveType(item)}
              key={item.lable}
              variant={activeType.lable !== item.lable ? "outline" : ""}
              className={`${activeType.lable === item.lable
                ? 'btn-gradient hover-lift'
                : 'border-cyan-400/30 hover:border-cyan-400/60 hover-lift'
                }`}
            >
              {item.lable}
            </Button>
          ))}
        </div>
        <div id="chart-timelines" className="relative">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={450}
          />
        </div>
      </div>
    </div>
  );
};

export default StockChart;
