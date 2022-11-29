<template>
    <v-app-bar density="compact" flat color="grey-lighten-2" class="toolBar" data-test-container="utils/toolbar/default"
        v-if="state">
        <v-toolbar-title>{{ $t("widgets.tools.title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-tabs density="compact" v-model="currentTool" fixed-tabs>
            <v-tab class="closeBtnWrapper active" :class="{ 'theFalseForMyRight': currentTool === false }"
                :value="false">
                <v-btn variant="icon" icon="mdi-chevron-right" @click.stop="currentTool = false" />
            </v-tab>
            <template v-for="(tool, key) in state">
                <v-tab :class="{ 'active': currentTool === key }" v-if="checkVisibility(tool)" :value="key">
                    <span>{{ $t('widgets.' + tool.title) }} </span>
                    <v-icon v-if="currentTool === key">{{ tool.iconActive }}</v-icon>
                    <v-icon v-else>{{ tool.icon }}</v-icon>
                </v-tab>
            </template>
        </v-tabs>
    </v-app-bar>

    <v-container v-if="currentTool && currentComponent" fluid class="toolContent primary"
        :style="{ height: viewPortHeight + 'px' }">
        <v-slide-x-reverse-transition>
            <component :is="currentComponent" :uuid="currentTool" :props="state[currentTool].widget.props || {}"
                class="toolComponentWrapper">
            </component>
        </v-slide-x-reverse-transition>
    </v-container>
</template>
<script>
import { defineAsyncComponent } from 'vue'
import toolLoader from "@lib/toolLoader";
export default {
    inject: ["$api", "$store"],
    data: () => ({
        state: {},
        route: {},
        viewPortHeight: 0,
        currentComponent: false,
        currTool: false,
        stateSubscriber$: false,
        routeSubscriber$: false,
        currentToolSubscriber$: false,
    }),
    computed: {
        currentTool: {
            get() {
                return this.currTool
            },
            set(newValue) {
                if (this.currTool !== newValue) {
                    this.$store.dispatch({
                        type: 'ui/update',
                        payload: {
                            currentTool: newValue
                        }
                    });
                } else {
                    this.$store.dispatch({
                        type: 'ui/update',
                        payload: {
                            currentTool: false
                        }
                    });
                }

            }
        }
    },
    created() {
        this.stateSubscriber$ = this.$store
            .select((state) => state.toolbar)
            .subscribe((val) => {
                this.state = val;
            });
        this.routeSubscriber$ = this.$store
            .select((state) => state.route)
            .subscribe((val) => {
                this.route = val;
            });
        this.currentToolSubscriber$ = this.$store
            .select((state) => state.ui.currentTool)
            .subscribe((val) => {
                if (val !== this.currTool) {
                    this.currTool = val
                    this.activateTool(val)
                }
            });
        this.setHeight()
        window.addEventListener('resize', this.setHeight, { passive: true })
    },
    destroyed() {
        this.stateSubscriber$.unsubscribe()
        this.routeSubscriber$.unsubscribe()
        this.currentToolSubscriber$.unsubscribe()
        window.removeEventListener('resize', this.setHeight, { passive: true })
    },
    methods: {
        setHeight() {
            this.viewPortHeight = window.innerHeight - 96
        },
        activateTool(name) {
            if (name) {
                this.currentComponent = defineAsyncComponent(() => {
                    return toolLoader(this.state[name].widget.name, this.state[name].widget.type, this.state[name].widget.face);
                })
            }
        },
        checkVisibility(tool) {
            // if we have no page set to this tool or page set matches current route name we are good to go!
            if (!tool.page || tool.page === this.route.name) {
                return true
            }
            if (this.currentTool === tool.widget.uuid) {
                // if the currentTool is not visible on this page, remove currentTool
                this.currentTool = false
            }
            return false
        }
    },
};
</script>
<style lang="css" scoped>
.active {
    background-color: #9E9E9E;
    border-bottom: 1px solid #9E9E9E !important;
    height: 100% !important;
}

.theFalseForMyRight {
    display: none;
}



.toolContent {
    position: fixed;
    overflow: auto;
    padding: 0 !important;
    right: 0;
    top: 96px;
    width: 50% !important;
    z-index: 900;
    height: 100%;
    background-color: #fff;
}

.toolContent>.v-row {
    height: 100%;
    width: 100%;
    padding: 0px;
    margin: 0px;
}

.toolComponentWrapper {
    width: 100%;
    height: 100%;
    border-top: 1px solid #9E9E9E !important;
    border: 1px solid #E0E0E0
}
</style>

