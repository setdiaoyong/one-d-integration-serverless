import { Controller, VDOM, History, Url } from 'cx/ui';
const axios = require('axios');
var moment = require('moment');

export default class extends Controller {
    onInit() { 
        this.store.init('$page', {
            filter: {
                page: 1,
                pageSize: 20,
                pageCount: 10
            }
        });
        console.log("aaaa",this.store.get('$page.data'))
        this.addTrigger('load', ['$page.filter'], this.load.bind(this), true)
    }

    load() {
        let { pageSize, page } = this.store.get('$page.filter');
        page = page -1
        axios.get('http://localhost:3001/hello')
                .then((resp) => {      
                      let it =  resp.data.message.value.map(item => (
                        { 
                        downloadUrl: item["@microsoft.graph.downloadUrl"],
                        id: item.id, 
                        icon: item.name,
                        name: item.name,
                        folder: item.folder,
                        description: item.description,
                        size: this.convertBytes(item.size),
                        parentReference: {
                            name: item.parentReference.name || 'root'
                        },
                        createdBy: {
                            user: { 
                                displayName: item.createdBy.user.displayName
                            }
                        },
                        webUrl: item.webUrl, 
                        createdDateTime: moment(item.createdDateTime).format('DD/MM/YYYY'),
                        lastModifiedDateTime: item.lastModifiedDateTime,
                        // item.lastModifiedDateTime,
                        lastModifiedDateTimeFormatted: moment(item.lastModifiedDateTime).fromNow()
                        })      
                    )
                    this.store.set('$page.dataAll', it)            //populate the grid with the data receiven from the API on initialization
                    this.store.set('$page.data', it.slice(page * pageSize, (page + 1) * pageSize))  
                })
                .catch((err) => {
                    console.log("ERROR", err);
                })
        // this.store.set('$page.data', Array.from({length: pageSize}, it));
    }
 convertBytes (item){
        if (item > 1e6){
            let a = item/(1048576);
            let b = ""
            b = b + a
            b = b.substr(0,4)
            return b + " MB"
        }
        else
            {
            let a = item/(1024);
            let b = ""
            b = b + a
            b = b.substr(0,5)
            return b + " KB"
        }
    }
 }  