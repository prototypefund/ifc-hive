/**
  Temporary page to allow for project selection. 
  This might grow in the global user dashboard
 */
<template>
  <v-container>
    <v-sheet width="300" class="mx-auto" v-if="projects.length > 0">
      <v-form ref="form">
        <v-list>
          <v-list-item v-for="project in projects" :key="project._id">
            <v-btn @click="setProjectId(project._id)">{{ project.title }}</v-btn>
          </v-list-item>
        </v-list>
      </v-form>
    </v-sheet>
  </v-container>
</template>
<script>
import log from '@lib/logger.js'
export default {
  data: () => ({
    selectedProject: false,
    projects: [],
  }),

  inject: ['$api', '$store'],
  mounted() {
    this.loadProjectData()
  },
  methods: {
    setProjectId(projectId) {
      //TODO find out why this fucks up everything

      this.$store.dispatch({ type: 'project/setId', payload: projectId })
      this.$router.push({
        name: 'app.project.index',
        params: {
          projectId: projectId
        },
      })
    },

    async loadProjectData() {
      this.$api.get('/core/projects').then((res) => {
        // early return if there are no data for us
        if (!res.data.projects || res.data.projects.length < 1) return
        log.socket('project/list', res)
        // handle projects for usage and save to store
        const projectList = []
        // TODO remove lookup once the slots in v-select work properly for direct
        // referencation of data items from data store
        const projectLookup = {}
        res.data.projects.forEach(project => {
          projectList.push(project._id)
          projectLookup[project._id] = project
          delete projectLookup[project._id].config
        })
        this.projects = res.data.projects
        // add project
        this.$store.dispatch({ type: 'project/addlist', payload: projectList })
        // TODO REMOVE LOOKUP
        this.$store.dispatch({ type: 'project/addlookup', payload: projectLookup })
      })


    },
  },
}
</script>
