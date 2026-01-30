

'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Slider } from 'primereact/slider';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Paginator } from 'primereact/paginator';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
//import { FilterService } from '@/services/filterService';
import CraftsTable from "./crafts-list";
interface Craft {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    artisan: {
        id: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
    averageRating: number;
    stock: number;
    categories: Array<{ id: string; name: string }>;
    createdAt: string;
}

const CraftsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [crafts, setCrafts] = useState<Craft[]>([]);
    const [loading, setLoading] = useState(true);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [sortOrder, setSortOrder] = useState<any>(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const sortOptions = [
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
        { label: 'Newest First', value: 'newest' },
        { label: 'Most Popular', value: 'popular' },
        { label: 'Highest Rated', value: 'rating' }
    ];

    const categories = [
        { label: 'All Categories', value: 'all', icon: 'tags' },
        { label: 'Woodwork', value: 'woodwork', icon: 'tree' },
        { label: 'Pottery', value: 'pottery', icon: 'circle' },
        { label: 'Textiles', value: 'textiles', icon: 'fabric' },
        { label: 'Jewelry', value: 'jewelry', icon: 'gem' },
        { label: 'Home Decor', value: 'home-decor', icon: 'home' }
    ];

    useEffect(() => {
        fetchCrafts();
    }, [first, rows, sortOrder, searchQuery, priceRange, selectedCategory]);

    const fetchCrafts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(first / rows + 1),
                limit: String(rows),
                sortBy: sortOrder?.value || 'createdAt',
                sortOrder: sortOrder?.value?.includes('desc') ? 'DESC' : 'ASC'
            });

            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory !== 'all') params.append('category', selectedCategory);
            if (priceRange[0] > 0) params.append('minPrice', String(priceRange[0]));
            if (priceRange[1] < 1000) params.append('maxPrice', String(priceRange[1]));

            const response = await fetch(`/api/crafts?${params}`);
            const data = await response.json();

            setCrafts(data.crafts || []);
            setTotalRecords(data.total || 0);
        } catch (error) {
            console.error('Error fetching crafts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setFirst(0);
        fetchCrafts();
    };

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const gridItem = (craft: Craft) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">
                <Card
                    className="h-full cursor-pointer hover:shadow-5 transition-all transition-duration-300"
                    onClick={() => router.push(`/crafts/${craft.id}`)}
                    header={
                        <div className="relative">
                            <img
                                src={craft.images[0] || '/demo/images/no-image.jpg'}
                                alt={craft.title}
                                className="w-full h-15rem object-cover border-round-top"
                            />
                            {craft.stock < 5 && (
                                <Tag value="Low Stock" severity="warning" className="absolute top-2 right-2" />
                            )}
                            {craft.stock === 0 && (
                                <Tag value="Out of Stock" severity="danger" className="absolute top-2 right-2" />
                            )}
                            <div className="absolute bottom-2 left-2">
                                {craft.categories.slice(0, 2).map((cat, index) => (
                                    <Tag key={index} value={cat.name} severity="info" className="mr-2 text-xs" />
                                ))}
                            </div>
                        </div>
                    }
                >
                    <div className="flex flex-column h-full">
                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{craft.title}</h3>
                        <p className="text-600 text-sm mb-3 line-clamp-2 flex-grow-1">{craft.description}</p>

                        <div className="flex align-items-center mb-3">
                            <Rating value={craft.averageRating} readOnly cancel={false} stars={5} />
                            <span className="ml-2 text-sm text-600">({craft.averageRating.toFixed(1)})</span>
                        </div>

                        <div className="flex align-items-center mb-3">
                            <img
                                src={craft.artisan.avatar || '/demo/images/avatar/avatar.png'}
                                alt={craft.artisan.firstName}
                                className="w-2rem h-2rem border-circle mr-2"
                            />
                            <span className="text-sm">
                                By {craft.artisan.firstName} {craft.artisan.lastName}
                            </span>
                        </div>

                        <Divider />

                        <div className="flex justify-content-between align-items-center mt-auto">
                            <span className="text-xl font-bold text-primary">${craft.price.toFixed(2)}</span>
                            <Button
                                label="View Details"
                                icon="pi pi-eye"
                                size="small"
                                outlined
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/crafts/${craft.id}`);
                                }}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const listItem = (craft: Craft) => {
        return (
            <div className="col-12 p-3">
                <Card className="cursor-pointer hover:shadow-3" onClick={() => router.push(`/crafts/${craft.id}`)}>
                    <div className="flex flex-column md:flex-row gap-4">
                        <div className="md:w-4">
                            <img
                                src={craft.images[0] || '/demo/images/no-image.jpg'}
                                alt={craft.title}
                                className="w-full h-10rem md:h-15rem object-cover border-round"
                            />
                        </div>

                        <div className="flex flex-column flex-grow-1">
                            <div className="flex justify-content-between align-items-start mb-2">
                                <h3 className="font-bold text-xl mb-1">{craft.title}</h3>
                                <span className="text-2xl font-bold text-primary">${craft.price.toFixed(2)}</span>
                            </div>

                            <p className="text-600 mb-3 line-clamp-2">{craft.description}</p>

                            <div className="flex align-items-center gap-3 mb-3">
                                <div className="flex align-items-center">
                                    <img
                                        src={craft.artisan.avatar || '/demo/images/avatar/avatar.png'}
                                        alt={craft.artisan.firstName}
                                        className="w-2rem h-2rem border-circle mr-2"
                                    />
                                    <span>By {craft.artisan.firstName} {craft.artisan.lastName}</span>
                                </div>

                                <div className="flex align-items-center">
                                    <Rating value={craft.averageRating} readOnly cancel={false} />
                                    <span className="ml-2">({craft.averageRating.toFixed(1)})</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {craft.categories.map((cat, index) => (
                                    <Tag key={index} value={cat.name} severity="info" />
                                ))}
                            </div>

                            <div className="flex justify-content-between align-items-center mt-auto">
                                <span className="text-sm text-600">
                                    {craft.stock > 0 ? `${craft.stock} in stock` : 'Out of stock'}
                                </span>
                                <Button
                                    label="View Details"
                                    icon="pi pi-arrow-right"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/crafts/${craft.id}`);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const itemTemplate = (craft: Craft, layout: 'grid' | 'list') => {
        if (!craft) return null;
        return layout === 'grid' ? gridItem(craft) : listItem(craft);
    };

    const renderSkeleton = () => {
        return Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">
                <Card>
                    <Skeleton width="100%" height="200px" className="mb-2" />
                    <Skeleton width="80%" height="1.5rem" className="mb-2" />
                    <Skeleton width="60%" height="1rem" className="mb-2" />
                    <Skeleton width="40%" height="1rem" />
                </Card>
            </div>
        ));
    };

    return (
        <div className="surface-ground min-h-screen">
            {/* Hero Banner */}
            <div className="bg-primary py-6">
                <div className="px-4 lg:px-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Discover Handmade Crafts</h1>
                    <p className="text-white text-xl">Find unique, handmade items from talented artisans worldwide</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow-1 py-4 px-4 lg:px-8">
                <div className="grid align-items-center">
                    <div className="col-12 md:col-6 lg:col-4">
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-search" />
                            <InputText
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search crafts..."
                                className="w-full"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </span>
                    </div>

                    <div className="col-12 md:col-6 lg:col-2 mt-3 md:mt-0">
                        <Dropdown
                            value={selectedCategory}
                            options={categories}
                            onChange={(e) => setSelectedCategory(e.value)}
                            placeholder="Category"
                            className="w-full"
                        />
                    </div>

                    <div className="col-12 md:col-6 lg:col-3 mt-3 md:mt-0">
                        <div className="px-3">
                            <label className="block text-600 text-sm mb-2">
                                Price Range: ${priceRange[0]} - ${priceRange[1]}
                            </label>
                            <Slider
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.value as [number, number])}
                                range
                                min={0}
                                max={1000}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3 mt-3 md:mt-0">
                        <div className="flex gap-3">
                            <Dropdown
                                value={sortOrder}
                                options={sortOptions}
                                onChange={(e) => setSortOrder(e.value)}
                                placeholder="Sort By"
                                className="flex-grow-1"
                            />
                            <DataViewLayoutOptions
                                layout={layout}
                                onChange={(e) => setLayout(e.value as 'grid' | 'list')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 lg:px-8 py-6">
                <div className="flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Crafts'}
                        </h2>
                        <p className="text-600">
                            Showing {first + 1}-{Math.min(first + rows, totalRecords)} of {totalRecords} crafts
                        </p>
                    </div>
                    <Button
                        label="Advanced Filters"
                        icon="pi pi-filter"
                        outlined
                        onClick={() => {/* Open advanced filter modal */ }}
                    />
                </div>

                {/* Crafts Grid/List */}
                {loading ? (
                    <div className="grid">
                        {renderSkeleton()}
                    </div>
                ) : crafts.length > 0 ? (
                    <>
                        <DataView
                            value={crafts}
                            layout={layout}
                            itemTemplate={(craft) => itemTemplate(craft, layout)}
                            paginator={false}
                        />

                        <Paginator
                            first={first}
                            rows={rows}
                            totalRecords={totalRecords}
                            onPageChange={onPageChange}
                            template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            className="mt-6"
                        />
                    </>
                ) : (
                    <div className="text-center py-8">
                        <i className="pi pi-search text-6xl text-400 mb-4"></i>
                        <h3 className="text-2xl font-bold mb-2">No crafts found</h3>
                        <p className="text-600 mb-4">Try adjusting your search or filter criteria</p>
                        <Button
                            label="Clear Filters"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('all');
                                setPriceRange([0, 1000]);
                                setSortOrder(null);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Categories Section */}
            <div className="bg-white py-8 px-4 lg:px-8">
                <h2 className="text-center text-3xl font-bold mb-6">Browse by Category</h2>
                <div className="grid">
                    {categories.slice(1).map((category, index) => (
                        <div key={index} className="col-6 md:col-4 lg:col-2 p-2">
                            <div
                                className="p-4 border-round-xl surface-card shadow-1 hover:shadow-3 transition-all cursor-pointer text-center"
                                onClick={() => setSelectedCategory(category.value)}
                            >
                                <i className={`pi pi-${category.icon || 'tag'} text-4xl text-primary mb-3`}></i>
                                <p className="font-bold">{category.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CraftsPage;