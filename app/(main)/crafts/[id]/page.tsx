'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { InputNumber } from 'primereact/inputnumber';
import { Divider } from 'primereact/divider';
import { Carousel } from 'primereact/carousel';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Craft } from '@/types/craft';
import { Review } from '@/types/review';

// interface Craft {
//     id: string;
//     title: string;
//     description: string;
//     detailedDescription: string;
//     price: number;
//     images: string[];
//     stock: number;
//     isAvailable: boolean;
//     specifications: Record<string, any>;
//     artisan: {
//         id: string;
//         firstName: string;
//         lastName: string;
//         avatar: string;
//         bio: string;
//         joinedAt: string;
//         rating: number;
//         craftsCount: number;
//     };
//     averageRating: number;
//     reviewCount: number;
//     categories: Array<{ id: string; name: string }>;
//     createdAt: string;
//     views: number;
//     wishlistCount: number;
// }

// interface Review {
//     id: string;
//     rating: number;
//     comment: string;
//     user: {
//         id: string;
//         firstName: string;
//         lastName: string;
//         avatar: string;
//     };
//     createdAt: string;
//     isVerifiedPurchase: boolean;
// }

const CraftDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [craft, setCraft] = useState<Craft | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const { addToCart } = useCart();
    const toast = useRef<Toast>(null);

    useEffect(() => {
        if (id) {
            fetchCraftDetails();
            fetchReviews();
        }
    }, [id]);

    const fetchCraftDetails = async () => {
        try {
            const response = await fetch(`/api/crafts/${id}`);
            const data = await response.json();
            setCraft(data);
        } catch (error) {
            console.error('Error fetching craft details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews/craft/${id}`);
            const data = await response.json();
            setReviews(data.reviews || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = () => {
        if (!craft) return;

        if (craft.stock < quantity) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Insufficient Stock',
                detail: `Only ${craft.stock} items available`,
                life: 3000
            });
            return;
        }

        addToCart({
            id: craft.id,
            title: craft.title,
            price: craft.price,
            quantity,
            image: craft.images[0],
            artisan: `${craft.artisan.firstName} ${craft.artisan.lastName}`
        });

        toast.current?.show({
            severity: 'success',
            summary: 'Added to Cart',
            detail: `${quantity} × ${craft.title}`,
            life: 3000
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/cart');
    };

    const renderSpecifications = () => {
        if (!craft?.specifications) return null;

        return Object.entries(craft.specifications).map(([key, value]) => (
            <div key={key} className="flex justify-content-between py-2 border-bottom-1 surface-border">
                <span className="font-medium text-600">{key}:</span>
                <span className="text-900">{value}</span>
            </div>
        ));
    };

    const renderReviewTemplate = (review: Review) => {
        return (
            <div className="mb-4">
                <div className="flex align-items-center mb-2">
                    <img
                        src={review.user.avatar || '/demo/images/avatar/avatar.png'}
                        alt={review.user.firstName}
                        className="w-3rem h-3rem border-circle mr-3"
                    />
                    <div>
                        <div className="font-bold">
                            {review.user.firstName} {review.user.lastName}
                            {/* {review.isVerifiedPurchase && (
                                <Tag value="Verified Purchase" severity="success" className="ml-2" />
                            )} */}
                        </div>
                        <div className="flex align-items-center">
                            <Rating value={review.rating} readOnly cancel={false} />
                            <span className="text-600 text-sm ml-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
                <p className="text-900">{review.comment}</p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="grid">
                    <div className="col-12 lg:col-8">
                        <Skeleton width="100%" height="400px" className="mb-4" />
                        <Skeleton width="60%" height="2rem" className="mb-2" />
                        <Skeleton width="40%" height="1.5rem" />
                    </div>
                    <div className="col-12 lg:col-4">
                        <Skeleton width="100%" height="300px" />
                    </div>
                </div>
            </div>
        );
    }

    if (!craft) {
        return (
            <div className="text-center py-8">
                <i className="pi pi-exclamation-circle text-6xl text-400 mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">Craft Not Found</h2>
                <p className="text-600 mb-4">The craft you`re looking for doesn`t exist or has been removed.</p>
                <Button label="Browse Crafts" onClick={() => router.push('/crafts')} />
            </div>
        );
    }

    return (
        <div className="surface-ground min-h-screen">
            <Toast ref={toast} />

            {/* Breadcrumb */}
            <div className="bg-white py-3 px-4 lg:px-8 border-bottom-1 surface-border">
                <div className="flex align-items-center text-sm">
                    <Button
                        label="Crafts"
                        text
                        onClick={() => router.push('/crafts')}
                        className="p-0 text-600"
                    />
                    <i className="pi pi-chevron-right mx-2 text-400"></i>
                    {craft.categories.map((cat, index) => (
                        <React.Fragment key={cat.id}>
                            <Button
                                label={cat.name}
                                text
                                onClick={() => router.push(`/categories/${cat.name.toLowerCase()}`)}
                                className="p-0 text-600"
                            />
                            {index < craft.categories.length - 1 && (
                                <span className="mx-1">,</span>
                            )}
                        </React.Fragment>
                    ))}
                    <i className="pi pi-chevron-right mx-2 text-400"></i>
                    <span className="text-900 font-medium">{craft.title}</span>
                </div>
            </div>

            <div className="px-4 lg:px-8 py-6">
                <div className="grid">
                    {/* Left Column - Images */}
                    <div className="col-12 lg:col-8">
                        <Card className="mb-4">
                            <div className="mb-4">
                                <img
                                    src={craft.images[selectedImage] || '/demo/images/no-image.jpg'}
                                    alt={craft.title}
                                    className="w-full border-round"
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </div>

                            {craft.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto">
                                    {craft.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`${craft.title} - ${index + 1}`}
                                            className={`cursor-pointer border-round w-6rem h-6rem object-cover ${selectedImage === index ? 'border-2 border-primary' : 'border-1 surface-border'
                                                }`}
                                            onClick={() => setSelectedImage(index)}
                                        />
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Tabs */}
                        <Card>
                            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                                <TabPanel header="Description">
                                    <div className="prose max-w-none">
                                        <h3>About This Craft</h3>
                                        <p className="text-lg">{craft.description}</p>

                                        {craft.specifications && Object.keys(craft.specifications).length > 0 && (
                                            <>
                                                <h4 className="mt-6">Specifications</h4>
                                                <div className="surface-50 p-4 border-round">
                                                    {renderSpecifications()}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel header={`Reviews (${craft.reviewCount})`}>
                                    <div className="flex align-items-center mb-6">
                                        <div className="text-center mr-6">
                                            <div className="text-5xl font-bold">{craft.averageRating.toFixed(1)}</div>
                                            <Rating value={craft.averageRating} readOnly cancel={false} />
                                            <div className="text-600">{craft.reviewCount} reviews</div>
                                        </div>
                                        <div className="flex-grow-1">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = reviews.filter(r => r.rating === star).length;
                                                const percentage = (count / craft.reviewCount) * 100;
                                                return (
                                                    <div key={star} className="flex align-items-center mb-2">
                                                        <span className="w-3rem">{star} star{star > 1 ? 's' : ''}</span>
                                                        <div className="flex-grow-1 ml-3">
                                                            <div className="h-1rem bg-surface-300 border-round overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary"
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <span className="w-3rem text-right">{count}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <Divider />

                                    <div className="mt-6">
                                        {reviews.length > 0 ? (
                                            reviews.map(review => renderReviewTemplate(review))
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-600">No reviews yet. Be the first to review this craft!</p>
                                                <Button
                                                    label="Write a Review"
                                                    className="mt-3"
                                                    onClick={() => {/* Open review modal */ }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel header="Shipping & Returns">
                                    <div className="prose max-w-none">
                                        <h3>Shipping Information</h3>
                                        <ul>
                                            <li>Standard shipping: 5-7 business days</li>
                                            <li>Express shipping: 2-3 business days (additional cost)</li>
                                            <li>International shipping available</li>
                                            <li>Free shipping on orders over $100</li>
                                        </ul>

                                        <h3 className="mt-6">Return Policy</h3>
                                        <ul>
                                            <li>30-day return policy</li>
                                            <li>Item must be in original condition</li>
                                            <li>Customer pays return shipping</li>
                                            <li>Refund processed within 5 business days</li>
                                        </ul>
                                    </div>
                                </TabPanel>
                            </TabView>
                        </Card>
                    </div >

                    {/* Right Column - Purchase Info */}
                    < div className="col-12 lg:col-4" >
                        <Card className="sticky top-6">
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold mb-2">{craft.title}</h1>

                                <div className="flex align-items-center mb-3">
                                    <Rating value={craft.averageRating} readOnly cancel={false} />
                                    <span className="ml-2 text-600">
                                        ({craft.averageRating.toFixed(1)}) • {craft.reviewCount} reviews
                                    </span>
                                </div>

                                <div className="text-2xl font-bold text-primary mb-4">
                                    ${craft.price.toFixed(2)}
                                    <span className="text-sm text-600 ml-2">+ Free Shipping</span>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {craft.categories.map((cat, index) => (
                                        <Tag key={index} value={cat.name} severity="info" />
                                    ))}
                                </div>
                            </div>

                            <Divider />

                            {/* Stock Status */}
                            <div className="mb-4">
                                {craft.stock > 10 ? (
                                    <div className="text-green-600 font-medium">
                                        <i className="pi pi-check-circle mr-2"></i>
                                        In Stock ({craft.stock} available)
                                    </div>
                                ) : craft.stock > 0 ? (
                                    <div className="text-orange-600 font-medium">
                                        <i className="pi pi-exclamation-triangle mr-2"></i>
                                        Only {craft.stock} left in stock
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-medium">
                                        <i className="pi pi-times-circle mr-2"></i>
                                        Out of Stock
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selector */}
                            {craft.stock > 0 && (
                                <div className="mb-4">
                                    <label className="block font-medium mb-2">Quantity</label>
                                    <InputNumber
                                        value={quantity}
                                        onValueChange={(e) => setQuantity(e.value || 1)}
                                        showButtons
                                        min={1}
                                        max={craft.stock}
                                        buttonLayout="horizontal"
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus"
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-column gap-3 mb-4">
                                {craft.stock > 0 ? (
                                    <>
                                        <Button
                                            label="Add to Cart"
                                            icon="pi pi-shopping-cart"
                                            size="large"
                                            onClick={handleAddToCart}
                                            className="w-full"
                                        />
                                        <Button
                                            label="Buy Now"
                                            icon="pi pi-credit-card"
                                            size="large"
                                            onClick={handleBuyNow}
                                            className="w-full"
                                            severity="success"
                                        />
                                    </>
                                ) : (
                                    <Button
                                        label="Notify When Available"
                                        icon="pi pi-bell"
                                        size="large"
                                        className="w-full"
                                        onClick={() => {/* Open notification modal */ }}
                                    />
                                )}

                                <Button
                                    label="Add to Wishlist"
                                    icon="pi pi-heart"
                                    outlined
                                    className="w-full"
                                    onClick={() => {/* Add to wishlist */ }}
                                />
                            </div>

                            <Divider />

                            {/* Artisan Info */}
                            <div
                                className="flex align-items-center cursor-pointer hover:bg-surface-100 p-3 border-round transition-colors"
                                onClick={() => router.push(`/artisans/${craft.artisan.id}`)}
                            >
                                <img
                                    src={craft.artisan.avatar || '/demo/images/avatar/avatar.png'}
                                    alt={craft.artisan.firstName}
                                    className="w-3rem h-3rem border-circle mr-3"
                                />
                                <div>
                                    <div className="font-bold">
                                        {craft.artisan.firstName} {craft.artisan.lastName}
                                    </div>
                                    <div className="text-sm text-600">
                                        {craft.artisan.craftsCount} crafts • {craft.artisan.rating.toFixed(1)}★
                                    </div>
                                </div>
                                <i className="pi pi-chevron-right ml-auto text-400"></i>
                            </div>

                            <Divider />

                            {/* Product Details */}
                            <div className="space-y-3">
                                <div className="flex justify-content-between">
                                    <span className="text-600">Views:</span>
                                    <span>{craft.views.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="text-600">Listed:</span>
                                    <span>{new Date(craft.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-content-between">
                                    <span className="text-600">Wishlisted:</span>
                                    <span>{craft.wishlistCount} times</span>
                                </div>
                            </div>
                        </Card>

                        {/* Related Crafts */}
                        <Card className="mt-4" title="You May Also Like">
                            {/* Fetch and display related crafts */}
                            <div className="text-center py-4">
                                <p className="text-600">Loading related crafts...</p>
                            </div>
                        </Card>
                    </div>
                </div >
            </div >
        </div >
    );
};

export default CraftDetailPage;

function useCart(): { addToCart: any; } {
    throw new Error('Function not implemented.');
}
