import { Controller, History, Url } from 'cx/ui';
// var oneDriveAPI = require('onedrive-api');
import oneDriveAPI from "onedrive-api"
import { Icon } from 'cx/widgets';


export default class extends Controller {
    onInit() {

        // this.callOneDrive()
        this.store.init('$page', {
            filter: {
                page: 1,
                pageSize: 50,
                pageCount: 10
            }
            
        });
        // oneDriveAPI.children()
        oneDriveAPI.items.listChildren(
            {
                accessToken: 'EwB4A8l6BAAUO9chh8cJscQLmU+LSWpbnr0vmwwAAXxmR82UkxKL2HnMZb2TWXJClZnG9mBtmV8pSakcRTKVAlo4a8GkxU8i4hiGZLyf+cXnHy1iHk0WA+dAgSWOpHh0Em6HhHVJ8AUX22COELJs6zVx3mCBCByyRWA9x7lvaOI23wiMoRIqzdSXJvNEilsldlXOvBDk5LM2ori8WmjOH5uKt+YTwAt27WXJiLt0WQe1FUTcWJFkccqUBb2IibR0pcXUlY1QXj2DIuP9cC7lj4cu6QHF8CqTvYxi2FwTdkBkEM5ABayPnQmu7KSIM2/N3IRi1AX7h4lq3ze/zNeYFq2Jj8k9qS/8bHSE1u6XQIIdm9iFeeE/OSrB2gcGc4IDZgAACJZX8nvoWqWPSAIRVZA+5SSElgAsrdFh86zZd6ypB2XfYWups51uVO0k36zTK1S+Oq3cpcl34drJwj85m8Ib1Oqtgi5Q9mAO8Aoax8ewmD+Q2+gGrYYk2VdayQzwwk2k+LRdNBkI6vMOSQGDdiuJZMOxqEjb/TsytMFRELEuKFDHojetefTKuZxb3IH8ZJWf27UORt9BORSWXArAMIuz8LpIB8aRdD4TSjs3fS5zQm2WFenmFrrOYNO2A/UQVDjpANyZEUwvNpZOiHEnHobR0nUOau2anSTgJfXJq1mAEpNHKe/Mwr71WK3hlAKByH4ylnD692AvceFKN9UbLGGhq7bn1TZSgj7x5IwTxYbsEmkH5ZXdHnDvV0hsvmg47qa/WF8h4iDzFj4m6P8zuTDVm9iqm54fMG3EsDEU8BHp4Jox9Zqjexq66lE+eA/GUwlcay2yeWEJMaEfyj9jgxNrC5A6D/DaHi0qhtKhPgfZ7+hObT1LdI2quxX/v0xWo37/t9bmxHe1o92ocRWeSCZdyniQK4jLvIwBLpLcqBlaM7V+DPWDAbF1LYVavPPtVVTrc0/+hIxJhrj1G0aq51T/42x28Ld8EAU+jUo7+wI7luAQ7pcOj6yxOc2v1QJTCxgf0/AVXOxnNTdCDouquaVq7iDZS66kofZlQgrf1M6TTDV69cjUyNUP+5YqmEXL1tck0+NSo6lzlFMfIakOQVTbjnV7a5k9IZ7CtB0rTKvuiqn4IZnE//REvQ7+iw1/9AgxJu51oFppcNWVAVoQhwVo/OZd84QC',
                itemId: 'root',
                shared: true,
                user: 'fidans'
              }).then((resp) => {

                const icon = (type) => {
                    if(type.endsWith("docx")) return "W"
                    else if(type.endsWith("xlsx")) return "X"
                    else if(type.endsWith("pdf")) return "P"
                    else if(type.endsWith("txt")) return "T"
                    else if (type.endsWith("jpg") || type.endsWith("jpeg") || type.endsWith("png") || type.endsWith("mp4")) return "M"
                    else return "FLD"
                }
                console.log
                  let items = resp.value
                  console.log("items",items)
                this.store.set('$page.data', items.map((item, i ) => ({
                    icon: icon(item.name),
                    name: item.name,
                    parentReference: {
                        path: item.parentReference.path
                    },
                    createdBy: {
                        user: { 
                            displayName: item.createdBy.user.displayName
                        }
                    },
                    lastModifiedDateTime: item.lastModifiedDateTime
                })))
                console.log(this.store.get('$page.data'))
                
              
              
              // returns body of https://dev.onedrive.com/items/list.htm#response
              }).catch(err => console.log(err)) 

       
     }
     
     
   
               
        
        // this.store.set('$page.data', Array.from({length: pageSize}, (_, index) => ({
        //     // field1: `Record #${(page - 1) * pageSize + index + 1}`,
        //     field1: `Record #${index + 1}`,
        //     field2: Math.random() * 5000,
        //     field3: Math.random() * 1000,
        //     field4: Math.random(),
        // })));
    }

