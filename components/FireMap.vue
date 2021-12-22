<template>
  <div class="main-content shadow-lg bg-white">
    <side-bar
      title="Actions"
      :right="right"
    >
      <slot>
        <div class="side-block-container-right">
          <button
            class="action-button action-button-icon"
            @click="goToPosition(geolocPosition)"
          >
            <img
              src="@/assets/img/pin.png"
              alt="Pin"
            >
            My location
          </button>
          <div
            class="side-block"
          >
            <h3 class="side-block-title">
              Select Wildfires
            </h3>
            <div
              class="side-block-filter"
            >
              <input
                v-model="wildfireFilter"
                type="text"
                class="wildfire-filter"
                placeholder="Search..."
              >
            </div>
            <div
              class="side-block-list"
            >
              <div
                v-for="wildfire in filterWildfires"
                :key="wildfire.id"
                class="side-block-list-item"
                :title="wildfire.title.trim()"
                @click="goToPosition(wildfire.geometries[0].coordinates, true, wildfire)"
              >
                <img
                  class="side-block-list-icon"
                  src="@/assets/img/fire.png"
                >
                {{ wildfire.title.trim() }}
              </div>
            </div>
          </div>
        </div>
      </slot>
    </side-bar>
    <loading-overlay
      v-if="loading"
      :text="loadingText"
    />
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
      @click="clickCoordinate = $event.coordinate"
    >
      <vl-view
        ref="view"
        :zoom.sync="zoom"
        :center="geolocPosition"
        :rotation.sync="rotation"
      />

      <vl-geoloc @update:position="geolocPosition = $event">
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" id="position-feature">
            <vl-geom-point :coordinates="geoloc.position" />
            <vl-style-box>
              <vl-style-icon
                :src="require('@/assets/img/pin.png')"
                :scale="iconScale"
                :anchor="[0.5, 1]"
              />
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>

      <vl-layer-vector
        v-if="showCircle"
      >
        <vl-feature>
          <vl-geom-point
            :coordinates="circleCoordinates"
            :offset="[0, -10]"
          />
          <vl-style-box>
            <vl-style-circle :radius="20">
              <vl-style-stroke color="red" />
            </vl-style-circle>
          </vl-style-box>
        </vl-feature>
      </vl-layer-vector>

      <vl-geoloc
        v-for="wildfire in wildfires"
        :id="wildfire.id"
        :key="wildfire.id"
      >
        <template slot-scope="geoloc">
          <vl-feature v-if="geoloc.position" :id="'position-feature-' + wildfire.id">
            <vl-geom-point :coordinates="wildfire.geometries[0].coordinates" />
            <vl-style-box>
              <vl-style-icon
                :src="require('@/assets/img/fire.png')"
                :scale="iconScale"
                :anchor="[0.5, 1]"
                @click="goToPosition(wildfire.geometries[0].coordinates, true, wildfire)"
              />
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>

      <vl-interaction-select
        :features.sync="selectedFeatures"
      >
        <template slot-scope="select">
          <vl-overlay
            v-for="feature in select.features"
            :id="feature.id"
            :key="feature.id"
            class="feature-popup"
            :position="pointOnSurface(feature.geometry)"
            :auto-pan="true"
            :auto-pan-animation="{ duration: 300 }"
            :offset="[0, -15]"
          >
            <template slot-scope="popup">
              <card-feature
                footer-title="Sources"
              >
                <template slot="heading">
                  Wildfire: {{ getEventByFeatureId(feature.id).title }}
                </template>
                <template slot="body">
                  {{ getEventByFeatureId(feature.id).description }}
                  <p class="text-xs">
                    Coordinates: {{ formatcoords(popup.position).format() }}
                  </p>
                </template>
                <template slot="footer">
                  <button
                    v-for="source in getEventByFeatureId(feature.id).sources"
                    :key="source.id"
                    class="card-button"
                    @click="goTo(source.url)"
                  >
                    {{ source.id }}
                  </button>
                </template>
              </card-feature>
            </template>
          </vl-overlay>
        </template>
      </vl-interaction-select>

      <vl-overlay
        v-if="showCircle && selectedEvent"
        class="feature-popup"
        :position="circleCoordinates"
        :auto-pan="true"
        :auto-pan-animation="{ duration: 300 }"
        :offset="[0, -15]"
      >
        <template slot-scope="popup">
          <card-feature
            footer-title="Sources"
          >
            <template slot="heading">
              Wildfire: {{ selectedEvent.title.trim() }}
            </template>
            <template slot="body">
              {{ selectedEvent.description }}
              <p class="text-xs">
                Coordinates: {{ formatcoords(popup.position).format() }}
              </p>
            </template>
            <template slot="footer">
              <button
                v-for="source in selectedEvent.sources"
                :key="source.id"
                class="card-button"
                @click="goTo(source.url)"
              >
                {{ source.id }}
              </button>
            </template>
          </card-feature>
        </template>
      </vl-overlay>

      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
    <div
      v-if="mode !== 'production'
        && geolocPosition !== undefined"
      class="info-box hidden md:block"
    >
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ getGeoLocPostion }}
    </div>
  </div>
