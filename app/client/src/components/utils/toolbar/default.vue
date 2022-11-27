<template>
    <v-toolbar flat density="compact" class="toolBar" data-test-container="utils/tools/toolbar" v-if="state">
        <v-toolbar-title>{{ $t("widgets.tools.title") }}</v-toolbar-title>

        <span v-for="(tool, key) in state">
            <v-btn @click="activateTool(key, tool)" v-if="checkVisibility(tool)" color>
                <span>{{ $t('tools.' + tool.title) }} </span>
                <v-icon v-if="currentTool === key">{{ tool.iconActive }}</v-icon>
                <v-icon v-else>{{ tool.icon }}</v-icon>
            </v-btn>
        </span>
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-container v-if="currentTool && currentComponent" class="toolContent">
        <component :is="currentComponent" uuid="quickList" :dataUUID="state[currentTool].widget.uuid"
            :props="state[currentTool].widget.props || {}"></component>
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
        currentComponent: false
    }),
    created() {
        this.$store
            .select((state) => state.toolbar)
            .subscribe((val) => {
                this.state = val;
            });
        this.$store
            .select((state) => state.route)
            .subscribe((val) => {
                this.route = val;
            });
        this.$store
            .select((state) => state.ui.currentTool)
            .subscribe((val) => {
                this.activateTool(val)
            });
    },
    methods: {
        activateTool(name, tool) {
            if (this.currentTool === name) {
                this.currentTool = false
                this.currentComponent = false
            } else {
                this.currentTool = name
                this.currentComponent = defineAsyncComponent(() => {
                    return toolLoader(this.state[this.currentTool].widget.name, this.state[this.currentTool].widget.type, this.state[this.currentTool].widget.face);
                });
            }
        },
        checkVisibility(tool) {
            // if we have no page set to this tool or page set matches current route name we are good to go!
            if (!tool.page || tool.page === this.route.name) {
                return true
            }
            if (this.currentTool === tool.name) {
                // if the currentTool is not visible on this page, remove currentTool
                this.currentTool = false
            }
            return false
        }
    },
};
</script>
<style lang="css">
.toolBar {
    margin-top: 48px;
    margin-left: 48px
}

.toolContent {
    position: absolute;
    padding: 0 !important;
    right: 0;
    top: 95px;
    width: 50% !important;
    z-index: 900;
    border: 1px solid #E0E0E0
}
</style>

