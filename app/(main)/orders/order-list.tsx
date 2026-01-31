'use client';
import { api } from "@/services/api.service";
import { ordersService } from "@/services/orders.service";
import { Order } from "@/types/order";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import React, { useEffect, useRef, useState } from 'react';
import { DataTableFilterMeta, FilterMatchMode } from 'primereact/api';


const OrdersTable = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewDialog, setViewDialog] = useState(false);

    const [selectedOrders, setSelectedOrders] = useState<Order[]>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteDialog, setDeleteDialog] = useState(false);

    //const dt = useRef<DataTable<Order[]>>(null);
    // const dt = useRef<DataTable<Order>>(null);
    const dt = useRef<any>(null);

    const toast = useRef<Toast>(null);

    const viewOrder = (order: Order) => {
        setSelectedOrder(order);
        setViewDialog(true);
    };

    const cancelOrder = () => {
        if (!orderToCancel) return;

        toast.current?.show({
            severity: 'warn',
            summary: 'Order Cancelled',
            detail: `Order ${orderToCancel.orderNumber}`,
            life: 3000
        });

        setDeleteDialog(false);
        setOrderToCancel(null);
    };

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });


    const actionBodyTemplate = (rowData: Order) => {
        return (
            <>
                <Button
                    icon="pi pi-eye"
                    rounded
                    severity="info"
                    className="mr-2"
                    onClick={() => viewOrder(rowData)}
                />
                <Button
                    icon="pi pi-times"
                    rounded
                    severity="danger"
                    // FIX: Use confirmCancel so the state 'orderToCancel' is actually set!
                    onClick={() => confirmCancel(rowData)}
                />
            </>
        );
    };
    useEffect(() => {
        let isMounted = true;
        ordersService.getAll().then(response => {
            if (!isMounted) return;

            const rawData = response.data.orders || response.data || [];
            const sanitizedData = (Array.isArray(rawData) ? rawData : []).map(order => ({
                ...order,
                user: order.user || { firstName: '', lastName: '' }
            }));

            setOrders(sanitizedData);
        }).catch(err => {
            if (isMounted) setOrders([]);
        });

        return () => { isMounted = false; }; // Cleanup to prevent memory leaks
    }, []);

    const leftToolbarTemplate = () => (
        <div className="my-2">
            <Button
                label="Cancel Selected"
                icon="pi pi-trash"
                severity="danger"
                disabled={!selectedOrders.length}
                onClick={() => setDeleteDialog(true)}
            />
        </div>
    );

    const rightToolbarTemplate = () => (
        <>
            <Button
                label="Export"
                icon="pi pi-upload"
                severity="help"
                onClick={() => dt.current?.exportCSV()}
            />
        </>);
    const header = (
        <div className="flex justify-content-between">
            <h5 className="m-0">Orders</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    placeholder="Search..."
                    value={filters.global?.value ?? ''}
                    onChange={(e) =>
                        setFilters({
                            ...filters,
                            global: {
                                value: e.target.value,
                                matchMode: FilterMatchMode.CONTAINS
                            }
                        })
                    }
                />


            </span>
        </div>
    );

    const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);

    const confirmCancel = (order: Order) => {
        setOrderToCancel(order);
        setDeleteDialog(true);
    };



    return (

        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Orders</h5>
                    <Toast ref={toast} />
                    <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} />
                    <DataTable
                        value={orders}
                        ref={dt}
                        paginator
                        rows={10}
                        dataKey="id"
                        showGridlines
                        responsiveLayout="scroll"
                        emptyMessage="No orders found."
                        className="p-datatable-gridlines"
                        selection={selectedOrders}
                        onSelectionChange={(e) => setSelectedOrders(e.value as Order[])}
                        filters={filters}
                        filterDisplay="menu"
                        globalFilterFields={['orderNumber', 'status', 'user.firstName', 'user.lastName']}
                        header={header}
                    >


                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                        <Column
                            field="orderNumber"
                            header="Order #"
                            filter
                            filterPlaceholder="Search order number"
                        />

                        <Column
                            field="user.firstName" // REQUIRED for Global Filter to "see" this column
                            header="Customer"
                            body={(row: Order) => {
                                if (!row.user) return "Unknown Customer";
                                return `${row.user.firstName ?? ''} ${row.user.lastName ?? ''}`;
                            }}
                            filter
                        />

                        <Column
                            field="totalAmount"
                            header="Total"
                            body={(row: Order) => `$${Number(row.totalAmount || 0).toFixed(2)}`}
                            filter
                        />

                        <Column
                            field="status"
                            header="Status"
                            body={(row: Order) => (
                                <span className={`order-status status-${row.status?.toLowerCase()}`}>
                                    {row.status}
                                </span>
                            )}
                        />


                        <Column
                            field="createdAt"
                            header="Created At"
                            body={(row: Order) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : ''}
                            filter
                        />
                        <Column body={actionBodyTemplate} header="Actions" exportable={false} />
                    </DataTable>



                    <Dialog
                        header="Order Details"
                        visible={viewDialog}
                        style={{ width: '450px' }}
                        modal
                        onHide={() => setViewDialog(false)}
                    >
                        {selectedOrder && (
                            <>
                                <p><b>Order:</b> {selectedOrder.orderNumber}</p>
                                <p><b>Status:</b> {selectedOrder.status}</p>
                                <p><b>Total:</b> {selectedOrder.totalAmount}</p>
                            </>
                        )}
                    </Dialog>
                    <Dialog
                        visible={deleteDialog}
                        header="Confirm"
                        modal
                        onHide={() => setDeleteDialog(false)}
                        footer={
                            <>
                                <Button label="No" icon="pi pi-times" text onClick={() => setDeleteDialog(false)} />
                                <Button label="Yes" icon="pi pi-check" text onClick={cancelOrder} />
                            </>
                        }
                    >
                        Are you sure you want to cancel this order?
                    </Dialog>

                </div>
            </div>
        </div>
    );
};


export default OrdersTable;
