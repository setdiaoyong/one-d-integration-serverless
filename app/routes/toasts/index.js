import { LabelsLeftLayout } from "cx/ui";
import { HtmlElement, TextField, Button, Section, TextArea, cx } from "cx/widgets";

import Controller from "./Controller";



export default (
      <cx>
          {/* <div layout={LabelsLeftLayout} class="widgets" align = "center">
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
                <br></br><br></br><br></br>

           <TextArea 
                label="Manage user" 
                value-bind="$page.manage" 
                rows={5} 
                autoFocus />       
      </div> */}

                
    <h2 putInto="header">Admin Panel</h2>              
    <Section mod="card" style="height: 100%">
                        <div class="ms-Grid-col ms-u-mdPush1 ms-u-md9 ms-u-lgPush1 ms-u-lg6">
                            <div>
                                <p class="ms-font-xl">Use the button below to connect to Microsoft Graph.</p>
                                <Button id="connect_button"
                                    onClick={() => {
                                    window.location.href='login'
                                    MsgBox.alert("Connect to Microsoft Graph");
                                    }}
                                    > Connect
                                </Button>
                                {/* <button id="connect_button" class="ms-Button" onclick="window.location.href='login'">
                                    <span class="ms-Button-label">Connect to Microsoft Graph</span>
                                </button> */}
                            </div>
                        </div>
                        </Section>
                    
                



    </cx>
)
