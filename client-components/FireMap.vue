<template>
  <div class="main-content">
    <side-bar
      title="Actions"
      :right="right"
      :state="sideBarState"
    >
      <slot>
        <div class="side-block-container-right">
          <button
            v-if="!gettingUserPosition"
            class="action-button action-button-icon"
            @click="goToPosition(userPosition)"
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
              View Wildfire
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
                @click="goToPosition(wildfire.geometries[0].coordinates, wildfire.id)"
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
    <l-map
      ref="wildfireMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%; z-index: 0;"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >
      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />
      <l-marker
        v-if="userPosition"
        :lat-lng="userPosition"
      >
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>
            You are here
          </div>
        </l-tooltip>
      </l-marker>
      <l-marker
        v-for="wildfire in wildfires"
        :id="wildfire.id"
        :ref="`marker-`+wildfire.id"
        :key="wildfire.id"
        :lat-lng="wildfire.geometries[0].coordinates"
      >
        <l-icon
          :icon-size="dynamicSize"
          :icon-anchor="dynamicAnchor"
          :icon-url="require('@/assets/img/fire.png')"
        />
        <l-popup>
          <card-feature
            footer-title="Sources"
          >
            <template slot="heading">
              Wildfire: {{ wildfire.title.trim() }}
            </template>
            <template slot="body">
              {{ wildfire.description }}
              <div class="text-xs">
                <p class="font-bold">
                  Coordinates:
                </p>
                <ul>
                  <li>
                    Latitude: {{ wildfire.geometries[0].coordinates[0] }}
                  </li>
                  <li>
                    Longitude: {{ wildfire.geometries[0].coordinates[1] }}
                  </li>
                </ul>
              </div>
            </template>
            <template slot="footer">
              <button
                v-for="source in wildfire.sources"
                :key="source.id"
                class="card-button"
                @click="goTo(source.url)"
              >
                {{ source.id }}
              </button>
            </template>
          </card-feature>
        </l-popup>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng } from 'leaflet'
import {
  LIcon,
  LMap,
  LMarker,
  LPopup,
  LTileLayer,
  LTooltip
} from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'

const formatcoords = require('formatcoords')

export default {
  name: 'WildfiresMap',

  components: {
    LIcon,
    LMap,
    LMarker,
    LPopup,
    LTileLayer,
    LTooltip
  },

  data () {
    return {
      zoom: 7,
      center: latLng(0, 0),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 7,
      currentCenter: latLng(0, 0),
      mapOptions: {
        zoomSnap: 0.5
      },
      wildfires: [],
      userPosition: null,
      iconSize: 32,

      loading: false,
      loadingText: 'Loading event data...',

      windowWidth: window.innerWidth,

      // sidebar
      right: true,
      wildfireFilter: '',
      gettingUserPosition: true,
      sideBarState: true
    }
  },

  computed: {
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1]
    },

    dynamicAnchor () {
      return [this.iconSize / 2, 0]
    },

    filterWildfires () {
      return this.wildfires.filter((item) => {
        return item.title.toLowerCase().includes(this.wildfireFilter.toLowerCase())
      })
    }
  },

  mounted () {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.fetchEvents()
    if (!('geolocation' in navigator)) {
      console.error('Geolocation is not available.')
    }

    navigator.geolocation.getCurrentPosition((pos) => {
      this.gettingUserPosition = false
      this.userPosition = latLng(pos.coords.latitude, pos.coords.longitude)
      this.center = this.userPosition
    }, (err) => {
      this.gettingUserPosition = false
      console.error(err.message)
    })
  },

  methods: {
    latLng,
    formatcoords,

    zoomUpdate (zoom) {
      this.currentZoom = zoom
    },

    centerUpdate (center) {
      this.currentCenter = center
    },

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
              item.geometries[0].coordinates = item.geometries[0].coordinates.reverse()
              this.wildfires.push(item)
            }
          })
          console.log(this.wildfires)
        })
        .then(() => { this.loading = false })
    },

    goTo (url) {
      window.open(url, '_blank')
    },

    goToPosition (position, id) {
      console.log(position)
      this.loading = true
      this.loadingText = 'Finding position...'
      if (id) {
        this.$refs['marker-' + id][0].mapObject.openPopup()
      }
      if (this.windowWidth <= 768) {
        this.sideBarState = !this.sideBarState
      }
      this.$refs.wildfireMap.mapObject.panTo(position)
      this.loading = false
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
  margin-top: 58px
  height: calc(100vh - 55px)
  position: fixed
  width: 100%

.side-block-container-right
  @apply grid col-span-12 place-self-start
  margin: 5px
  width: 98%
  height: 100%

.side-block
  @apply border border-solid border-gray-400 rounded text-center m-1 place-self-start
  width: 98%

.side-block-list
  @apply overflow-y-scroll overflow-x-hidden grid col-span-12

.side-block-list-buttons
  background-color: rgb(255, 255, 255, 0.8)

.side-block-list-item
  @apply truncate p-1 border-t border-solid border-gray-300 text-left
  cursor: pointer
  font-size: 0.9rem !important
  background-color: rgb(255, 255, 255, 0.8)
  margin: 0
  width: 100%
.side-block-list-item:hover
  @apply bg-gray-100

.side-block-list-icon
  @apply float-left mr-1
  width: 0.9rem
  height: 0.9rem
  margin-top: 0.2rem

.side-block-title
  @apply sticky rounded-t border-b border-solid border-gray-400
  background-color: rgb(255, 255, 255, 0.8)
  margin: 0
  padding: 0.3rem

.side-block-filter
  @apply sticky
  background-color: rgb(255, 255, 255, 0.8)

.wildfire-filter
  @apply bg-white block px-3 py-1 text-base text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
  height: 1.8rem
  padding: 0.3rem
  margin: 0.3rem
.wildfire-filter:focus
  @apply text-gray-700 bg-white outline-none

.wildfire-filter:focus
  border-color: $accent_0_300

.action-button
  @apply whitespace-no-wrap text-white font-bold rounded m-1
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
</style>
