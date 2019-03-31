import { shallowMount } from "@vue/test-utils";
import localVueFactory from "./local-vue-factory";
import App from "../../src/App.vue";

describe("App.vue", () => {
  const localVue = localVueFactory.create();

  it("renders msg correctly", () => {
    const msg = "Mobster: The collaboration timer";
    const wrapper = shallowMount(App, {
      localVue
    });

    const title = wrapper.find(".headline");

    expect(title.text()).toMatch(msg);
  });
});
