<template>
    <v-container v-if="contents">
        <v-row no-gutters>
            <v-col :class="getSlotClass(contents['0'])">
                <v-card class="pa-2 ma-2" v-if="contents['0']">
                    <component0 v-if="contents['0'].widget" :uuid="contents['0'].widget.uuid"
                        :props="contents['0'].widget.props || {}" />
                </v-card>
            </v-col>

            <v-col :class="getSlotClass(contents['1'])">
                <v-card class="pa-2 ma-2" v-if="contents['1']">
                    <component1 v-if="contents['1'].widget" :uuid="contents['1'].widget.uuid"
                        :props="contents['1'].widget.props || {}" />
                </v-card>
            </v-col>

            <v-col :class="getSlotClass(contents['2'])">
                <v-card class="pa-2 ma-2" v-if="contents['2']">
                    <component2 v-if="contents['2'].widget" :uuid="contents['2'].widget.uuid"
                        :props="contents['2'].widget.props || {}" />
                </v-card>
            </v-col>
        </v-row>

    </v-container>
</template>
<script setup>
import { onMounted, defineAsyncComponent, shallowRef } from 'vue'
//TODO find a generic way to add yet unknown components to vue component instance
const component0 = shallowRef({})
const component1 = shallowRef({})
const component2 = shallowRef({})
const props = defineProps({
    contents: {
        type: Object,
        required: true
    }
})
const loadWidget = (name) => defineAsyncComponent(() => {
    //TODO find out why vite alias dont work. Add try catch here
    return import(`../../widgets/${name}/default.vue`)
})
onMounted(() => {
    if (props.contents) {
        props.contents.forEach(content => {
            if (!content.widget) return
            switch (content.widget.slot) {
                //TODO find a generic way to add yet unknown components to vue component instance
                case 0:
                    component0.value = loadWidget(content.widget.name)
                    break;
                case 1:
                    component1.value = loadWidget(content.widget.name)
                    break;
                case 2:
                    component2.value = loadWidget(content.widget.name)
                    break;
            }
        })
    } else {
        debugger
    }
})


const getSlotClass = (slot) => {
    if (!slot) return ''
    return slot && slot.class ? slot.class : ''
}

</script>