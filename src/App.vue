<template>
  <div id="app">
    <simple-modal class="modal" v-model="showModal">
      <template slot="body">
        <a target="_blank" :href="mapsURL"
          >Link To Google Maps route from your location to your destinations</a
        >
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
      <FormulateInput label="Address of your location" v-model="userLocation" />
      <FormulateInput
        label="Validate Location Address"
        type="button"
        @click="validateUserLocation"
        v-if="typeof userLocation == 'string' && userLocation !== ''"
      />
    </div>
    <div class="locationError" v-if="locationError">
      Couldn't get your location. It is probably blocked by your browser or the
      address you entered couldn't be found. Please enter it into the textbox
      below or try being more specific.
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
        :uploader="
          (file, progress, error, option) => {
            readFile(file, progress, error, option, index);
          }
        "
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
      v-if="apiKey !== '' && !noLocation && !locationError"
    />
    <div class="need-location" v-if="noLocation || locationError">
      You must add your location before you can validate addresses
    </div>
    <div class="need-location" v-if="noLocation || locationError">
      You must select your location before you are allowed to route
    </div>
    <FormulateInput
      v-if="!noLocation && !locationError"
      type="submit"
      label="Get Routes"
      @click="runRouting()"
    />
    <br />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// https://github.com/GIScience/openrouteservice-js
import {
  calculateRoute,
  validateAddress,
  addressToCoords
} from "./driver-routing.js";
import SimpleModal from "simple-modal-vue";
import Tesseract from "tesseract.js";

@Component({
  components: { SimpleModal }
})
export default class App extends Vue {
  mapsURL = ""; // important
  apiKey = this.getAPIKey();
  numAddresses = 1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userLocation: string | any[] = [];
  showModal = false;
  addresses = [""];
  addressPrevVal = [""];
  addressErrors = [false];
  locationError = false;
  locationSuccess = false;
  isOptionRight = false;
  addressOption = null;
  promise = {
    resolve: null,
    reject: null
  };

  get noLocation() {
    return (typeof this.userLocation == "string" && this.userLocation == "") ||
      (Array.isArray(this.userLocation) && this.userLocation.length == 0)
      ? true
      : false;
  }

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

  async validateUserLocation() {
    this.addressOption = await validateAddress(
      this.userLocation,
      this.apiKey,
      this.userLocation
    );
    this.isOptionRight = true;
    await new Promise((resolve, reject) => {
      this.promise["resolve"] = resolve;
      this.promise["reject"] = reject;
    }).then(
      (success: string) => {
        this.locationError = false;
        this.userLocation = success;
        this.isOptionRight = false;
      },
      () => {
        this.locationError = true;
        this.isOptionRight = false;
      }
    );
  }

