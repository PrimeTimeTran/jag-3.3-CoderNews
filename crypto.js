
const cryptoURL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=3&convert=USD&CMC_PRO_API_KEY=45bc4e27-1b16-47c8-b84f-962950dae1ae";

function renderLineGraph(coin) {
  const ctx = document.getElementById("myChart");
  const price = coin.quote.USD.price;
  const [ninetyAgoPrice] = getHistoricPrices(coin.quote.USD);
  const timeAgo = ["90d", "60d", "30d", "7d", "24h", "1h", "Current"];
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timeAgo,
      datasets: [
        {
          label: "Price",
          borderWidth: 1,
          data: getHistoricPrices(coin.quote.USD),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
        },
      ],
    },
    options: {
      tooltips: {
        enabled: true,
        mode: "nearest",
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
              suggestedMax: price,
              suggestedMin: ninetyAgoPrice,
            },
          },
        ],
      },
    },
  });
}

function getHistoricPrices(prices) {
  const {
    percent_change_90d,
    percent_change_60d,
    percent_change_30d,
    percent_change_7d,
    percent_change_24h,
    percent_change_1h,
    price,
  } = prices;

  const ninetyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_90d,
  );
  const sixtyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_60d,
  );
  const thirtyAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_30d,
  );
  const sevenAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_7d,
  );
  const dayAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_24h,
  );
  const hourAgoPrice = calculatePriceFromPercentageChange(
    price,
    percent_change_1h,
  );

  return [
    ninetyAgoPrice,
    sixtyAgoPrice,
    thirtyAgoPrice,
    sevenAgoPrice,
    dayAgoPrice,
    hourAgoPrice,
    price,
  ];
}

function calculatePriceFromPercentageChange(currentPrice, percentageChange) {
  let denominator;
  let historicPrice;
  if (percentageChange >= 100) {
    percentageChange = percentageChange + 100;
    denominator = percentageChange * 0.01;
    historicPrice = currentPrice / denominator;
  }

  if (percentageChange < 100 && percentageChange > 0) {
    denominator = 1 + percentageChange / 100;
    historicPrice = currentPrice / denominator;
  }

  if (percentageChange < 0) {
    const original = (currentPrice / (100 + percentageChange)) * 100;
    historicPrice = original;
  }
  return historicPrice;
}


async function fetchCryptoPrices() {
  const response = await fetch(cryptoURL);
  const json = await response.json();
  const coin = json.data[0];
  renderLineGraph(coin)
}

fetchCryptoPrices()

// var ctx = document.getElementById("myChart");

// var myChart = new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [15, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
