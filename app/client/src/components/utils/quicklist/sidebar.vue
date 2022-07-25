<template>
    <v-navigation-drawer v-model="quickList" :rail="quickListRail" id="quickListDrawer" absolute=true
        v-if="tabs.length > 0">
        <!-- Title -->
        <v-list-item title="QuickList" value="QuickList">
            <!-- Close icon -->
            <template v-slot:append>
                <v-btn v-if="!quickListRail" variant="text" icon="mdi-chevron-right"
                    @click.stop="handleQuicklist(true)">
                </v-btn>

                <!-- open icon -->
                <v-btn v-if="quickListRail" variant="text" icon="mdi-chevron-left" @click.stop="handleQuicklist(false)">
                </v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Navigation List -->
        {{ tabs }}
    </v-navigation-drawer>

</template>
<script>
export default {
    inject: ['$api', '$store'],
    data: () => ({
        quickList: true,
        quickListRail: true,
        tabs: []
    }),
    created() {
        this.$store.select(state => state['ui'].quickListOpen).subscribe((val) => {
            this.quickListRail = !val
        })
        this.$store.select(state => state['quickList'].tabs).subscribe((val) => {
            this.tabs = val
        })
    },
    methods: {
        handleQuicklist(val) {
            if (val !== this.quickListRail) {
                this.$store.dispatch({
                    type: 'ui/update',
                    payload: {
                        quickListOpen: !val
                    }
                });
            }

        },
    }
}
</script>
<style>
#quickListDrawer {
    right: 0 !important;
    left: auto !important;
}
</style>

