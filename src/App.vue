<template>
  <div id="app">
    <FormulateForm
      class="form"
      v-model="formValues"
      :schema="formSchema"
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
  formSchema = [
    {
      component: "h1",
      children: "Kahzum Route Organizer"
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
