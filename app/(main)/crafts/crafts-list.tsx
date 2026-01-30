'use client';

import { craftsService } from "@/services/crafts.service";
import { Craft } from "@/types/craft";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { DataTableFilterMeta, FilterMatchMode } from "primereact/api";
import React, { useEffect, useRef, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { Chips } from "primereact/chips";

const CraftsTable = () => {
    const [crafts, setCrafts] = useState<Craft[]>([]);
    const [selectedCraft, setSelectedCraft] = useState<Craft | null>(null);
    const [selectedCrafts, setSelectedCrafts] = useState<Craft[]>([]);
    const [viewDialog, setViewDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [craftToDelete, setCraftToDelete] = useState<Craft | null>(null);

    const dt = useRef<any>(null);
    const toast = useRef<Toast>(null);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    /* ---------------- Actions ---------------- */

    const viewCraft = (craft: Craft) => {
        setSelectedCraft(craft);
        setViewDialog(true);
    };

    const confirmDelete = (craft: Craft) => {
        setCraftToDelete(craft);
        setDeleteDialog(true);
    };

    const deleteCraft = () => {
        if (!craftToDelete) return;

        toast.current?.show({
            severity: 'warn',
            summary: 'Craft Deleted',
            detail: craftToDelete.title,
            life: 3000
        });

        setDeleteDialog(false);
        setCraftToDelete(null);
    };

    const actionBodyTemplate = (row: Craft) => (
        <>
            <Button
                icon="pi pi-eye"
                rounded
                severity="info"
                className="mr-2"
                onClick={() => viewCraft(row)}
            />
            <Button
                icon="pi pi-trash"
                rounded
                severity="danger"
                onClick={() => confirmDelete(row)}
            />
        </>
    );

    /* ---------------- Data ---------------- */

    useEffect(() => {
        let mounted = true;

        craftsService.getAll()
            .then(res => {
                console.log(res);
                if (!mounted) return;
                setCrafts(res.data.data || []);
            })
            .catch(() => {
                if (mounted) setCrafts([]);
            });

        return () => { mounted = false; };
    }, []);

    /* ---------------- Toolbar ---------------- */

    const leftToolbarTemplate = () => (
        <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            <Button
                label="Delete Selected"
                icon="pi pi-trash"
                severity="danger"
                disabled={!selectedCrafts.length}
                onClick={() => setDeleteDialog(true)}
            />
        </div>
    );

    const rightToolbarTemplate = () => (
        <Button
            label="Export"
            icon="pi pi-upload"
            severity="help"
            onClick={() => dt.current?.exportCSV()}
        />
    );

    const header = (
        <div className="flex justify-content-between">
            <h5 className="m-0">Crafts</h5>
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
    const emptyCraft: Partial<Craft> = {
        title: '',
        description: '',
        price: 0,
        stock: 0,
        isAvailable: true,
        images: [],
        categories: [],
        specifications: {
            material: '',
            weight_kg: 0,
            handmade: true,
            dimensions: ''
        }
    };


    // Example categories for the MultiSelect
    const categories = [
        { label: 'Furniture', value: 1 },
        { label: 'Woodwork', value: 4 },
        { label: 'Hand-carved', value: 12 }
    ];

    const [createDialog, setCreateDialog] = useState(false);
    const [newCraft, setNewCraft] = useState<Partial<Craft>>(emptyCraft);

    const [submitted, setSubmitted] = useState(false);

    const openNew = () => {
        setNewCraft(emptyCraft);
        setSubmitted(false);
        setCreateDialog(true);
    };

    const saveCraft = async () => {
        setSubmitted(true);

        if (newCraft.title?.trim()) {
            try {
                // Call your service
                const res = await craftsService.create(newCraft);

                // Update local state to show new item immediately
                setCrafts([...crafts, res.data]);

                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Craft Created',
                    life: 3000
                });

                setCreateDialog(false);
                setNewCraft(emptyCraft);
            } catch (error) {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Create failed' });
            }
        }
    };


    /* ---------------- Render ---------------- */

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar left={leftToolbarTemplate} right={rightToolbarTemplate} />

                    <DataTable
                        ref={dt}
                        value={crafts}
                        selection={selectedCrafts}
                        onSelectionChange={(e) => setSelectedCrafts(e.value as Craft[])}
                        paginator
                        rows={10}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        globalFilterFields={[
                            'title',
                            'description',
                            'artisan.firstName',
                            'artisan.lastName'
                        ]}
                        header={header}
                        showGridlines
                        responsiveLayout="scroll"
                        emptyMessage="No crafts found."
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

                        <Column field="title" header="Title" filter sortable />

                        <Column
                            field="price"
                            header="Price"
                            body={(c: Craft) => `$${Number(c.price || 0).toFixed(2)}`}
                            filter
                            sortable
                        />

                        <Column
                            field="stock"
                            header="Stock"
                            filter
                            sortable
                        />

                        <Column
                            field="isAvailable"
                            header="Available"
                            body={(c: Craft) => c.isAvailable ? 'Yes' : 'No'}
                            filter
                        />

                        <Column
                            field="artisan.firstName"
                            header="Artisan"
                            body={(c: Craft) =>
                                `${c.artisan?.firstName} ${c.artisan?.lastName}`
                            }
                            filter
                        />

                        <Column
                            field="createdAt"
                            header="Created"
                            body={(c: Craft) =>
                                new Date(c.createdAt).toLocaleDateString()
                            }
                            filter
                        />

                        <Column body={actionBodyTemplate} header="Actions" exportable={false} />
                    </DataTable>

                    {/* View Dialog */}
                    <Dialog
                        header="Craft Details"
                        visible={viewDialog}
                        style={{ width: '450px' }}
                        modal
                        onHide={() => setViewDialog(false)}
                    >
                        {selectedCraft && (
                            <>
                                <p><b>Title:</b> {selectedCraft.title}</p>
                                <p><b>Price:</b> ${selectedCraft.price}</p>
                                <p><b>Stock:</b> {selectedCraft.stock}</p>
                                <p><b>Available:</b> {selectedCraft.isAvailable ? 'Yes' : 'No'}</p>
                            </>
                        )}
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog
                        visible={deleteDialog}
                        header="Confirm"
                        modal
                        onHide={() => setDeleteDialog(false)}
                        footer={
                            <>
                                <Button label="No" icon="pi pi-times" text onClick={() => setDeleteDialog(false)} />
                                <Button label="Yes" icon="pi pi-check" text onClick={deleteCraft} />
                            </>
                        }
                    >
                        Are you sure you want to delete this craft?
                    </Dialog>

                    {/* Create New Craft Dialog */}
                    <Dialog
                        visible={createDialog}
                        style={{ width: '600px' }}
                        header="Create New Craft"
                        modal
                        className="p-fluid"
                        footer={
                            <>
                                <Button label="Cancel" icon="pi pi-times" text onClick={() => setCreateDialog(false)} />
                                <Button label="Save" icon="pi pi-check" onClick={saveCraft} />
                            </>
                        }
                        onHide={() => setCreateDialog(false)}
                    >
                        {/* Basic Info */}
                        <div className="field mb-3">
                            <label className="font-bold">Title</label>
                            <InputText value={newCraft.title} onChange={(e) => setNewCraft({ ...newCraft, title: e.target.value })} />
                        </div>

                        <div className="field mb-3">
                            <label className="font-bold">Description</label>
                            <InputTextarea rows={3} value={newCraft.description} onChange={(e) => setNewCraft({ ...newCraft, description: e.target.value })} />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label className="font-bold">Price</label>
                                <InputNumber value={newCraft.price} onValueChange={(e) => setNewCraft({ ...newCraft, price: e.value })} mode="currency" currency="USD" locale="en-US" />
                            </div>
                            <div className="field col">
                                <label className="font-bold">Stock</label>
                                <InputNumber value={newCraft.stock} onValueChange={(e) => setNewCraft({ ...newCraft, stock: e.value })} />
                            </div>
                        </div>

                        {/* Images & Categories */}
                        <div className="field mb-3">
                            <label className="font-bold">Image URLs (Press Enter to add)</label>
                            <Chips value={newCraft.images} onChange={(e) => setNewCraft({ ...newCraft, images: e.value })} />
                        </div>

                        <div className="field mb-3">
                            <label className="font-bold">Categories</label>
                            <MultiSelect value={newCraft.categories} options={categories} onChange={(e) => setNewCraft({ ...newCraft, categories: e.value })} placeholder="Select Categories" />
                        </div>

                        {/* Nested Specifications */}
                        <h5 className="mt-4 mb-2">Specifications</h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label>Material</label>
                                <InputText value={newCraft.specifications?.material} onChange={(e) => setNewCraft({
                                    ...newCraft,
                                    specifications: { ...newCraft.specifications, material: e.target.value }
                                })} />
                            </div>
                            <div className="field col">
                                <label>Dimensions</label>
                                <InputText value={newCraft.specifications?.dimensions} placeholder="e.g. 45x45x90cm" onChange={(e) => setNewCraft({
                                    ...newCraft,
                                    specifications: { ...newCraft.specifications, dimensions: e.target.value }
                                })} />
                            </div>
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
};

export default CraftsTable;
