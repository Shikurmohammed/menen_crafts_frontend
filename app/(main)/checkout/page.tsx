'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Divider } from 'primereact/divider';
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useCart } from '@/context/CartContext';

const CheckoutPage = () => {
    const router = useRouter();
    const { items, total } = useCart();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const toast = useRef<Toast>(null);

    const steps = [
        { label: 'Shipping' },
        { label: 'Payment' },
        { label: 'Review' },
        { label: 'Confirmation' }
    ];

    const shippingMethods = [
        { label: 'Standard Shipping (5-7 days)', value: 'standard', cost: 9.99 },
        { label: 'Express Shipping (2-3 days)', value: 'express', cost: 19.99 },
        { label: 'Next Day Delivery', value: 'nextday', cost: 29.99 }
    ];

    const paymentMethods = [
        { label: 'Credit/Debit Card', value: 'card', icon: 'pi pi-credit-card' },
        { label: 'PayPal', value: 'paypal', icon: 'pi pi-paypal' },
        { label: 'Apple Pay', value: 'apple', icon: 'pi pi-apple' },
        { label: 'Google Pay', value: 'google', icon: 'pi pi-google' }
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            handlePlaceOrder();
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        } else {
            router.push('/cart');
        }
    };

    const handlePlaceOrder = async () => {
        try {
            // Process order through your API
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        craftId: item.id,
                        quantity: item.quantity
                    })),
                    shippingMethod,
                    paymentMethod
                })
            });

            if (response.ok) {
                router.push('/checkout/confirmation');
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Order Failed',
                detail: 'Please try again',
                life: 3000
            });
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Shipping Information</h3>
                        <div className="grid gap-3">
                            <div className="col-12 md:col-6">
                                <label className="block font-medium mb-2">First Name</label>
                                <InputText className="w-full" />
                            </div>
                            <div className="col-12 md:col-6">
                                <label className="block font-medium mb-2">Last Name</label>
                                <InputText className="w-full" />
                            </div>
                            <div className="col-12">
                                <label className="block font-medium mb-2">Address</label>
                                <InputText className="w-full" />
                            </div>
                            <div className="col-12 md:col-6">
                                <label className="block font-medium mb-2">City</label>
                                <InputText className="w-full" />
                            </div>
                            <div className="col-12 md:col-6">
                                <label className="block font-medium mb-2">Postal Code</label>
                                <InputText className="w-full" />
                            </div>
                            <div className="col-12">
                                <label className="block font-medium mb-2">Country</label>
                                <Dropdown
                                    options={[
                                        { label: 'United States', value: 'US' },
                                        { label: 'Canada', value: 'CA' },
                                        { label: 'United Kingdom', value: 'UK' }
                                    ]}
                                    className="w-full"
                                    placeholder="Select Country"
                                />
                            </div>
                        </div>

                        <Divider />

                        <h3 className="text-xl font-bold">Shipping Method</h3>
                        <div className="space-y-3">
                            {shippingMethods.map((method) => (
                                <div key={method.value} className="flex align-items-center">
                                    <RadioButton
                                        inputId={method.value}
                                        name="shipping"
                                        value={method.value}
                                        onChange={(e) => setShippingMethod(e.value)}
                                        checked={shippingMethod === method.value}
                                    />
                                    <label htmlFor={method.value} className="ml-2 cursor-pointer flex-grow-1">
                                        <div className="flex justify-content-between">
                                            <span>{method.label}</span>
                                            <span className="font-bold">${method.cost.toFixed(2)}</span>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">Payment Method</h3>
                        <div className="grid gap-3">
                            {paymentMethods.map((method) => (
                                <div key={method.value} className="col-12 md:col-6">
                                    <div
                                        className={`p-4 border-round cursor-pointer border-2 transition-all ${paymentMethod === method.value ? 'border-primary bg-primary-50' : 'border-300'
                                            }`}
                                        onClick={() => setPaymentMethod(method.value)}
                                    >
                                        <div className="flex align-items-center">
                                            <RadioButton
                                                inputId={method.value}
                                                name="payment"
                                                value={method.value}
                                                onChange={(e) => setPaymentMethod(e.value)}
                                                checked={paymentMethod === method.value}
                                            />
                                            <i className={`${method.icon} ml-3 text-2xl`}></i>
                                            <label htmlFor={method.value} className="ml-2 font-medium cursor-pointer">
                                                {method.label}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {paymentMethod === 'card' && (
                            <>
                                <Divider />
                                <h4 className="font-bold">Card Details</h4>
                                <div className="grid gap-3">
                                    <div className="col-12">
                                        <label className="block font-medium mb-2">Card Number</label>
                                        <InputText className="w-full" placeholder="1234 5678 9012 3456" />
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label className="block font-medium mb-2">Expiry Date</label>
                                        <InputText className="w-full" placeholder="MM/YY" />
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label className="block font-medium mb-2">CVV</label>
                                        <InputText className="w-full" placeholder="123" />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold">Review Your Order</h3>

                        {/* Order Items */}
                        <div className="surface-50 p-4 border-round">
                            <h4 className="font-bold mb-3">Items ({items.length})</h4>
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-content-between py-3 border-bottom-1 surface-border">
                                    <div className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-4rem h-4rem object-cover border-round"
                                        />
                                        <div>
                                            <div className="font-medium">{item.title}</div>
                                            <div className="text-sm text-600">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="surface-50 p-4 border-round">
                            <h4 className="font-bold mb-3">Order Summary</h4>
                            <div className="space-y-2">
                                <div className="flex justify-content-between">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span>Shipping</span>
                                    <span>$9.99</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span>Tax</span>
                                    <span>${(total * 0.08).toFixed(2)}</span>
                                </div>
                                <Divider />
                                <div className="flex justify-content-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>${(total + 9.99 + total * 0.08).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="p-4 border-1 surface-border border-round">
                            <div className="flex align-items-start mb-3">
                                <input type="checkbox" id="terms" className="mr-2 mt-1" />
                                <label htmlFor="terms" className="cursor-pointer">
                                    I agree to the Terms of Service and Privacy Policy. I understand that handmade items may have slight variations and processing times may vary.
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen surface-ground py-6">
            <Toast ref={toast} />

            <div className="px-4 lg:px-8 max-w-6xl mx-auto">
                {/* Steps */}
                <div className="mb-6">
                    <Steps model={steps} activeIndex={activeStep} />
                </div>

                <div className="grid">
                    {/* Main Content */}
                    <div className="col-12 lg:col-8">
                        <Card>
                            {renderStepContent()}

                            <Divider className="my-6" />

                            {/* Navigation Buttons */}
                            <div className="flex justify-content-between">
                                <Button
                                    label="Back"
                                    icon="pi pi-arrow-left"
                                    outlined
                                    onClick={handleBack}
                                />
                                <Button
                                    label={activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                                    icon={activeStep === steps.length - 1 ? 'pi pi-check' : 'pi pi-arrow-right'}
                                    onClick={handleNext}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="col-12 lg:col-4">
                        <Card className="sticky top-6">
                            <h3 className="font-bold mb-4">Order Summary</h3>

                            <div className="space-y-4 mb-4">
                                {items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-4rem h-4rem object-cover border-round"
                                        />
                                        <div className="flex-grow-1">
                                            <div className="font-medium line-clamp-1">{item.title}</div>
                                            <div className="text-sm text-600">Qty: {item.quantity}</div>
                                            <div className="font-bold">${item.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}

                                {items.length > 3 && (
                                    <div className="text-center text-600">
                                        + {items.length - 3} more items
                                    </div>
                                )}
                            </div>

                            <Divider />

                            <div className="space-y-2">
                                <div className="flex justify-content-between">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span>Shipping</span>
                                    <span>$9.99</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span>Tax</span>
                                    <span>${(total * 0.08).toFixed(2)}</span>
                                </div>
                                <Divider />
                                <div className="flex justify-content-between text-xl font-bold">
                                    <span>Total</span>
                                    <span>${(total + 9.99 + total * 0.08).toFixed(2)}</span>
                                </div>
                            </div>

                            <Divider className="my-4" />

                            <div className="text-sm text-600">
                                <div className="flex align-items-center gap-2 mb-2">
                                    <i className="pi pi-lock"></i>
                                    <span>Secure SSL encryption</span>
                                </div>
                                <div className="flex align-items-center gap-2 mb-2">
                                    <i className="pi pi-shield"></i>
                                    <span>Money-back guarantee</span>
                                </div>
                                <div className="flex align-items-center gap-2">
                                    <i className="pi pi-headphones"></i>
                                    <span>24/7 customer support</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;