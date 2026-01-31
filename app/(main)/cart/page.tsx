'use client';
import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { ProgressBar } from 'primereact/progressbar';

interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
    artisan: string;
    maxStock: number;
}

const CartPage = () => {
    const router = useRouter();
    const { items, total, removeFromCart, updateQuantity, clearCart } = useCart();
    const [updating, setUpdating] = useState<string | null>(null);
    const toast = useRef<Toast>(null);

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        setUpdating(itemId);
        try {
            // Check stock availability
            const response = await fetch(`/api/crafts/${itemId}/stock`);
            const stockData = await response.json();

            if (newQuantity > stockData.available) {
                toast.current?.show({
                    severity: 'warn',
                    summary: 'Insufficient Stock',
                    detail: `Only ${stockData.available} items available`,
                    life: 3000
                });
                setUpdating(null);
                return;
            }

            updateQuantity(itemId, newQuantity);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update quantity',
                life: 3000
            });
        } finally {
            setUpdating(null);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        confirmDialog({
            message: 'Are you sure you want to remove this item from your cart?',
            header: 'Remove Item',
            icon: 'pi pi-exclamation-triangle',
            accept: () => removeFromCart(itemId),
            acceptClassName: 'p-button-danger'
        });
    };

    const handleClearCart = () => {
        confirmDialog({
            message: 'Are you sure you want to clear your entire cart?',
            header: 'Clear Cart',
            icon: 'pi pi-exclamation-triangle',
            accept: clearCart,
            acceptClassName: 'p-button-danger'
        });
    };

    const calculateSubtotal = () => {
        return items.reduce((sum: number, item: { price: number; quantity: number; }) => sum + (item.price * item.quantity), 0);
    };

    const calculateShipping = () => {
        return total > 100 ? 0 : 9.99;
    };

    const calculateTax = () => {
        return calculateSubtotal() * 0.08; // 8% tax
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping() + calculateTax();
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen surface-ground py-8">
                <div className="text-center">
                    <i className="pi pi-shopping-cart text-6xl text-400 mb-4"></i>
                    <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
                    <p className="text-600 mb-6">Add some handmade crafts to get started!</p>
                    <Button
                        label="Browse Crafts"
                        icon="pi pi-arrow-left"
                        onClick={() => router.push('/crafts')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen surface-ground py-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="px-4 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

                <div className="grid">
                    {/* Cart Items */}
                    <div className="col-12 lg:col-8">
                        <Card>
                            <div className="flex justify-content-between align-items-center mb-4">
                                <div>
                                    <span className="font-bold">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                                    <span className="text-600 ml-2">in your cart</span>
                                </div>
                                <Button
                                    label="Clear Cart"
                                    icon="pi pi-trash"
                                    severity="danger"
                                    outlined
                                    onClick={handleClearCart}
                                />
                            </div>

                            <Divider />

                            {items.map((item: { id: React.Key | null | undefined; image: any; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined; price: number; quantity: number | null | undefined; artisan: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined; maxStock: any; }) => (
                                <div key={item.id} className="mb-6">
                                    <div className="flex flex-column md:flex-row gap-4">
                                        {/* Item Image */}
                                        <div className="md:w-3">
                                            <img
                                                src={item.image || '/demo/images/no-image.jpg'}
                                                alt={item.title}
                                                className="w-full h-15rem md:h-10rem object-cover border-round"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-grow-1">
                                            <div className="flex justify-content-between mb-2">
                                                <h3 className="font-bold text-xl">{item.title}</h3>
                                                <span className="text-xl font-bold text-primary">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            <p className="text-600 mb-3">By {item.artisan}</p>

                                            <div className="flex flex-wrap gap-4">
                                                {/* Quantity Selector */}
                                                <div>
                                                    <label className="block font-medium mb-2">Quantity</label>
                                                    <InputNumber
                                                        value={item.quantity}
                                                        onValueChange={(e) => handleQuantityChange(item.id, e.value || 1)}
                                                        showButtons
                                                        min={1}
                                                        max={item.maxStock || 10}
                                                        disabled={updating === item.id}
                                                    />
                                                </div>

                                                {/* Price per item */}
                                                <div>
                                                    <label className="block font-medium mb-2">Price</label>
                                                    <div className="text-lg">${item.price.toFixed(2)} each</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <Button
                                                    label="Remove"
                                                    icon="pi pi-trash"
                                                    severity="danger"
                                                    outlined
                                                    onClick={() => handleRemoveItem(item.id)}
                                                />
                                                <Button
                                                    label="Save for Later"
                                                    icon="pi pi-heart"
                                                    outlined
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                </div>
                            ))}
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="col-12 lg:col-4">
                        <Card>
                            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-content-between">
                                    <span className="text-600">Subtotal</span>
                                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                                </div>

                                <div className="flex justify-content-between">
                                    <span className="text-600">Shipping</span>
                                    <span className="font-medium">
                                        {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                                    </span>
                                </div>

                                <div className="flex justify-content-between">
                                    <span className="text-600">Tax</span>
                                    <span className="font-medium">${calculateTax().toFixed(2)}</span>
                                </div>

                                <Divider />

                                <div className="flex justify-content-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex align-items-center gap-2 mb-2">
                                    <i className="pi pi-truck text-green-500"></i>
                                    <span className="font-medium">Free shipping on orders over $100</span>
                                </div>
                                <ProgressBar
                                    value={(calculateSubtotal() / 100) * 100}
                                    showValue={false}
                                    style={{ height: '6px' }}
                                />
                                <div className="text-sm text-600 mt-1">
                                    ${(100 - calculateSubtotal()).toFixed(2)} away from free shipping
                                </div>
                            </div>

                            <Button
                                label="Proceed to Checkout"
                                icon="pi pi-arrow-right"
                                className="w-full mb-3"
                                size="large"
                                onClick={() => router.push('/checkout')}
                            />

                            <Button
                                label="Continue Shopping"
                                icon="pi pi-arrow-left"
                                className="w-full"
                                outlined
                                onClick={() => router.push('/crafts')}
                            />

                            <Divider className="my-4" />

                            <div className="space-y-3">
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-shield text-green-500"></i>
                                    <span className="text-sm">Secure checkout</span>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-undo text-green-500"></i>
                                    <span className="text-sm">30-day return policy</span>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-headphones text-green-500"></i>
                                    <span className="text-sm">Customer support</span>
                                </div>
                            </div>
                        </Card>

                        {/* Promo Code */}
                        <Card className="mt-4">
                            <h3 className="font-bold mb-3">Have a Promo Code?</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    className="flex-grow-1 p-3 border-1 surface-border border-round"
                                />
                                <Button label="Apply" />
                            </div>
                        </Card>

                        {/* Recently Viewed */}
                        <Card className="mt-4">
                            <h3 className="font-bold mb-3">Recently Viewed</h3>
                            <div className="space-y-3">
                                {/* Map through recently viewed items */}
                                <div className="text-center py-4">
                                    <p className="text-600">Your recently viewed items will appear here</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;