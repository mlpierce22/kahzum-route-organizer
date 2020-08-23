<template>
  <div id="app">
    <FormulateForm
      class="form"
      v-model="formValues"
      :schema="formSchema"
      :errors="{
        location: getLocErr()
      }"
      @submit="runRouting"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { calculateRoute } from "./driver-routing.js";

@Component({
  components: {}
})
export default class App extends Vue {
  formValues = {};
  locationError = false;
  userCoordinates = [];
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

  async getLocationStatus() {
    this.locationError = false;
    await (this as any)
      .$getLocation({ enableHighAccuracy: false })
      .then((coordinates: any) => {
        console.log(coordinates);
      })
      .catch((err: any) => {
        this.locationError = true;
      });
  }

  // TODO: Figure out whether location is a coordinate or a address we have to look up...

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

  .form {
    align-self: center;
  }
}
</style>
