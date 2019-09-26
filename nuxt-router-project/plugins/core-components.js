/**
 * ~plugins/core-components.js
 * 在这里引入的组件，在项目里不必再引入
 */
import Vue from "vue";

import AppButton from "~/components/UI/AppButton";
import AppControlInput from "~/components/UI/AppControlInput";
import PostPreview from "~/components/Posts/PostPreview";
import PostList from "~/components/Posts/PostList";
import TheHeader from "~/components/Navigation/TheHeader";
import TheSidenav from "~/components/Navigation/TheSidenav";
import TheSideNavToggle from "~/components/Navigation/TheSideNavToggle";
import AdminPostForm from "~/components/Admin/AdminPostForm";

Vue.component("AppButton", AppButton);
Vue.component("AppControlInput", AppControlInput);
Vue.component("PostPreview", PostPreview);
Vue.component("PostList", PostList);
Vue.component("TheHeader", TheHeader);
Vue.component("TheSidenav", TheSidenav);
Vue.component("TheSideNavToggle", TheSideNavToggle);
Vue.component("AdminPostForm", AdminPostForm);
