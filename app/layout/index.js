import {Link} from "cx/widgets";
import {ContentPlaceholder} from "cx/ui";
import Controller from "./Controller";

export default (
    <cx>
        <div
            controller={Controller}
            class={{
                layout: true,
                nav: {bind: "layout.aside.open"}
            }}
        >
            <main class="main" onMouseDownCapture="onMainClick">
                <ContentPlaceholder/>
            </main>
            <header class="header">
                <i
                    class={{
                        hamburger: true,
                        open: {bind: "layout.aside.open"}
                    }}
                    onClick={(e, {store}) => {
                        store.toggle("layout.aside.open");
                    }}
                />
                <ContentPlaceholder name="header"/>
            </header>
            <aside class="aside">
                <h1>Project One-D</h1>                
                <dl>
                    <dd>
                        <Link href="~/fit" url-bind="url">
                            Tabs
                        </Link>
                    </dd>
                    <dd>
                        <Link href="~/login" url-bind="url" match="prefix">
                            Login
                        </Link>
                    </dd>
                </dl>
            </aside>
        </div>
    </cx>
);
