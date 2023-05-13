import ReactECharts from "echarts-for-react";
import numeral from "numeral";

import { useAppSelector } from "../../redux/store";
import { convertData } from "../../utils";

function UPChart() {
  const response = useAppSelector((state) => state.data.data?.makers);
  const data = response ? convertData(response, "uptime") : null;

  if (data === null) {
    return <div>Data is unavailable</div>;
  }

  const seriesData = Object.keys(data[0])
    .filter((key) => key !== "timestamp")
    .map((key) => ({
      name: key,
      type: "line",
      showSymbol: false,
      emphasis: {
        focus: "series",
      },
      data: data.map((item) => item[key]),
    }));

  const timestamps = data.map((item) => new Date(item.timestamp as number));

  const option = {
    tooltip: {
      trigger: "axis",
      backgroundColor: "#2A2A2F",
      borderWidth: 0,
      textStyle: {
        color: "#A2A2A6",
      },
      formatter: (params: any) => {
        const date = new Date(params[0].data.value[0]);
        const formattedDate = `${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} ${date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        const lines = params.map(
          (param: any) =>
            `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
              param.color
            };"></span>${
              param.seriesName
            }:  <span style="float:right;padding-left:14px;font-weight:bold;">${numeral(
              param.value[1]
            ).format("0.[00]%")}</span>`
        );
        return `<div><span style="display:inline-block;color:white;font-weight:bold;margin-bottom:4px;">${formattedDate}</span><br>${lines.join(
          "<br>"
        )}</div>`;
      },
    },
    legend: {
      type: "scroll",
      pageIconColor: "#A2A2A6",
      pageIconInactiveColor: "#323237",
      inactiveColor: "#A2A2A6",
      pageTextStyle: {
        color: "#A2A2A6",
      },
      data: Object.keys(data[0]).filter((key) => key !== "timestamp"),
      icon: "circle",
      bottom: "2%",
      textStyle: {
        color: "#A2A2A6",
      },
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "12%",
      top: "6%",
      containLabel: true,
    },
    xAxis: {
      type: "time",
      data: null,
    },
    yAxis: {
      type: "value",
      max: 1,
      splitLine: {
        lineStyle: {
          color: "#323237",
        },
      },
      axisLabel: {
        formatter: (value: number) => {
          return numeral(value).format("0%").toUpperCase();
        },
      },
    },
    series: seriesData.map((series) => ({
      ...series,
      data: series.data.map((value, index) => ({
        value: [timestamps[index], value],
      })),
    })),
  };

  return (
    <div className="h-96">
      <ReactECharts
        option={option}
        style={{ height: "100%" }}
        className="px-2"
      />
    </div>
  );
}

export default UPChart;