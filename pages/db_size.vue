<template>
  <v-container fluid fill-height>
    <v-layout
      align-center
      row wrap
    >
      <v-flex xs12 md6>
        <v-card class="ma-2 pa-3">
          <apexchart type="donut" height="380" :options="chartOptions" :series="series" />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'DbSizeChart',
  layout: 'monitor',
  data () {
    const $t = this.$t.bind(this)
    return {
      series: [],
      chartOptions: {
        labels: this.getLabel(),
        dataLabels: {
          enable: false
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                value: {
                  formatter: function (val) {
                    return String(val).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
                  }
                }
              }
            }
          }
        },
        title: {
          text: $t('label.dbSize')
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    }
  },
  async created () {
    await this.initialize()
  },
  methods: {
    async initialize () {
      await this.$store.dispatch('statistics/doGetDbSize')
      this.series = this.getVal()
      this.chartOptions.labels = this.getLabel()
    },
    getVal () {
      const dbSize = this.$store.getters['statistics/getDbSize']
      const val = []
      for (let i = 0; i < dbSize.length; i++) {
        val.push(Number(dbSize[i].result[0].pg_database_size))
      }
      return val
    },
    getLabel () {
      const dbSize = this.$store.getters['statistics/getDbSize']
      const label = []
      for (let i = 0; i < dbSize.length; i++) {
        label.push(dbSize[i].db + '@' + dbSize[i].host)
      }
      return label
    }
  }

}
</script>