  async validate() {
    for (let i = 0; i < this.addresses.length; ++i) {
      this.addressOption = await validateAddress(
        this.addresses[i],
        this.apiKey,
        this.userLocation
      );
      this.isOptionRight = true;
      await new Promise((resolve, reject) => {
        this.promise["resolve"] = resolve;
        this.promise["reject"] = reject;
      }).then(
        (success: string) => {
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
  addressUpdate() {
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

  updateAddresses(text, index) {
    this.$set(this.addresses, index, text);
    this.$set(this.addressPrevVal, index, text);
  }

  async readShipping(text: string) {
    let infoBits = text.split("\n");
    let count = -1;

    infoBits.forEach(line => {
      count++;
      let index = 0;
      const asWords = line.split(" ");
      asWords.forEach(word => {
        for (const c of word) {
          if (c.match(/^[A-Za-z]/) || c.match(/^[0-9]/)) {
            index += word.length + 1;
            break;
          } else {
            // line=line[:index]+line[index+len(word)+1:]
            // const temp =
            //   line.slice(0, index) + line.slice(0, index + word.length + 1);
            const temp =
              line.slice(0, index) +
              line.slice(index + word.length + 1, line.length);
            infoBits[count] = temp;
          }
        }
      });
    });

    infoBits = infoBits.filter(infoBit => infoBit !== "" && infoBit !== "");
    // console.log("infobits at this point: ", infoBits);
    console.log(infoBits);
    count = -1;
    // take only the furthest away (because this should also find the top address)
    const temp = [];
    for (const line of infoBits) {
      count += 1;
      const streetRegex = /\d+[ ]([a-z]\.\s)?([a-z](\s)?)+\w\.?/i;
      const cityZipRegex = /(\w[ ]?)+[ CA ]\b\d{5}(?:-\d{4})?\b/i;
      if (line.match(streetRegex)) {
        console.log("street", line);
        const toformat1 = line.toLowerCase().indexOf("to: ");
        const toformat2 = line.toLowerCase().indexOf("to ");
        if (toformat1 >= 0) {
          const lineToPush = line.slice(toformat1 + "to: ".length);
          temp.push({ type: "street", line: lineToPush });
        } else if (toformat2 >= 0) {
          const lineToPush = line.slice(toformat2 + "to ".length);
          temp.push({ type: "street", line: lineToPush });
        } else {
          temp.push({ type: "street", line: line });
        }
      } else if (line.match(cityZipRegex)) {
        console.log("zip", line);
        temp.push({ type: "cityZip", line });
      }
    }
    const addressObj = {
      street: "",
      cityZip: ""
    };
    console.log("temp", temp[0]);
    console.log("temp", temp[1]);
    for (let i = temp.length - 1; i >= 0; --i) {
      if (addressObj[temp[i].type] == "") {
        addressObj[temp[i].type] = temp[i].line;
      }
    }
    console.log("return", addressObj.street);
    console.log("return", addressObj.cityZip);
    // street, zipcode
    return [addressObj.street, addressObj.cityZip];
  }

  async readFile(file, progress, error, option, index) {
    //* * * * * * *//
    //I have it set up so it will work if you take
    // the shipping label picture with your phone sideways.
    //* * * * * * *//
    const base64File = await this.toBase64(file);
    const rotated = await this.half(base64File);
    let shippingArgs = ["", ""];
    // https://github.com/naptha/tesseract.js
    let result = await Tesseract.recognize(rotated, "eng", {
      //
      logger: m => {
        if (m.status == "recognizing text") {
          console.log(m);
          progress(Math.floor(m.progress * 100) / 2);
        }
      }
    });
    let text = result.data.text;
    console.log(text);
    shippingArgs = await this.readShipping(text);
    text = "";
    result = null;
    // old code for if it unknowingly needs to be rotated 180
    // (pictures from the internet seem to need this xtra step
    // 4 some reason)

    // if (shippingArgs.includes("")) {
    //   //const rotated = file.rotate(180);
    //   const base64File = await this.toBase64(file);
    //   const rotated = await this.rotate180(base64File);
    //   result = await Tesseract.recognize(rotated, "eng", {
    //     logger: m => {
    //       if (m.status == "recognizing text") {
    //         console.log(m);
    //         progress(50 + Math.floor(m.progress * 100) / 2);
    //       }
    //     }
    //   });
    //   text = result.data.text;
    //   console.log(text);
    //   shippingArgs = await this.readShipping(text);
    // }
    progress(100);
    if (shippingArgs.includes("")) {
      error(
        "Couldn't read the shipping label. Please try entering it manually."
      );
    } else {
      const builtAddress = shippingArgs[0] + ", " + shippingArgs[1];
      this.updateAddresses(builtAddress, index);
    }
  }

  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  async halfturn(src) {
    const img = new Image();
    img.src = src;
    await img.onload;
    const canvas = document.createElement("canvas");
    canvas.width = img.height;
    canvas.height = img.width;
    canvas.style.position = "absolute";
    const ctx = canvas.getContext("2d");
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate((3 * Math.PI) / 2);
    //ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.drawImage(img, -img.height / 2, -img.width / 2);
    return canvas.toDataURL();
  }
  async rotate180(src) {
    const img = new Image();
    img.src = src;
    await img.onload;
    const canvas = document.createElement("canvas");
    canvas.width = img.height;
    canvas.height = img.width;
    canvas.style.position = "absolute";
    const ctx = canvas.getContext("2d");
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(Math.PI);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    return canvas.toDataURL();
  }

  async getLocationStatus() {
    this.locationError = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (this as any).$getLocation({
      enableHighAccuracy: true
    });

    try {
      this.locationSuccess = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.userLocation as any[]).push(result.lng);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.userLocation as any[]).push(result.lat);
    } catch (err) {
      console.log("an error occured:", err);
      this.locationError = true;
    }
  }

  async buildData() {
    let addy = undefined;
    if (!Array.isArray(this.userLocation)) {
      addy = await addressToCoords(this.userLocation, this.apiKey);
      if (addy == null) {
        return null;
      }
    }
    return {
      "api-key": this.apiKey,
      addresses: this.addresses,
      currentLocation: addy ? addy : [...this.userLocation]
    };
  }

  async runRouting() {
    const data = await this.buildData();
    if (data !== null) {
      this.mapsURL = await calculateRoute(data);
      this.showModal = true;
    } else {
      this.locationError = true;
    }
    //sessionStorage.removeItem("formValues");
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

  .vsm-modal {
    margin-top: 80vh;
  }

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
