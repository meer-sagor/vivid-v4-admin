<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const model = ref([
  {
    label: "General",
    items: [
      { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
      { label: "Sales", icon: "pi pi-fw pi-wallet", to: "/sales" },
      {
        label: "Ship Station Orders",
        icon: "pi pi-fw pi-truck",
        to: "/ship-station-orders",
      },
      { label: "Department", icon: "pi pi-fw pi-sitemap", to: "/departments" },
      { label: "Promo Code", icon: "pi pi-fw pi-tag", to: "/promo-code" },
    ],
  },
  {
    label: "Home Section",
    items: [
      {
        label: "Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Top Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Products",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Custom Printing",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Embroidery",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
    ],
  },
  {
    label: "Products Section",
    items: [
      {
        label: "Manage Products",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Brands",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Colors",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Sizes",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Print Sides",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
      },
      {
        label: "Printing Price",
        icon: "pi pi-fw pi-id-card",
        to: "/uikit/formlayout",
        items: [
          {
            label: "Price Table",
            icon: "pi pi-fw pi-id-card",
            to: "/uikit/formlayout",
          },
          {
            label: "Price Dscount Table",
            icon: "pi pi-fw pi-id-card",
            to: "/uikit/formlayout",
          },
          {
            label: "Pricing Personalize Table",
            icon: "pi pi-fw pi-id-card",
            to: "/uikit/formlayout",
          },
        ],
      },
      {
        label: "Fabrics",
        icon: "pi pi-fw pi-id-card",
        to: "/fabrics",
      },
      {
        label: "Brands ",
        icon: "pi pi-fw pi-id-card",
        to: "/brands",
      },
      {
        label: "Sizes",
        icon: "pi pi-fw pi-id-card",
        to: "/sizes",
      },
      {
        label: "Tags",
        icon: "pi pi-fw pi-id-card",
        to: "/tags",
      },
      {
        label: "Colors",
        icon: "pi pi-fw pi-id-card",
        to: "/colors",
      },
      {
        label: "Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/categories",
      },
      {
        label: "Subcategories",
        icon: "pi pi-fw pi-id-card",
        to: "/subcategories",
      },
    ],
  },
  {
    label: "Design Studio",
    items: [
      {
        label: "Manage Cliparts",
        icon: "pi pi-fw pi-eye",
        to: "/blocks",
        badge: "NEW",
      },
      {
        label: "Ink Colors",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
      {
        label: "Fonts",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
      {
        label: "Designs",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
      {
        label: "Template Designs",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
    ],
  },
  {
    label: "Embroidery Section",
    items: [
      {
        label: "Cliparts",
        icon: "pi pi-fw pi-eye",
        to: "/blocks",
        badge: "NEW",
      },
      {
        label: "Templates",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
      {
        label: "Printing Price",
        icon: "pi pi-fw pi-globe",
        url: "https://www.primefaces.org/primeblocks-vue",
        target: "_blank",
      },
    ],
  },
  {
    label: "Associates & Users",
    items: [
      {
        label: "Manage Users",
        icon: "pi pi-fw pi-prime",
        to: "/utilities/icons",
      },
      {
        label: "Manage Associates",
        icon: "pi pi-fw pi-desktop",
        url: "https://www.primefaces.org/primeflex/",
        target: "_blank",
      },
      {
        label: "Manage Roles",
        icon: "pi pi-fw pi-desktop",
        url: "https://www.primefaces.org/primeflex/",
        target: "_blank",
      },
    ],
  },
  {
    label: "Manage Pages",
    icon: "pi pi-fw pi-briefcase",
    to: "/pages",
    items: [
      {
        label: "Pages",
        icon: "pi pi-fw pi-circle-off",
        to: "/empty",
      },
      {
        label: "Page Components",
        icon: "pi pi-fw pi-circle-off",
        to: "/empty",
      },
      {
        label: "Post",
        icon: "pi pi-fw pi-circle-off",
        to: "/empty",
      },
      {
        label: "Comments",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/notfound",
      },
    ],
  },
  {
    label: "Manage Media",
    icon: "pi pi-fw pi-briefcase",
    to: "/pages",
    items: [
      {
        label: "Gallery",
        icon: "pi pi-fw pi-calendar",
        to: "/timeline",
      },
      {
        label: "Media",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/notfound",
      },
    ],
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-briefcase",
    to: "/pages",
    items: [
      {
        label: "Newsletters",
        icon: "pi pi-fw pi-globe",
        to: "/landing",
      },
      {
        label: "Store Designs",
        icon: "pi pi-fw pi-user",
      },
      {
        label: "History Record",
        icon: "pi pi-fw pi-pencil",
        to: "/crud",
      },
      {
        label: "Reserved Words",
        icon: "pi pi-fw pi-calendar",
        to: "/timeline",
      },
      {
        label: "Appearance",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/notfound",
      },
      {
        label: "Settings",
        icon: "pi pi-fw pi-circle-off",
        to: "/empty",
      },
    ],
  },
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
    <!-- <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li> -->
  </ul>
</template>

<style lang="scss" scoped></style>
