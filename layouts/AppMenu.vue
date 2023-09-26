<script setup>
import { ref } from "vue";
import AppMenuItem from "./AppMenuItem.vue";
const model = ref([
  {
    label: "General",
    items: [{ label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" }],
  },
  {
    label: "Sales & Marketing",
    items: [
      // {
      //   label: "Sales",
      //   icon: "pi pi-fw pi-wallet",
      //   to: "/general/sales",
      // },
      // {
      //   label: "Ship Station Orders",
      //   icon: "pi pi-fw pi-truck",
      //   to: "/general/ship-station-orders",
      // },
      {
        label: "Promo Code",
        icon: "pi pi-fw pi-tag",
        to: "/marketing/promo-codes",
      },
    ],
  },
  {
    label: "Home Section",
    items: [
      {
        label: "Manage Sections",
        icon: "pi pi-fw pi-id-card",
        to: "/home/sections",
      },
    ],
  },
  {
    label: "Products Section",
    items: [
      {
        label: "Products",
        icon: "pi pi-fw pi-id-card",
        to: "/product",
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
      {
        label: "Brands",
        icon: "pi pi-fw pi-id-card",
        to: "/brands",
      },
      {
        label: "Fabrics",
        icon: "pi pi-fw pi-id-card",
        to: "/fabrics",
      },
      {
        label: "Colors",
        icon: "pi pi-fw pi-id-card",
        to: "/colors",
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
      // {
      //   label: "Sides",
      //   icon: "pi pi-fw pi-id-card",
      //   to: "/dummy",
      // },
      // {
      //   label: "Price Table",
      //   icon: "pi pi-fw pi-id-card",
      //   to: "/dummy",
      // },
    ],
  },
  {
    label: "Design Studio",
    items: [
      // {
      //   label: "Manage Cliparts",
      //   icon: "pi pi-fw pi-eye",
      //   to: "/dummy",
      //   badge: "NEW",
      // },
      // {
      //   label: "Ink Colors",
      //   icon: "pi pi-fw pi-globe",
      //   url: "https://www.primefaces.org/primeblocks-vue",
      //   target: "_blank",
      // },
      {
        label: "Font Categories",
        icon: "pi pi-fw pi-globe",
        to: "/fonts/categories",
      },
      {
        label: "Fonts",
        icon: "pi pi-fw pi-globe",
        to: "/fonts",
      },
      // {
      //   label: "Designs",
      //   icon: "pi pi-fw pi-globe",
      //   url: "https://www.primefaces.org/primeblocks-vue",
      //   target: "_blank",
      // },
      // {
      //   label: "Template Designs",
      //   icon: "pi pi-fw pi-globe",
      //   url: "https://www.primefaces.org/primeblocks-vue",
      //   target: "_blank",
      // },
    ],
  },
  // {
  //   label: "Embroidery Section",
  //   items: [
  //     {
  //       label: "Cliparts",
  //       icon: "pi pi-fw pi-eye",
  //       to: "/dummy",
  //       badge: "NEW",
  //     },
  //     {
  //       label: "Templates",
  //       icon: "pi pi-fw pi-globe",
  //       url: "https://www.primefaces.org/primeblocks-vue",
  //       target: "_blank",
  //     },
  //     {
  //       label: "Printing Price",
  //       icon: "pi pi-fw pi-globe",
  //       url: "https://www.primefaces.org/primeblocks-vue",
  //       target: "_blank",
  //     },
  //   ],
  // },
  {
    label: "Associates & Users",
    items: [
      // {
      //   label: "Manage Users",
      //   icon: "pi pi-fw pi-prime",
      //   to: "/dummy",
      // },
      {
        label: "Manage Associates",
        icon: "pi pi-fw pi-desktop",
        to: "/associates",
      },
      {
        label: "Manage Customers",
        icon: "pi pi-fw pi-desktop",
        to: "/customers",
      },
      {
        label: "Manage Roles",
        icon: "pi pi-fw pi-desktop",
        to: "/roles",
      },
    ],
  },
  {
    label: "Manage Pages",
    icon: "pi pi-fw pi-briefcase",
    // items: [
    //   {
    //     label: "Pages",
    //     icon: "pi pi-fw pi-circle-off",
    //     to: "/dummy",
    //   },
    //   {
    //     label: "Page Components",
    //     icon: "pi pi-fw pi-circle-off",
    //     to: "/dummy",
    //   },
    //   {
    //     label: "Comments",
    //     icon: "pi pi-fw pi-exclamation-circle",
    //     to: "/dummy",
    //   },
    // ],
  },
  // {
  //   label: "Settings",
  //   icon: "pi pi-fw pi-briefcase",
  //   items: [
  //     {
  //       label: "Media",
  //       icon: "pi pi-fw pi-exclamation-circle",
  //       to: "/dummy",
  //     },
  //     {
  //       label: "Analytics",
  //       icon: "pi pi-fw pi-circle-off",
  //       to: "/dummy",
  //     },
  //     {
  //       label: "Settings",
  //       icon: "pi pi-fw pi-circle-off",
  //       to: "/dummy",
  //     },
  //   ],
  // },
  // {
  //   label: "Documentation",
  //   icon: "pi pi-fw pi-briefcase",
  //   items: [
  //     {
  //       label: "API Documentation",
  //       icon: "pi pi-fw pi-globe",
  //       url: "http://localhost:8000/api/documentation#/default",
  //       target: "_blank",
  //     },
  //   ],
  // },
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
