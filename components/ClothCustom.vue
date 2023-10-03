<script setup>
    const dropdownValues = ref([
        { name: 'Font Side', code: 'FS' },
        { name: 'Back Side', code: 'BS' },
        { name: 'Left Side', code: 'LS' },
        { name: 'Right Side', code: 'RS' },
    ]);
    const dropdownValue = ref(null);
    const checkboxValue1 = ref([]);
    const checkboxValue2 = ref([]);
    const checkboxValue3 = ref([]);
    const checkboxValue4 = ref([]);
    const checkboxValue5 = ref([]);
    const checkboxValue6 = ref([]);
</script>

<template>
   <div class="grid p-fluid">
        <div class="col-12 md:col-12">
            <h4 class='mb-0'>Print Area</h4>
        </div>
        <div class="col-12 md:col-5">
            <div class="card p-3">
                <h5>Select Side</h5>
                <Dropdown v-model="dropdownValue" :options="dropdownValues" optionLabel="name" placeholder="Select" />
            </div>
            <div class="card p-3">
                <h5>Position Size</h5>
                <div class="flex mb-3">
                    <div class='col-6 card-item'>
                        <InputText type="text" placeholder="Width" v-model="width"></InputText>
                    </div>
                    
                    <div class='col-6 card-item'>
                        <InputText type="text" placeholder="Height" v-model="height"></InputText>
                    </div>
                </div>
                <div class="flex mb-3">
                    <div class='col-6 card-item'>
                        <InputText type="text" placeholder="Left" v-model="left"></InputText>
                    </div>
                    
                    <div class='col-6 card-item'>
                        <InputText type="text" placeholder="Top" v-model="top"></InputText>
                    </div>
                </div>
                <div class="flex mb-3">
                    <div class='col-4 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue1"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Center</label></div>
                        </div>
                    </div>
                    
                    <div class='col-4 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue2"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Adult</label></div>
                        </div>
                    </div>

                    <div class='col-4 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue3"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Youth</label></div>
                        </div>
                    </div>
                </div>
                <div class="flex mb-3">
                    <div class='col-4 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue4"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Chest</label></div>
                        </div>
                    </div>
                    <div class='col-4 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue5"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Embroidery</label></div>
                        </div>
                    </div>
                    <div class='col-6 card-item'>
                        <div class="field-checkbox mb-0">
                            <Checkbox
                            id="checkOption1"
                            v-model="checkboxValue6"
                            name="option"
                            value="Chicago"
                            />
                            <div class='mx-2'><label>Enabled</label></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 md:col-7">
            <div class="card">
                <div class="canvas-customs-section">
                    <div class='canvas-print-data' 
                        style='position: absolute;
                        top: 30%;
                        left: 25%;
                        width: 26%;
                        height: 50%;
                        border: 1px solid;'>
                        <div class="todo-container">
                            <slot>
                                <div class="canvas-print-text todo-item">
                                    {{ addText }}
                                </div>
                            </slot>
                        </div>
                       
                    </div>
                    <img
                        src="http://3.15.163.57:3001/img/product/Hanes/42BA/42ba_ltsteel-navy_back.jpg"
                        alt=""
                        class='canvas-main-img'
                    />
                </div>
            </div>
        </div>
  </div>
</template>

<style scoped lang="scss">
    .canvas-customs-section {
        position: relative;
        height: 500px;
        .canvas-main-img {
            width: auto;
            height: 100%;
        }
    }

</style>
