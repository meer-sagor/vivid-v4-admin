<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const model = ref([
  {
    label: "General",
    items: [
      { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
      {
        label: "Sales",
        icon: "pi pi-fw pi-wallet",
        to: "/general/sales",
      },
      {
        label: "Ship Station Orders",
        icon: "pi pi-fw pi-truck",
        to: "/general/ship-station-orders",
      },
      {
        label: "Department",
        icon: "pi pi-fw pi-sitemap",
        to: "/general/departments",
      },
      {
        label: "Promo Code",
        icon: "pi pi-fw pi-tag",
        to: "/general/promo-code",
      },
    ],
  },
  {
    label: "Home Section",
    items: [
      {
        label: "Home Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/home/categories",
      },
      {
        label: "Top Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/home/top-categories",
      },
      {
        label: "Home Products",
        icon: "pi pi-fw pi-id-card",
        to: "/home/products",
      },
      {
        label: "Custom Printing",
        icon: "pi pi-fw pi-id-card",
        to: "/home/custom-printing",
      },
      {
        label: "Embroidery",
        icon: "pi pi-fw pi-id-card",
        to: "/home/embroidery",
      },
    ],
  },
  {
    label: "Products Section",
    items: [
      {
        label: "Manage Products",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Categories",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Brands",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Colors",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Sizes",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Print Sides",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
      },
      {
        label: "Printing Price",
        icon: "pi pi-fw pi-id-card",
        to: "/dummy",
        items: [
          {
            label: "Price Table",
            icon: "pi pi-fw pi-id-card",
            to: "/dummy",
          },
          {
            label: "Price Dscount Table",
            icon: "pi pi-fw pi-id-card",
            to: "/dummy",
          },
          {
            label: "Pricing Personalize Table",
            icon: "pi pi-fw pi-id-card",
            to: "/dummy",
          },
        ],
      },
    ],
  },
  {
    label: "Design Studio",
    items: [
      {
        label: "Manage Cliparts",
        icon: "pi pi-fw pi-eye",
        to: "/dummy",
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
        to: "/dummy",
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
        to: "/dummy",
      },
      {
        label: "Manage Associates",
        icon: "pi pi-fw pi-desktop",
        to: "/dummy",
      },
      {
        label: "Manage Roles",
        icon: "pi pi-fw pi-desktop",
        to: "/dummy",
      },
    ],
  },
  {
    label: "Manage Pages",
    icon: "pi pi-fw pi-briefcase",
    items: [
      {
        label: "Pages",
        icon: "pi pi-fw pi-circle-off",
        to: "/dummy",
      },
      {
        label: "Page Components",
        icon: "pi pi-fw pi-circle-off",
        to: "/dummy",
      },
      {
        label: "Post",
        icon: "pi pi-fw pi-circle-off",
        to: "/dummy",
      },
      {
        label: "Comments",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/dummy",
      },
    ],
  },
  {
    label: "Manage Media",
    icon: "pi pi-fw pi-briefcase",
    items: [
      {
        label: "Gallery",
        icon: "pi pi-fw pi-calendar",
        to: "/dummy",
      },
      {
        label: "Media",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/dummy",
      },
    ],
  },
  {
    label: "Settings",
    icon: "pi pi-fw pi-briefcase",
    items: [
      {
        label: "Newsletters",
        icon: "pi pi-fw pi-globe",
        to: "/dummy",
      },
      {
        label: "Store Designs",
        icon: "pi pi-fw pi-user",
        to: "/dummy",
      },
      {
        label: "History Record",
        icon: "pi pi-fw pi-pencil",
        to: "/dummy",
      },
      {
        label: "Reserved Words",
        icon: "pi pi-fw pi-calendar",
        to: "/dummy",
      },
      {
        label: "Appearance",
        icon: "pi pi-fw pi-exclamation-circle",
        to: "/dummy",
      },
      {
        label: "Settings",
        icon: "pi pi-fw pi-circle-off",
        to: "/dummy",
      },
    ],
  },
  {
    label: "Documentation",
    icon: "pi pi-fw pi-briefcase",
    items: [
      {
        label: "API Documentation",
        icon: "pi pi-fw pi-globe",
        url: "http://localhost:8000/api/documentation#/default",
        target: "_blank",
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
