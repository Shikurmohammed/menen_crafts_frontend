'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import { Tag } from 'primereact/tag';
import { ProgressBar } from 'primereact/progressbar';
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';

const ArtisanDashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalCrafts: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        averageRating: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [crafts, setCrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, ordersRes, craftsRes] = await Promise.all([
                fetch('/api/artisan/stats'),
                fetch('/api/artisan/orders?limit=5'),
                fetch('/api/artisan/crafts?limit=5')
            ]);

            const statsData = await statsRes.json();
            const ordersData = await ordersRes.json();
            const craftsData = await craftsRes.json();

            setStats(statsData);
            setRecentOrders(ordersData.orders || []);
            setCrafts(craftsData.crafts || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load dashboard data',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: '#42A5F5',
                tension: 0.4
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

    const statusBodyTemplate = (rowData: any) => {
        const statusMap: Record<string, any> = {
            pending: { label: 'Pending', severity: 'warning' },
            processing: { label: 'Processing', severity: 'info' },
            shipped: { label: 'Shipped', severity: 'primary' },
            delivered: { label: 'Delivered', severity: 'success' },
            cancelled: { label: 'Cancelled', severity: 'danger' }
        };

        const status = statusMap[rowData.status] || statusMap.pending;
        return <Tag value={status.label} severity={status.severity} />;
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <Button
                icon="pi pi-eye"
                rounded
                outlined
                className="p-button-sm"
                onClick={() => {/* View order details */ }}
            />
        );
    };

    return (
        <div className="surface-ground min-h-screen p-4">
            <Toast ref={toast} />

            {/* Header */}
            <div className="flex justify-content-between align-items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Artisan Dashboard</h1>
                    <p className="text-600">Manage your crafts, orders, and business</p>
                </div>
                <Button
                    label="Add New Craft"
                    icon="pi pi-plus"
                    onClick={() => {/* Open craft creation */ }}
                />
            </div>

            {/* Stats Cards */}
            <div className="grid mb-6">
                <div className="col-12 md:col-6 lg:col-3">
                    <Card>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <span className="block text-600 font-medium mb-2">Total Sales</span>
                                <div className="text-3xl font-bold">{stats.totalSales}</div>
                            </div>
                            <div className="bg-blue-100 p-3 border-circle">
                                <i className="pi pi-shopping-cart text-blue-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <Card>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <span className="block text-600 font-medium mb-2">Revenue</span>
                                <div className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                            </div>
                            <div className="bg-green-100 p-3 border-circle">
                                <i className="pi pi-money-bill text-green-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <Card>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <span className="block text-600 font-medium mb-2">Active Crafts</span>
                                <div className="text-3xl font-bold">{stats.totalCrafts}</div>
                            </div>
                            <div className="bg-purple-100 p-3 border-circle">
                                <i className="pi pi-box text-purple-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-12 md:col-6 lg:col-3">
                    <Card>
                        <div className="flex justify-content-between align-items-center">
                            <div>
                                <span className="block text-600 font-medium mb-2">Rating</span>
                                <div className="text-3xl font-bold">{stats.averageRating.toFixed(1)}★</div>
                            </div>
                            <div className="bg-orange-100 p-3 border-circle">
                                <i className="pi pi-star text-orange-500 text-2xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid">
                <div className="col-12 lg:col-8">
                    <Card title="Sales Overview">
                        <Chart type="line" data={chartData} options={chartOptions} height="300px" />
                    </Card>
                </div>

                <div className="col-12 lg:col-4">
                    <Card title="Quick Stats">
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-content-between mb-2">
                                    <span>Order Completion</span>
                                    <span className="font-bold">85%</span>
                                </div>
                                <ProgressBar value={85} showValue={false} />
                            </div>

                            <div>
                                <div className="flex justify-content-between mb-2">
                                    <span>Stock Level</span>
                                    <span className="font-bold">65%</span>
                                </div>
                                <ProgressBar value={65} showValue={false} />
                            </div>

                            <div>
                                <div className="flex justify-content-between mb-2">
                                    <span>Customer Satisfaction</span>
                                    <span className="font-bold">92%</span>
                                </div>
                                <ProgressBar value={92} showValue={false} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid mt-6">
                {/* Recent Orders */}
                <div className="col-12 lg:col-6">
                    <Card title="Recent Orders" className="h-full">
                        <DataTable
                            value={recentOrders}
                            paginator
                            rows={5}
                            loading={loading}
                            emptyMessage="No orders found"
                        >
                            <Column field="orderNumber" header="Order #" />
                            <Column field="customer" header="Customer" />
                            <Column field="total" header="Total" />
                            <Column field="createdAt" header="Date" />
                            <Column field="status" header="Status" body={statusBodyTemplate} />
                            <Column body={actionBodyTemplate} style={{ width: '4rem' }} />
                        </DataTable>
                    </Card>
                </div>

                {/* Craft Inventory */}
                <div className="col-12 lg:col-6">
                    <Card title="Craft Inventory" className="h-full">
                        <DataTable
                            value={crafts}
                            paginator
                            rows={5}
                            loading={loading}
                            emptyMessage="No crafts found"
                        >
                            <Column field="title" header="Title" />
                            <Column field="stock" header="Stock" />
                            <Column field="price" header="Price" />
                            <Column field="views" header="Views" />
                            <Column field="status" header="Status" />
                        </DataTable>
                    </Card>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid mt-6">
                <div className="col-12">
                    <Card title="Quick Actions">
                        <div className="flex flex-wrap gap-3">
                            <Button label="View All Orders" icon="pi pi-list" outlined />
                            <Button label="Manage Crafts" icon="pi pi-box" outlined />
                            <Button label="View Analytics" icon="pi pi-chart-bar" outlined />
                            <Button label="Customer Messages" icon="pi pi-envelope" outlined />
                            <Button label="Update Profile" icon="pi pi-user-edit" outlined />
                            <Button label="Withdraw Earnings" icon="pi pi-wallet" outlined />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ArtisanDashboard;