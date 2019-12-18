import {FlexCol, FlexRow, MsgBox, Section, Grid, TextField, DateField, MonthField, PureContainer, Pagination, Button, Select} from "cx/widgets";



import Controller from "./Controller";

export default (
    <cx>
        <PureContainer controller={Controller}>
            <h2 putInto="header">Search</h2>
            

        <Section mod="card" style="height: 100%" bodyStyle="display: flex">
            <FlexCol controller={Controller} style="flex: 1 1 0"  spacing="large">
                <FlexRow spacing>
                    <TextField
                       
                        placeholder="Search by description..."
                        value-bind="$page.filter.search"
                        value-bind="$page.text"
                        tooltip="This is a description."
                        showClear
                    />
                    <DateField
                        placeholder="Date"
                        value-bind="$page.filter.date"
                    />
                    <MonthField
                        placeholder="Period"
                        range
                        from-bind="$page.filter.fromDate"
                        to-bind="$page.filter.toDate"
                    />
                    <Button
                        onClick={() => {
                        MsgBox.alert("Search");
                    }}
                    > Search
                    </Button>
                    <Button style="margin-right: auto"
                        onClick={() => {
                        MsgBox.alert("Export as zip");
                    }}
                    >Export as zip
                    </Button>
                    <Button style="margin-left: auto"
                        onClick={() => {
                        MsgBox.alert("Modify");
                    }}
                    >Modify
                    </Button>
                </FlexRow>
              <Grid class="flex1"
                    // style="flex: 1 1 0"
                    scrollable
                    // vlines
                    records-bind="$page.data"
                    columns={[
                        {
                        header: 'Icon',
                        field: 'icon',
                        sortable: true
                    }, {
                        header: 'Document',
                        field: 'name',
                        sortable: true,
                    
                        align: 'left'
                    }, 
                    {
                        header: 'Folder',
                        field: 'parentReference.path',
                        sortable: true,
                    
                        align: 'left'
                    }, 
                    {
                        header: 'User',
                        field: 'createdBy.user.displayName',
                        sortable: true,
                       
                        align: 'left'
                    }, {
                        header: 'Last modified',
                        field: 'lastModifiedDateTime',
                        sortable: true,
                        
                        align: 'left'
                    }]}
                    emptyText="No data to show"
                />
                <FlexRow align="center">
                    <Pagination page-bind="$page.filter.page" pageCount-bind="$page.filter.pageCount"/>
                    <Select value-bind="$page.filter.pageSize" style="margin-left: auto; width: 50px">
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </Select>
                    <span>
                    records per page
                </span>
                </FlexRow>
            </FlexCol>
        </Section>
            
        </PureContainer>
    </cx>
);
