<template>
  <div class="main-content shadow-lg bg-white">
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
              />
            </vl-style-box>
          </vl-feature>
        </template>
      </vl-geoloc>

      <vl-overlay
        v-if="showCircle"
        class="feature-popup"
        :position="circleCoordinates"
        :auto-pan="true"
        :auto-pan-animation="{ duration: 300 }"
      >
        <template slot-scope="popup">
          <section class="card bg-white border border-solid border-gray-400 p-1 rounded">
            <header class="card-header">
              <p class="card-header-title">
                Feature ID
              </p>
              <a
                class="card-header-icon"
                title="Close"
              >
                <b-icon icon="close" />
              </a>
            </header>
            <div class="card-content">
              <div class="content">
                <p>
                  Overlay popup content for Feature with ID
                </p>
                <p>
                  Popup: {{ JSON.stringify(popup) }}
                </p>
              </div>
            </div>
          </section>
        </template>
      </vl-overlay>

      <vl-layer-tile id="osm">
        <vl-source-osm />
      </vl-layer-tile>
    </vl-map>
    <div
      v-if="geolocPosition !== undefined"
      class="info-box"
    >
      Zoom: {{ zoom }}<br>
      Center: {{ center }}<br>
      Rotation: {{ rotation }}<br>
      My geolocation: {{ getGeoLocPostion }}
    </div>
    <div class="side-block-container-right">
      <div
        class="actions-container side-block"
      >
        <h3 class="side-block-title">
          Actions
        </h3>
        <div
          class="side-block-list side-block-list-buttons"
        >
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
        </div>
      </div>
      <div
        class="side-block"
      >
        <h3 class="side-block-title">
          Wildfires
        </h3>
        <div
          class="side-block-filter"
        >
          <input
            v-model="wildfireFilter"
            type="text"
            class="
              wildfire-filter
              block
              w-full
              px-3
              py-1.5
              text-base
              text-gray-700
              bg-white
              bg-clip-padding
              border
              border-solid
              border-gray-300
              rounded
              transition
              ease-in-out
              focus:text-gray-700
              focus:bg-white
              focus:outline-none
            "
            placeholder="Search..."
          >
        </div>
        <div
          class="side-block-list overflow-y-scroll overflow-x-hidden"
        >
          <div
            v-for="wildfire in filterWildfires"
            :key="wildfire.id"
            class="side-block-list-item"
            @click="goToPosition(wildfire.geometries[0].coordinates, true)"
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
  </div>
</template>

<script>
import { findPointOnSurface } from 'vuelayers/lib/ol-ext'
const formatcoords = require('formatcoords')

export default {
  name: 'FireMap',

  data () {
    return {
      loading: false,
      loadingText: 'Loading event data...',
      zoom: 5,
      center: [0, 0],
      rotation: 0,
      geolocPosition: undefined,
      events: [],
      wildfires: [],
      iconScale: 0.04,
      wildfireFilter: '',
      showCircle: false,
      circleCoordinates: [0, 0]
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

    goToPosition (position, showCircle = false) {
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
          this.loading = false
        })
      this.center = position
    }
  }
}
</script>

<style lang="sass" scoped>
@import "@/assets/sass/_variables.sass"

.main-content
  padding: 0
  margin: 0
  overflow: none
  margin-top: 65px
  width: 100vw
  height: calc(100vh - 40px - 40px)

.side-block
  @apply border border-solid border-gray-400 rounded text-center grid grid-cols-1 m-1

.side-block-container-right
  @apply fixed top-20 right-5
  max-width: 10rem
  max-height: 100%

.side-block-list
  max-height: 30vh

.side-block-list-buttons
  background-color: rgb(255, 255, 255, 0.6)

.side-block-list-item
  @apply truncate p-1 border-t border-solid border-gray-300 text-left
  cursor: pointer
  font-size: 0.5rem
  width: 144px
  max-width: 144px
  background-color: rgb(255, 255, 255, 0.6)

.side-block-list-icon
  @apply float-left mr-1
  width: 0.5rem
  height: 0.5rem
  margin-top: 0.2rem

.side-block-title
  @apply sticky rounded-t border-b border-solid border-gray-400
  background-color: rgb(255, 255, 255, 0.5)
  margin: 0
  width: 100%
  padding: 0.3rem

.side-block-filter
  @apply sticky
  background-color: rgb(255, 255, 255, 0.5)
  width: 100%
  padding: 0.3rem

.info-box
  @apply fixed bottom-20 left-5 text-xs border border-solid border-gray-400 p-1 rounded
  background-color: rgb(255, 255, 255, 0.5)

.actions-container
  button img
    width: 20px
    height: 20px

.actions-container
    button:first-of-type
      margin: 0.25rem

.actions-container
  button
    margin-bottom: 0.25rem
    margin-left: 0.25rem
    margin-right: 0.25rem

.action-button
  @apply whitespace-nowrap text-white font-bold py-2 px-2 rounded
  background-color: $accent_0_200

.action-button:hover
  background-color: $accent_0_300

.action-button-icon img
  @apply inline-flex items-start

.wildfire-filter
  margin: 3px
  margin-top: 0
  font-size: 0.7rem
  height: 1.8rem
  width: 132px
  max-width: 132px

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
  .card-content
    max-height: 20em
    overflow: auto
  .content
    word-break: break-all
</style>
