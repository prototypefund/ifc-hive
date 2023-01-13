// uppy js
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";

export const uppyInstances = {}
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