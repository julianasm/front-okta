<template>
  <n-card>
    <div id="chart-demo">
      <DxChart
        id="zoomedChart"
        :data-source="dataSource"
        title="Google Inc. Stock Prices"
      >
        <DxSeries
          type="candlestick"
          open-value-field="open"
          high-value-field="high"
          low-value-field="low"
          close-value-field="close"
          argument-field="created_on"
        >
          <DxAggregation :enabled="true" />
        </DxSeries>
        <DxArgumentAxis
          :visual-range="visualRange"
          :value-margins-enabled="false"
          argument-type="datetime"
        >
          <DxGrid :visible="true" />
          <DxLabel :visible="false" />
        </DxArgumentAxis>
        <DxValueAxis value-type="numeric" />
        <DxMargin :right="10" />
        <DxLegend :visible="false" />
        <DxTooltip :enabled="true" />
      </DxChart>
      <DxRangeSelector :data-source="dataSource" v-model:value="visualRange">
        <DxSize :height="120" />
        <DxRsChart>
          <DxRsValueAxis value-type="numeric" />
          <DxRsSeries type="line" value-field="open" argument-field="created_on">
            <DxRsAggregation :enabled="true" />
          </DxRsSeries>
        </DxRsChart>
        <DxScale
          :placeholder-height="20"
          minor-tick-interval="day"
          tick-interval="month"
          value-type="datetime"
          aggregation-interval="week"
        />
        <DxBehavior :snap-to-ticks="false" call-value-changed="onMoving" />
      </DxRangeSelector>
    </div>
  </n-card>
</template>
<script>
import DxChart, {
  DxSeries,
  DxAggregation,
  DxArgumentAxis,
  DxGrid,
  DxLabel,
  DxValueAxis,
  DxMargin,
  DxLegend,
  DxTooltip,
} from "devextreme-vue/chart";

import DxRangeSelector, {
  DxSize,
  DxScale,
  DxChart as DxRsChart,
  DxValueAxis as DxRsValueAxis,
  DxSeries as DxRsSeries,
  DxAggregation as DxRsAggregation,
  DxBehavior,
} from "devextreme-vue/range-selector";

import { NCard } from "naive-ui";
import axios from "axios";

export default {
  components: {
    DxChart,
    DxSeries,
    DxAggregation,
    DxArgumentAxis,
    DxGrid,
    DxLabel,
    DxValueAxis,
    DxMargin,
    DxLegend,
    DxTooltip,
    DxRangeSelector,
    DxSize,
    DxScale,
    DxRsChart,
    DxRsValueAxis,
    DxRsSeries,
    DxRsAggregation,
    DxBehavior,
    NCard,
  },

  created() {
    this.retrieveStocks()
  },

  data() {
    return {
      dataSource: [],
      visualRange: [],
      id_stock: '',
    };
  },

  methods: {
    async retrieveStocks() {
      this.accessToken = this.$auth.getAccessToken();
      const config = {
        headers: { Authorization: "Bearer " + this.accessToken },
      };
      try {
        let id_stock = 22;
        let response = await axios.get(
          `http://localhost:8082/chart/${id_stock}`,
          config
        );
        this.dataSource = response.data
        console.log(this.dataSource)
      } catch (error) {
        this.dataSource = `${error}`
      }
    },
  },
};
</script>
<style>
#chart-demo {
  height: 450px;
}

#zoomedChart {
  height: 315px;
  margin: 0 0 15px;
}

#chart-demo > div:not(#zoomedChart) {
  height: 120px;
}
</style>