<template>
  <v-container fluid fill-height>
    <v-layout
      align-center
      row wrap
    >
      <v-flex v-for="(item, i) in series"
              :key="i"
              xs12 md4
      >
        <v-card class="item ma-2 pa-3">
          <apexchart type="radar" height="350" :options="chartOptions[i]" :series="item" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'AccessLoadChart',
  layout: 'monitor',
  data () {
    // const $t = this.$t.bind(this)
    return {
      color: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
      series: [],
      chartOptions: []
    }
  },
  async created () {
    await this.initialize()
  },
  methods: {
    async initialize () {
      await this.$store.dispatch('statistics/doGetSqlCall')
      const data = this.$store.getters['statistics/getSqlCall']
      var series = []
      const label = []
      for (let i = 0; i < data.value.length; i++) {
        label.push(data.value[i].db + '@' + data.value[i].host)
        const val = data.value[i].result
        for (let j = 0; j < val.length; j++) {
          var call = []
          if (Array.isArray(series[val[j].sql])) {
            call = series[val[j].sql]
          }
          if (val[j].call !== null) {
            call.push(Number(val[j].call))
          } else {
            call.push(0)
          }
          series[val[j].sql] = call
        }
      }
      this.series = []
      this.chartOptions = []
      var i = 0
      for (var key in series) {
        var val = series[key]
        var index = i %  this.color.length
        this.series.push([{ name: key, data: val }])
        var option = {
          title: { text: key },
          labels: label,
          fill: {
            colors: [this.color[index]]
          }
        }
        this.chartOptions.push(option)
        i++
      }
    }
  }
}
</script>
