<template>
  <div class="main-content shadow-lg bg-white">
    <vl-map
      :load-tiles-while-animating="true"
      :load-tiles-while-interacting="true"
      data-projection="EPSG:4326"
      class="fires-map"
      style="
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
      "
    >
      <vl-view
        :zoom.sync="zoom"
        :center.sync="center"
        :rotation.sync="rotation"
      />

      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position" />
            <vl-style-box>
              <vl-style-icon
                :src="require('@/assets/icon.png')"
                :scale="0.09"
                :anchor="[0.5, 1]"
              />
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>

      <vl-feature
        id="marker"
        ref="marker"
        :properties="{ start: Date.now(), duration: 2500 }"
      >
        <template slot-scope="feature">
          <vl-geom-point :coordinates="[-10, -10]" />
          <vl-style-box>
            <vl-style-icon
              :src="require('@/assets/icon.png')"
              :scale="0.5"
              :anchor="[0.1, 0.95]"
              :size="[128, 128]"
            />
          </vl-style-box>
          <vl-overlay
            v-if="feature.geometry"
            :position="pointOnSurface(feature.geometry)"
            :offset="[10, 10]"
          >
            <p class="is-light box content">
              Always opened overlay for Feature ID <strong>{{ feature.id }}</strong>
            </p>
          </vl-overlay>
        </template>
      </vl-feature>

      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
    <div class="fixed z-10 bottom-20 left-5">
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ geolocPosition }}
    </div>
  </div>
</template>

<script>
import { findPointOnSurface } from 'vuelayers/lib/ol-ext'

export default {
  name: 'FireMap',

  data () {
    return {
      zoom: 2,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined,
      events: [],
      wildFires: []
    }
  },

  created () {
    // this.fetchEvents()
  },

  methods: {
    pointOnSurface: findPointOnSurface,

    async fetchEvents () {
      /*
      const res = await fetch('https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?api_key=' + process.env.NASA_API_KEY + '&status=open')
      this.events = await res.json()
      this.events.forEach((item) => {
        const categories = item.categories.filter((category) => {
          return category.id === 8 // Wildfires
        })
        if (categories.length > 0) {
          this.wildFires.push(item)
        }
      })
      */
    }
  }
}
</script>

<style lang="sass" scoped>
.main-content
  padding: 0
  margin: 0
  overflow: none
  margin-top: 65px
  width: 100vw
  height: calc(100vh - 40px - 40px)
</style>
