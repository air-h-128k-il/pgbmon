<template>
  <v-container fluid fill-height>
    <v-layout
      align-center
      row wrap
    >
      <v-flex
        xs12 md12
      >
        <v-card class="item ma-2 pa-3">
          <p class="font-weight-black">{{ title }}</p>
          <apexchart type="bar" height="400" :options="chartOptions" :series="series" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  layout: 'monitor',
  data () {
    return {
      threshold: process.env.threshold,
      limit: process.env.limit,
      series: [],
      chartOptions: {
        plotOptions: {
          bar: {
            barHeight: '100%',
            horizontal: false
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          labels: { show: false }
        }
      },
      title: 'slow query'
    }
  },
  async created () {
    await this.initialize()
  },
  methods: {
    async initialize () {
      this.series = []
      await this.$store.dispatch('statistics/doGetSlowQuery', { threshold: this.threshold, limit: this.limit })
      const data = this.$store.getters['statistics/getSlowQuery']
      for (let i = 0; i < data.length; i++) {
        var maxTime = []
        var label = []
        const val = data[i].result
        for (let j = 0; j < val.length; j++) {
          maxTime.push(Math.round(val[j].max_time))
          label.push(String(val[j].calls))
        }
        var name = data[i].db + '@' + data[i].host
        this.series.push({ name: name, data: maxTime })
      }
    }
  }
}

</script>
