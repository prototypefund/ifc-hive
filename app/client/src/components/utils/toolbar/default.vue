<template>
    <v-toolbar flat density="compact" class="toolBar" data-test-container="utils/tools/toolbar" v-if="state">
        <v-toolbar-title>{{ $t("widgets.tools.title") }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <span v-for="(tool, key) in state" :class="{ 'active': currentTool === key }">
            <v-btn @click="setCurrentTool(currentTool === key ? false : key)" v-if="checkVisibility(tool)" color>
                <span>{{ $t('tools.' + tool.title) }} </span>
                <v-icon v-if="currentTool === key">{{ tool.iconActive }}</v-icon>
                <v-icon v-else>{{ tool.icon }}</v-icon>
            </v-btn>
        </span>


    </v-toolbar>

    <v-container v-if="currentTool && currentComponent" class="toolContent">
        <v-slide-x-reverse-transition>
            <component :is="currentComponent" :uuid="currentTool" :props="state[currentTool].widget.props || {}">
            </component>
        </v-slide-x-reverse-transition>
        <!--component v-bind:is="currentTool"></!--component-->
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
        currentTool: false,
        currentComponent: false,
        stateSubscriber$: false,
        routeSubscriber$: false,
        currentToolSubscriber$: false,
    }),
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
                this.currentTool = val
                this.activateTool(val)
            });
    },
    destroyed() {
        this.stateSubscriber$.unsubscribe()
        this.routeSubscriber$.unsubscribe()
        this.currentToolSubscriber$.unsubscribe()
    },
    methods: {
        setCurrentTool(name) {
            this.$store.dispatch({
                type: 'ui/update',
                payload: {
                    currentTool: name
                }
            });
        },
        activateTool(name) {
            if (!name) {
                this.currentTool = false
                this.currentComponent = false
            } else {
                this.currentComponent = defineAsyncComponent(() => {
                    return toolLoader(this.state[this.currentTool].widget.name, this.state[this.currentTool].widget.type, this.state[this.currentTool].widget.face);
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
.toolBar {
    margin-top: 48px;
    margin-left: 48px
}

.active {
    background-color: #9E9E9E;
    border-bottom: 1px solid #9E9E9E !important;
    height: 100% !important;
}

.toolContent {
    position: absolute;
    padding: 0 !important;
    right: 0;
    top: 96px;
    width: 50% !important;
    background-color: #fff;
    z-index: 900;
    border: 1px solid #E0E0E0;
    border-top: 1px solid #9E9E9E !important;
}
</style>

