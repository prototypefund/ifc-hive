<template>
    <v-card :color="column.color" v-if="column">
        <v-card-title>{{ column.title }}</v-card-title>
        <v-card v-for="(item, i) in column.tickets" :key="i">
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle v-if="(item.tags && item.tags.length > 0)">
                <v-chip v-for="tag in item.tags"
                    :color="(data[tag] ? data[tag].color || 'grey' : 'grey')">{{ tag }}</v-chip>
            </v-card-subtitle>
            <v-card-text>
                text
            </v-card-text>
        </v-card>
    </v-card>
</template>
<script setup>
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
    }
});

</script>
