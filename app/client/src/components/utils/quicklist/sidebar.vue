<template>
    <v-navigation-drawer permanent location="right" v-model="quickList" :rail="quickListRail">
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
        <v-card>
            <v-tabs v-model="tab" center-active v-if="tabs.length > 0">
                <v-tab v-for="(item, index) in tabs" :key="index">
                    {{ item.type }} - {{ item.docUUID }}
                </v-tab>
            </v-tabs>
            <v-window v-model="tab">
                <v-window-item v-for="(item, index) in tabs">
                    {{ item }}
                </v-window-item>
            </v-window>
        </v-card>
    </v-navigation-drawer>
</template>
<script>
export default {
    inject: ['$api', '$store'],
    data: () => ({
        quickList: true,
        quickListRail: true,
        tabs: [],
        currStateTab: 0,
    }),
    computed: {
        tab: {
            get: function () {
                return this.currStateTab || 0
            },
            set: function (newValue) {
                this.$store.dispatch({
                    type: 'quickList/update',
                    payload: {
                        tab: newValue
                    }
                });
            }
        }
    },
    created() {
        this.$store.select(state => state['ui'].quickListOpen).subscribe((val) => {
            this.quickListRail = !val
        })
        this.$store.select(state => state['quickList'].tabs).subscribe((val) => {
            this.tabs = val
            console.dir(val)
        })
        this.$store.select(state => state['quickList'].tab).subscribe((val) => {
            this.currStateTab = val
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
</style>