</template>

<script>
import { findPointOnSurface } from 'vuelayers/lib/ol-ext'
const formatcoords = require('formatcoords')

export default {
  name: 'FireMap',

  data () {
    return {
      mode: process.env.NODE_ENV,

      zoom: 5,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined,
      clickCoordinate: undefined,
      selectedFeatures: [],

      events: [],
      wildfires: [],
      iconScale: 0.04,
      wildfireFilter: '',
      showCircle: false,
      circleCoordinates: [0, 0],
      loading: false,
      loadingText: 'Loading event data...',
      selectedEvent: null,

      right: true
    }
  },

  computed: {
    getGeoLocPostion () {
      return this.geolocPosition
        ? formatcoords(this.geolocPosition).format()
        : ['', '']
    },

    filterWildfires () {
      return this.wildfires.filter((item) => {
        return item.title.toLowerCase().includes(this.wildfireFilter.toLowerCase())
      })
    }
  },

  mounted () {
    this.fetchEvents()
  },

  methods: {
    pointOnSurface: findPointOnSurface,
    formatcoords,

    fetchEvents () {
      this.loading = true
      this.loadingText = 'Loading event data...'
      fetch('https://eonet.sci.gsfc.nasa.gov/api/v2.1/events?api_key=' + process.env.NASA_API_KEY + '&status=open')
        .then(response => response.json())
        .then((data) => {
          this.events = data.events
          this.events.forEach((item) => {
            const categories = item.categories.filter((category) => {
              return category.id === 8 // Wildfires
            })
            if (categories.length > 0) {
              this.wildfires.push(item)
            }
          })
          console.log(this.wildfires)
        })
        .then(() => { this.loading = false })
    },

    goToPosition (position, showCircle = false, selectedEvent = null) {
      this.showCircle = false
      this.loading = true
      this.loadingText = 'Finding position...'
      this.$refs.view.animate({
        center: position,
        zoom: 7
      })
        .then(() => {
          if (showCircle) {
            this.showCircle = true
            this.circleCoordinates = position
          }
          if (selectedEvent) {
            this.selectedEvent = selectedEvent
          }
          this.loading = false
        })
      this.center = position
    },

    goTo (url) {
      window.open(url, '_blank')
    },

    getEventByFeatureId (featureId) {
      let event = this.events.filter((event) => {
        return featureId.includes(event.id)
      })
      if (event.length === 0) { return {} }
      event = event[0]
      return event
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.main-content
  padding: 0
  margin: 0
  overflow: hidden
  margin-top: 57px
  width: 100vw
  height: calc(100vh - 40px - 40px)

.side-block-container-right
  @apply grid col-span-12
  margin: 5px

.side-block
  @apply border border-solid border-gray-400 rounded text-center m-1

.side-block-list
  @apply overflow-y-scroll overflow-x-hidden grid col-span-12

.side-block-list-buttons
  background-color: rgb(255, 255, 255, 0.8)

.side-block-list-item
  @apply truncate p-1 border-t border-solid border-gray-300 text-left
  cursor: pointer
  font-size: 0.7rem
  background-color: rgb(255, 255, 255, 0.8)

.side-block-list-icon
  @apply float-left mr-1
  width: 0.5rem
  height: 0.5rem
  margin-top: 0.2rem

.side-block-title
  @apply sticky rounded-t border-b border-solid border-gray-400
  background-color: rgb(255, 255, 255, 0.8)
  margin: 0
  padding: 0.3rem

.side-block-filter
  @apply sticky
  background-color: rgb(255, 255, 255, 0.8)

.info-box
  @apply fixed bottom-20 left-5 text-xs border border-solid border-gray-400 p-1 rounded
  background-color: rgb(255, 255, 255, 0.5)

.action-button
  @apply whitespace-nowrap text-white font-bold rounded m-1
  background-color: $accent_0_200
  max-height: 35px
  margin: 5px
  padding: 3px

.action-button:hover
  background-color: $accent_0_300

.action-button-icon img
  @apply inline-flex items-start
  width: 20px
  height: 20px

.wildfire-filter
  @apply bg-white block px-3 py-1.5 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:bg-white focus:outline-none
  height: 1.8rem
  padding: 0.3rem
  margin: 0.3rem

.wildfire-filter:focus
  border-color: $accent_0_300

.feature-popup
  position: absolute
  left: -50px
  bottom: 12px
  width: 20em
  max-width: none
  &:after, &:before
    top: 100%
    border: solid transparent
    content: ' '
    height: 0
    width: 0
    position: absolute
    pointer-events: none
  &:after
    border-top-color: white
    border-width: 10px
    left: 48px
    margin-left: -10px
  &:before
    border-top-color: #cccccc
    border-width: 11px
    left: 48px
    margin-left: -11px
  .content
    word-break: break-all
</style>
