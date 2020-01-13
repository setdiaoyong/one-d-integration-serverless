import {Route, RedirectRoute, Section, Sandbox, PureContainer} from "cx/widgets";
import {FirstVisibleChildLayout} from "cx/ui";
import AppLayout from "../layout";
import Fit from "./fit";
import Login from "./login";

export default () => <cx>
    <PureContainer>
        <Login visible-expr="!{user}" />
        <Sandbox
            visible-expr="!!{user}"
            key-bind="url"
            storage-bind="pages"
            outerLayout={AppLayout}
            layout={FirstVisibleChildLayout}
        >
            <RedirectRoute route="~/" url-bind="url" redirect="~/fit"/>
            <Route route="~/fit" url-bind="url">
                <Fit/>
            </Route>
           
    
            <Route route="~/login" url-bind="url">
                <Login/>
            </Route>
            <Section title="Page Not Found" mod="card">
                This page doesn't exist. Please check your URL.
            </Section>
        </Sandbox>
    </PureContainer>
</cx>;
