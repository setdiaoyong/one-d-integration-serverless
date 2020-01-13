import {FlexCol, FlexRow, MsgBox, Section, Pagination, Grid, TextField, TextArea, DateField, PureContainer, Tab, Button, Select, openContextMenu, Menu} from "cx/widgets";
import Controller from "./Controller";
import { LabelsLeftLayout } from "cx/ui"
import {computable} from "cx/data"
var moment = require('moment');                 //  used to format the dates
var JSZip = require("jszip");                   //  used to convert files to zip 
var JSZipUtils = require('jszip-utils')         //  used to download zip files
var FileSaver = require('file-saver')           //  used to save the files downloaded
import { saveAs } from 'file-saver'; 
const axios = require('axios')                  //  used as an http client to perform requests to the back-end 

export default (
    <cx>
        <PureContainer controller={Controller}>
            <h2 putInto="header">Tabs</h2>
            <Section mod="card" style="height: 100%" pad={false}>
                <div style="line-height: 0">
                    <Tab mod="line" value-bind="$page.tab" tab="tab1" default>Search</Tab>
                    <Tab mod="line" value-bind="$page.tab" tab="tab2">Admin Panel</Tab>
                </div>
                <div style="padding: 1rem; border-top: 1px solid lightgray; margin-top: -1px">
                    <div visible-expr="{$page.tab} == 'tab1'">
                    <FlexCol controller={Controller} style="flex: 1 1 0"  spacing="large">
                            <FlexRow spacing>
                                <TextField 
                                    placeholder="Search by description..."
                                    value-bind="$page.text"
                                    text="Documents"
                                    tooltip="This is a description."
                                    showClear
                                />
                                <DateField
                                    placeholder=" Last modified..."
                                    value-bind="$page.date"
                                    format="yyyyMMMMdd"
                                    autoFocus
                                />
                                <Button
                                    onClick={(e, {store}) => {
                                        if(store.get('$page.text') !== null){                                          
                                        let descFilter = store.get('$page.data').filter(sub =>  
                                            ((sub.description.toLowerCase()).includes(store.get('$page.text').toLowerCase()))
                                        ||  ((sub.name.toLowerCase()).includes(store.get('$page.text').toLowerCase()))
                                        ||  ((sub.parentReference.name.toLowerCase()).includes(store.get('$page.text').toLowerCase()))
                                        )
                                        store.set('$page.data', descFilter)         //filters the grid data according to the conditions given in the textfield
                                    }
                                        else if(store.get('$page.date') !== null){
                                            let lastModif = store.get('$page.data').filter(item => 
                                            ((moment(store.get('$page.date'))._i) <= item.lastModifiedDateTime)) 
                                            store.set('$page.data', lastModif)          //filters the grid data according to the conditions given in the datefield
                                            }
                                        else return
                                }}
                                > Search
                                </Button>

                                <Button style={{float: "right"}} mod = "primary" 
                                    onClick={(e, {controller, store}) => { 
                                        let { page, pageSize} = store.get('$page.filter')  
                                        page = page - 1
                                        axios.get('http://localhost:3001/hello')
                                            .then((resp) => {       
                                                let it =  resp.data.message.value.map(item => ({ 
                                                downloadUrl: item["@microsoft.graph.downloadUrl"],
                                                    id: item.id, 
                                                    icon: item.name,
                                                    name: item.name,
                                                    folder: item.folder,
                                                    size: controller.convertBytes(item.size),
                                                    description: item.description,
                                                    parentReference: {
                                                        name: item.parentReference.name || 'root'
                                                    },
                                                    createdBy: {
                                                        user: { 
                                                            displayName: item.createdBy.user.displayName
                                                        }
                                                    },
                                                    webUrl: item.webUrl, 
                                                    createdDateTime: item.createdDateTime,
                                                    lastModifiedDateTime: item.lastModifiedDateTime,
                                                    lastModifiedDateTimeFormatted: moment(item.lastModifiedDateTime).fromNow()
                                                    })        
                                                )
                                                store.set('$page.dataAll', it)
                                                store.set('$page.data', it.slice(page * pageSize, (page + 1) * pageSize))     //  sets the grid data to the default(on init) data
                                            }).catch((error) => {
                                                console.log("ERROR", error);
                                            })
                                            store.set('$page.back', false)
                                }}> Reset </Button>
                            </FlexRow> <br></br>
                        <Grid 
                                records-bind="$page.data"
                                onRowClick={(e, {controller,  store}) => { 
                                    const { id, name, parentReference } = store.get("$record");;
                                    const params = { id, name, parentReference }
                                    store.set("$page.parent", params)
                                    let { page, pageSize} = store.get('$page.filter')  
                                    page = page - 1
                                    if(store.get(`$page.data[${store.itemIndex}].folder`))
                                    {  
                                        if(!store.get(`$page.data[${store.itemIndex}].folder.childCount`) == 0){
                                            axios.post("http://localhost:3001/hello2", params).then((resp) => {
                                                let dd =  resp.data.message.value.map(item => ({
                                                id: item.id, 
                                                icon: item.name,
                                                name: item.name,
                                                folder: item.folder,
                                                size: controller.convertBytes(item.size),
                                                description: item.description,
                                                parentReference: {
                                                    name: item.parentReference.name || 'root',  
                                                    id: item.parentReference.id,
                                                },
                                                createdBy: {
                                                    user: { 
                                                        displayName: item.createdBy.user.displayName
                                                    }
                                                },
                                                webUrl: item.webUrl,
                                                createdDateTime: item.createdDateTime, 
                                                lastModifiedDateTime: item.lastModifiedDateTime,
                                                lastModifiedDateTimeFormatted: moment(item.lastModifiedDateTime).fromNow()   
                                        }))
                                       
                                        store.set('$page.dataAll', dd)
                                        store.set('$page.data', dd.slice(page * pageSize, (page + 1) * pageSize))
                                        })
                                        .catch(err => console.log(err))
                                            store.set('$page.back', true) 
                                        }  
                                        else{ 
                                            MsgBox.yesNo(
                                                { message: "This is an empty folder! Would you like to open "
                                                 + store.get(`$page.data[${store.itemIndex}].name`)
                                                 + " on Microsoft OneDrive? "
                                                })
                                                .then(btn => {
                                                    if (btn == "yes") 
                                                        window.open(store.get(`$page.data[${store.itemIndex}].webUrl`));
                                                    })
                                            }
                                    }
                                    else  MsgBox.yesNo(
                                        { message: "Would you like to open "
                                         + store.get(`$page.data[${store.itemIndex}].name`)
                                         + " on Microsoft OneDrive? "
                                        })
                                        .then(btn => {
                                            if (btn == "yes") 
                                                window.open(store.get(`$page.data[${store.itemIndex}].webUrl`));
                                        })
                                    }
                                }

                                onRowContextMenu = { (e, {store}) => openContextMenu(e, 
                                    <cx>
                                        <Menu>
                                            <a href="#" onClick={() => window.open(store.get(`$page.data[${store.itemIndex}].webUrl`))}>Open in OneDrive</a>
                                            <a onClick={()=>
                                                {
                                                    store.set('$page.modify', store.get('$record.description'))
                                                    MsgBox.yesNo({
                                                        store,
                                                        items: (
                                                            <cx>
                                                                <TextField
                                                                    value-bind='$page.modify'
                                                                    style={{ width: "100%" }}
                                                                    placeholder="Type the new description..."
                                                                />
                                                            </cx>
                                                    )
                                                }).then(btn => {
                                                    if (btn == "yes" ) { 
                                                        console.log("UPDATED", store.get('$page.modify'))
                                                        const { id } = store.get('$record')
                                                        const { modify } = store.get('$page')
                                                        const params = { id, modify }
                                                        console.log(params)
                                                        axios.post("http://localhost:3001/hello4", params).then((resp) => console.log("abc",resp))
                                                    }
                                                }) 
                                               
                                            }
                                            }>Modify Description</a>
                                            <a onClick={()=> {
                                                if(store.get(`$page.data[${store.itemIndex}].folder`))
                                                MsgBox.alert({message: "This is a folder!"})
                                                else {var zip = new JSZip();
                                                axios.get("http://localhost:3001/hello").then(()=> {
                                                    const urlToPromise = url => {
                                                        return new Promise((resolve, reject) => {
                                                            JSZipUtils.getBinaryContent(url,(err, data) => {
                                                                if(err) {
                                                                    reject(err);
                                                                } else {
                                                                    resolve(data);
                                                                }
                                                            });
                                                        });
                                                    }

                                                    let zipName = store.get(`$page.data[${store.itemIndex}].name`)
                                                    let url = store.get(`$page.data[${store.itemIndex}].downloadUrl`)
                                                    let filename = store.get(`$page.data[${store.itemIndex}].name`)
                                                    zip.file(filename, urlToPromise(url), {binary:true})
                                                    zip.generateAsync({type: "blob"})
                                                    .then((blob) => {   
                                                        saveAs(blob, zipName.split('.', 1) + ".zip")
                                                })})}
                                              
                                            }}>Export as Zip</a>
                                        </Menu>
                                    </cx>
                                    )
                                }
                                style = {
                                    {width: "99%"}}
                                    scrollable
                                    vlines                   
                                    columns={[
                                        { header: '', field: 'icon', items: (
                                        <cx>
                                            <i class={computable("$record.icon",
                                            (text) => {
                                            if(text){
                                                if(text.endsWith(".jpg") || text.endsWith(".jpeg") || text.endsWith(".png") || text.endsWith(".mp3") || text.endsWith(".mp4")) return "far fa-file-image" 
                                                else if(text.endsWith(".docx")) return "far fa-file-word"
                                                else if(text.endsWith(".txt")) return "far fa-file-alt"
                                                else if (text.endsWith(".pdf")) return "far fa-file-pdf"
                                                else if(text.endsWith(".xls")) return "far fa-file-excel"
                                                else if(text.endsWith(".html") || text.endsWith(".js") || text.endsWith(".css") || text.endsWith(".json") || text.endsWith(".py") || text.endsWith(".java")) return "far fa-file-code"
                                                else return "far fa-folder"     
                                                }
                                            })}/>
                                        </cx>),
                                         sortable: true,
                                         align: 'center'
                                        }, 
                                    { header: 'Document', field: 'name', sortable: true, align: 'left' }, 
                                    { header: 'Folder', field: 'parentReference.name', sortable: true, align: 'left' }, 
                                    { header: 'User', field: 'createdBy.user.displayName', sortable: true, align: 'left' },
                                    { header: 'Description', field: 'description', sortable: true, align: 'left' },
                                    { header: 'Size', field: 'size', sortable: true, align: 'left' },
                                    { header: 'Date Created', field: 'createdDateTime', sortable: true, align: 'left' },
                                    { header: 'Last modified', field: 'lastModifiedDateTimeFormatted', sortable: true, align: 'left' },
                                        ]}
                                emptyText="No data to show"
                            />
                            <FlexRow align="center">
                            <Button
                                visible={{bind: '$page.back', defaultValue: false}}
                                text = "< BACK"
                                    onClick={(e, {controller, store}) => {
                                        const { parentReference } = store.get('$page.parent');
                                        const params = { parentReference }
                                        let { page, pageSize} = store.get('$page.filter')  
                                        page = page - 1
                                        axios.post("http://localhost:3001/hello3", params).then((resp) => 
                                        {
                                            
                                            let dd =  resp.data.message.value.map(item => ({
                                            id: item.id, 
                                            icon: item.name,
                                            name: item.name,
                                            folder: item.folder,
                                            description: item.description,
                                            size: controller.convertBytes(item.size),
                                            createdDateTime: item.createdDateTime,
                                            parentReference: {
                                                name: item.parentReference.name || 'root',  
                                                id: item.parentReference.id,
                                            },
                                            createdBy: {
                                                user: { 
                                                    displayName: item.createdBy.user.displayName
                                                }
                                            },
                                            webUrl: item.webUrl, 
                                            lastModifiedDateTime: item.lastModifiedDateTime,
                                            lastModifiedDateTimeFormatted: moment(item.lastModifiedDateTime).fromNow()   
                                        })) 
                                      if (parentReference.name == 'root') 
                                        store.set('$page.back', false)
                                        store.set('$page.dataAll', dd)
                                        store.set('$page.data', dd.slice(page * pageSize, (page + 1) * pageSize))
                                        }
                                    )
                                    .catch(err => console.log(err))
                                }}
                                >
                                </Button>
                                <div style={{ marginTop: "10px" }}>
                                    <Pagination page-bind="$page.filter.page" pageCount-bind="$page.filter.pageCount" />
                                    <Select value-bind="$page.filter.pageSize"   style="margin-left: auto; width: 50px">
                                    <option value="2">2</option>
                                    <option value="5">5</option>
                                    <option value={10}>10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    </Select>
                                </div>
                            </FlexRow>
                            
                        </FlexCol>
                        
                    </div>
                    <div visible-expr="{$page.tab} == 'tab2'">
                    <div layout={LabelsLeftLayout} class="widgets" align = "center">
                                <TextField 
                                    label="User" 
                                    value-bind="$page.user" 
                                    autoFocus />
                                <br></br><br></br>
                                <TextField 
                                    label="Password" 
                                    inputType="password"
                                    value-bind="$page.password" 
                                    autoFocus />
                                    <br></br><br></br>
                            <TextArea 
                                    label="Manage user" 
                                    value-bind="$page.manage" 
                                    rows={5} 
                                    autoFocus />       
                        </div>
                    </div>
                    
                </div>
            </Section>
        </PureContainer>
    </cx>
);
