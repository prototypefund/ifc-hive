<template>
    <v-card color="grey-lighten-2" :class="{ closed: !quickListRail }" flat class="quickListWrapper">
        <div class="quickListHandler">
            <v-btn v-if="!quickListRail" variant="text" icon="mdi-chevron-left" @click.stop="handleQuicklist(true)">
            </v-btn>
            <v-btn v-if="quickListRail" variant="text" icon="mdi-chevron-right" @click.stop="handleQuicklist(false)">
            </v-btn>
        </div>

        <v-card-title>
            Quicklist
        </v-card-title>
        <v-card-subtitle>

        </v-card-subtitle>
        <v-tabs v-model="tab" center-active v-if="tabs.length > 0">
            <v-tab v-for="(item, index) in tabs" :key="item" @click.middle="closeTab(index)">
                {{ item.type }} - {{ item.docUUID }}
            </v-tab>
        </v-tabs>
        <v-window v-model="tab">
            <v-window-item v-for="(item, index) in tabs" :key="item">
                <Detail v-if="item.type === 'detail'" :props="item.props" />
            </v-window-item>
        </v-window>
    </v-card>
</template>
<script>
import Detail from './types/detail.vue'
export default {
    inject: ['$api', '$store'],
    components: {
        Detail
    },
    data: () => ({
        quickList: true,
        quickListRail: false,
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
            this.quickListRail = val
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
        closeTab(index) {
            this.$store.dispatch({
                type: 'quickList/delete',
                payload: {
                    tabIndex: index
                }
            });
        },
        handleQuicklist(val) {
            this.$store.dispatch({
                type: 'ui/update',
                payload: {
                    quickListOpen: val
                }
            });

        },
    }
}
</script>
<style>
.quickListWrapper {
    position: fixed !important;
    z-index: 1007;
    right: 0 !important;
    top: 60px;
    width: 50%;
    height: 100%;
    overflow: hidden;
}

.quickListWrapper.closed {
    top: 44px;
    width: 40px;
    height: 30px;
}

.quickListWrapper.closed>.quickListHandler>.v-btn {
    height: 100% !important;
}
</style>

