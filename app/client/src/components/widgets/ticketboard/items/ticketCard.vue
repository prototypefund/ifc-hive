<template>
    <v-card :color="column.color" v-if="column" class="ticketWrapperCard" prepend-icon="mdi-drag" height="100%"
        data-test-container="widgets/ticketboard/items/ticketCard" :data-test-container-uuid="props.uuid">
        <template v-slot:title>
            {{ column.title }}
        </template>
        <draggable v-model="sorting" item-key="id" class="list-group" ghost-class="ghost" @start="dragging = true"
            @end="dragging = false" handle=".v-card>.v-card-item>.v-card-item__prepend"
            :group="{ name: 'ticketSort', pull: ['ticketSort'], put: ['ticketSort'] }">
            <template #item="{ element }">
                <v-card prepend-icon="mdi-drag">
                    <template v-slot:title>
                        <QuickListHandler uuid="quickList" :dataUUID="data[element]._id" tab-type="ticket" action="add">
                            {{ data[element]._id }} <v-card-title>{{ data[element].title }}</v-card-title>
                        </QuickListHandler>
                    </template>

                    <v-card-subtitle v-if="(data[element].tags && data[element].tags.length > 0)">
                        <v-chip v-for="tag in data[element].tags"
                            :color="(data[tag] ? data[tag].color || 'grey' : 'grey')">{{ tag }}</v-chip>
                    </v-card-subtitle>
                    <v-card-text>
                        <pre>{{ data[element] }}</pre>
                    </v-card-text>
                </v-card>
            </template>
        </draggable>
    </v-card>
</template>
<script setup>
import QuickListHandler from "@w/quickList/handler.vue";
import { shallowRef, computed, inject } from "vue";
import draggable from 'vuedraggable'
import { difference } from 'ramda'
const dragging = shallowRef(false);

const $store = inject("$store");
const sorting = computed({
    get() {
        return props.sorting;
    },
    set(val) {
        let data = false
        if (props.sorting.length < val.length) {
            // we have to add a tag
            const itemsToUpdate = difference(val, props.sorting)
            data = []
            itemsToUpdate.forEach(dataUuid => {
                props.identifiers.forEach(boardId => {
                    if (props.data[dataUuid].tags) {
                        // our data item has tags, so everything went well here
                        const tagIndex = props.data[dataUuid].tags.indexOf(boardId)
                        if (tagIndex >= 0) {
                            // we found the tag which is the old ticket state, now lets clone it from pops and add it to the dataUpdate object,
                            // remove it and add the new one from this board
                            const dataIndex = data.push(JSON.parse(JSON.stringify(props.data[dataUuid]))) - 1
                            data[dataIndex].tags.splice(tagIndex, 1)
                            // make sure we close or open them. This is hardcoded for now
                            // todo maybe implement this configurable via the generics config 
                            if (props.boardId === 'open') {
                                data[dataIndex].closed = false
                            } else if (props.boardId === 'closed') {
                                data[dataIndex].closed = true
                            }
                            data[dataIndex].tags.push(props.boardId)
                        }
                    } else {
                        console.error("how can we have a ticket state change without a tag field?")
                    }
                })
            })
        } else {

            // we have to remove a tag, but for now we won't do it as the add will do it in the other board
            // console.log('remove for ' + props.boardId)
        }

        $store.dispatch({
            type: "widgets/update",
            uuid: props.uuid,
            payload: {
                filter: {
                    sorting: { [props.boardId]: val }
                }
            },
        });
        if (data) {
            $store.dispatch({
                type: "data/add",
                payload: {
                    data
                },
            });
        }
    },
});
const props = defineProps({
    column: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    data: {
        type: Object,
        required: true,
        default: () => ({}),
    },
    uuid: {
        type: String,
        required: true
    },
    // the id of the ticketboard so that we can find our store target
    boardId: {
        type: String,
        required: true
    },
    sorting: {
        // a list of sorted uuids of our tickets. that's the reference for our rendering
        type: Array,
        required: true
    },
    identifiers: {
        //
        type: Array,
        required: true
    },
});
</script>
<style lang="css">
.ticketWrapperCard {
    height: 100%
}

.ticketWrapperCard .v-card {
    margin: 10px;
}

.ticketWrapperCard .v-card-item__prepend {
    cursor: pointer;
}
</style>
