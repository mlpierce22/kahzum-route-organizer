<template>
  <div id="app">
    <simple-modal v-model="showModal">
      <template slot="body">
        <a target="_blank" :href="mapsURL">{{ mapsURL }}</a>
      </template>
    </simple-modal>
    <simple-modal v-model="isOptionRight">
      <template slot="body">
        <p>Please click on the right address.</p>
        <FormulateInput
          v-for="(option, index) in addressOption"
          :key="`${index}-address-for-modal`"
          type="button"
          :label="option"
          @click="handlePromise('resolve', option)"
        />
        <FormulateInput
          type="button"
          label="None are right."
          @click="handlePromise('reject')"
        />
      </template>
    </simple-modal>
    <h1>Kahzum Route Organizer</h1>
    <h2>Your API Key</h2>
    <p>
      API key can be found at
      <a href="https://openrouteservice.org/dev/#/home" target="_blank"
        >openrouteservice</a
      >
    </p>
    <FormulateInput
      type="text"
      name="api-key"
      validation="required"
      :validation-messages="{ required: 'You must enter an API key.' }"
      label="Please enter your API key."
      v-model="apiKey"
    />
    <h2 v-if="!locationSuccess">Your Location</h2>
    <p v-if="!locationSuccess">
      Please enter your location, or allow us to get it automatically via gps.
    </p>
    <div class="location-form" v-if="!locationSuccess">
      <FormulateInput
        type="button"
        @click="getLocationStatus()"
        name="location"
        label="Get My Location"
      />
      <p>OR</p>
      <!-- :error="getLocErr()" -->
      <FormulateInput label="Address of your location" v-model="userLocation" />
    </div>
    <h2 v-if="locationSuccess">Success! Got your coordinates!</h2>

    <h2>Add Locations</h2>
    <div
      class="address"
      v-for="(address, index) in addresses"
      :key="`address-${index}`"
    >
      <h2>Location {{ index + 1 }}</h2>
      <FormulateInput
        type="file"
        name="address"
        :uploader="readFile"
        @click="indexCurrentlyUploading = index"
        label="Add From Shipping label"
      />
      <FormulateInput
        type="text"
        label="Enter Address Manually"
        v-model="addresses[index]"
      />
      <div class="error-message" v-if="addressErrors[index]">
        Please try making this address more specific.
      </div>
    </div>
    <br />
    <FormulateInput
      type="button"
      label="Add another location"
      @click="newLocation()"
    />
    <br />
    <FormulateInput
      type="submit"
      label="Validate Addresses"
      @click="validate()"
      v-if="apiKey !== ''"
    />
    <FormulateInput type="submit" label="Get Routes" @click="runRouting()" />
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// https://github.com/GIScience/openrouteservice-js
import { calculateRoute, validateAddress } from "./driver-routing.js";
import SimpleModal from "simple-modal-vue";
import Tesseract from "tesseract.js";

@Component({
  components: { SimpleModal }
})
export default class App extends Vue {
  mapsURL = ""; // important
  apiKey = this.getAPIKey();
  numAddresses = 1;
  userLocation = [];
  showModal = false;
  addresses = [""];
  addressPrevVal = [""];
  addressErrors = [false];
  locationError = false;
  locationSuccess = false;
  isOptionRight = false;
  addressOption = null;
  indexCurrentlyUploading = 0;
  promise = {
    resolve: null,
    reject: null
  };

  newLocation() {
    this.addressPrevVal.push("");
    this.addresses.push("");
    this.addressErrors.push(false);
    this.numAddresses++;
  }

  handlePromise(which, option = null) {
    if (which == "resolve") {
      this.promise.resolve(option);
    } else {
      this.promise.reject();
    }
  }

  async validate() {
    for (let i = 0; i < this.addresses.length; ++i) {
      this.addressOption = await validateAddress(
        this.addresses[i],
        this.apiKey
      );
      this.isOptionRight = true;
      await new Promise((resolve, reject) => {
        this.promise["resolve"] = resolve;
        this.promise["reject"] = reject;
      }).then(
        (success: string) => {
          console.log("succeeded!", success, i);
          this.$set(this.addresses, i, success);
          this.isOptionRight = false;
        },
        () => {
          this.$set(this.addressErrors, i, true);
          this.isOptionRight = false;
        }
      );
    }
  }

  @Watch("apiKey")
  updateApiKey() {
    localStorage.setItem("apiKey", this.apiKey);
  }

  @Watch("addresses")
  addressUpdate(event) {
    const updateVals = this.addresses.map(address => {
      return !this.addressPrevVal.includes(address);
    });
    updateVals.forEach((val, index) => {
      this.addressErrors[index] = val ? false : this.addressErrors[index];
    });
    this.addressPrevVal = [...this.addresses];
  }

  getAPIKey() {
    const key = localStorage.getItem("apiKey");
    return key ? key : "";
  }

  updateAddresses(text) {
    this.$set(this.addresses, this.indexCurrentlyUploading, text);
    this.$set(this.addressPrevVal, this.indexCurrentlyUploading, text);
  }

  getLocErr() {
    return this.locationError
      ? "Couldn't get your location. It is probably blocked by your browser. Please enter it into the textbox below."
      : "";
  }

  async readFile(file, progress, error, option) {
    // https://github.com/naptha/tesseract.js
    Tesseract.recognize(file, "eng", {
      logger: m => {
        if (m.status == "recognizing text") {
          console.log(m);
          progress(Math.floor(m.progress * 100));
        }
      }
    }).then(({ data: { text } }) => {
      this.updateAddresses(text);
    });
  }

  async getLocationStatus() {
    this.locationError = false;
    const result = await (this as any).$getLocation({
      enableHighAccuracy: true
    });

    try {
      this.locationSuccess = true;
      console.log(result);
      this.userLocation.push(result.lng);
      this.userLocation.push(result.lat);
    } catch (err) {
      console.log("an error occured:", err);
      this.locationError = true;
    }
  }

  buildData() {
    return {
      "api-key": this.apiKey,
      addresses: this.addresses,
      currentLocation: [...this.userLocation]
    };
  }

  async runRouting() {
    const data = this.buildData();
    this.mapsURL = await calculateRoute(data);
    this.showModal = true;
    sessionStorage.removeItem("formValues");
  }
}
</script>

<style lang="scss">
@import "../node_modules/@braid/vue-formulate/themes/snow/snow.scss";
@import "./formulate.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-direction: column;

  .camera-modal-container {
    position: absolute;
    bottom: 0;
    width: 100%;
    align-items: center;
    margin-bottom: 24px;
  }
  .take-picture-button {
    display: flex;
  }
  .form {
    align-self: center;
  }
}
</style>
