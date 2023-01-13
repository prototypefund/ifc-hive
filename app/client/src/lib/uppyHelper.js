// uppy js
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
/*
 * uppyInstances
 * a key value store containing all uppy instances we created sorted by their corresponding uuid which should always be the uuid of the creating widget instance
 */
export const uppyInstances = {}
/*
 * uppyBakery
 * @param { string } uuid, the uuid for the uppy instance. This should always be the uuid of the widget instance creating the uppy instance
 * @param { object } conf, an object containing the uppy options in conf.optionsUppy as well as the conf.fileMeta and conf.optionsXhrUpload
 *
 * get a config file for a given widget and configure its state
 */
export const uppyBakery = function (uuid, conf) {
    if (uppyInstances[uuid]) {
        return uppyInstances[uuid]
    }
    // TODO implement all possible config values visit: https://uppy.io/docs/uppy/
    console.warn("add meta info for image uploads per widget instance");

    const uppyInstance = new Uppy({
        id: uuid,
        ...conf.optionsUppy,
    });


    if (conf.optionsXhrUpload) {
        uppyInstance.use(XHRUpload, { id: uuid, ...conf.optionsXhrUpload });
    }
    if (conf.fileMeta) {
        uppyInstance.on("file-added", (file) => {
            uppyInstance.setFileMeta(file.id, conf.fileMeta);
        });
    }
    uppyInstances[uuid] = uppyInstance
    return uppyInstance
}