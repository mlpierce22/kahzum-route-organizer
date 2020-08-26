<template>
  <div id="app">
    <simple-modal v-model="showModal">
      <template slot="body">
        <video ref="video" class="camera-stream" />
        <button @click="capture">Click here to take picture</button>
      </template>
    </simple-modal>
    <div class="camera-modal" v-show="videoStream">
      <div class="camera-modal-container"></div>
    </div>
    <FormulateForm
      class="form"
      v-model="formValues"
      :schema="formSchema"
      :errors="{
        location: getLocErr(),
        storeAddy: getStoreErr(),
        custyAddy: getCustyErr()
      }"
      @submit="runRouting"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { calculateRoute } from "./driver-routing.js";
import SimpleModal from "simple-modal-vue";
@Component({
  components: { SimpleModal }
})
export default class App extends Vue {
  formValues = {};
  locationError = false;
  userCoordinates = {
    lat: null,
    long: null
  };
  custAddyError = false;
  storeAddyError = false;
  locationSuccess = false;
  showModal = false;
  videoStream = {};
  formSchema = [
    {
      component: "h1",
      children: "Kahzum Route Organizer"
    },
    {
      component: "h2",
      children: "Your API Key"
    },
    {
      component: "p",
      children:
        "API key can be found at openrouteservice (https://openrouteservice.org/dev/#/home)"
    },
    {
      type: "text",
      name: "api-key",
      validation: "required",
      "validation-messages": {
        required: "You must enter an API key."
      },
      label: "Please enter your API key."
    },
    {
      component: "h2",
      children: "Your location."
    },
    {
      component: "p",
      children:
        "Please enter your location, or allow us to get it automatically via gps."
    },
    {
      type: "button",
      name: "location",
      label: "Get My Location",
      on: {
        click: () => {
          this.getLocationStatus();
        }
      }
    },
    {
      component: "p",
      children: "Or"
    },
    {
      type: "text",
      label: "Address of your location"
    },
    {
      component: "h2",
      children: "Add Stores"
    },
    {
      type: "group",
      name: "stores",
      validation: "min:1",
      repeatable: true,
      "add-label": "+ Add Store",
      "error-behavior": "submit",
      "validation-messages": {
        min: "You must have at least 1 store!"
      },
      children: [
        {
          type: "text",
          name: "storeAddress",
          label: "Store Address"
        },
        {
          type: "button",
          name: "storeAddy",
          label: "From Image",
          on: {
            click: () => {
              this.getPicture("store");
            }
          }
        },
        {
          component: "h3",
          children: "Add Customers"
        },
        {
          type: "group",
          name: "customers",
          repeatable: true,
          "add-label": "+ Add Customer",
          validation: "min:1",
          "error-behavior": "submit",
          "validation-messages": {
            min: "Every store must have at least 1 customer!"
          },
          children: [
            {
              type: "text",
              name: "customerAddress",
              label: "Customer Address"
            },
            {
              type: "button",
              name: "custyAddy",
              label: "From Image",
              on: {
                click: () => {
                  this.getPicture("cust");
                }
              }
            }
          ]
        }
      ]
    },
    {
      type: "submit",
      label: "Calculate Routes"
    }
  ];

  mounted() {
    const formVals = sessionStorage.getItem("formValues");
    if (formVals) {
      this.formValues = JSON.parse(formVals);
    }
  }

  @Watch("formValues")
  saveTosessionStorage() {
    sessionStorage.setItem("formValues", JSON.stringify(this.formValues));
  }

  getLocErr() {
    return this.locationError
      ? "Couldn't get your location. It is probably blocked by your browser. Please enter it into the textbox below."
      : "";
  }
  getStoreErr() {
    return this.storeAddyError
      ? "Couldn't access your camera. It is probably blocked by your browser. Please enter the address into the textbox above."
      : "";
  }

  getCustyErr() {
    return this.custAddyError
      ? "Couldn't access your camera. It is probably blocked by your browser. Please enter the address into the textbox above."
      : "";
  }

  capture() {
    const mediaStreamTrack = this.videoStream.getVideoTracks()[0];
    const imageCapture = new window.ImageCapture(mediaStreamTrack);
    this.showModal = false;
    return imageCapture.takePhoto().then(blob => {
      this.destroy();
      console.log(blob);
    });
  }

  destroy() {
    const tracks = this.videoStream.getTracks();
    tracks.map(track => track.stop());
  }

  destroyed() {
    const tracks = this.mediaStream.getTracks();
    tracks.map(track => track.stop());
  }

  getPicture(field) {
    this.storeAddyError = false;
    this.custAddyError = false;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(mediaStream => {
        console.log("got it");
        console.log(this.$refs.video);
        this.showModal = true;
        this.videoStream = mediaStream;
        this.$refs.video["srcObject"] = mediaStream;
        this.$refs.video.play();
        // console.log(mediaStream);
      })
      .catch(err => {
        if (field == "store") {
          this.storeAddyError = true;
        } else {
          this.custAddyError = true;
        }
      });
  }
  async getLocationStatus() {
    this.locationError = false;
    await (this as any)
      .$getLocation({ enableHighAccuracy: false })
      .then((coordinates: any) => {
        this.locationSuccess = true;
        this.userCoordinates.lat = coordinates.lat;
        this.userCoordinates.long = coordinates.long;
        this.formSchema.splice(6, 3, {
          component: "h3",
          children: "Got Location!"
        });
      })
      .catch((err: any) => {
        this.locationError = true;
      });
  }

  runRouting(data: any) {
    console.log("data: ", data);
    calculateRoute(data);
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
