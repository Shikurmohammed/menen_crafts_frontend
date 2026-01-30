'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataView } from 'primereact/dataview';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { ProgressBar } from 'primereact/progressbar';

interface Artisan {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string;
    coverImage: string;
    location: string;
    joinedAt: string;
    rating: number;
    reviewCount: number;
    craftsCount: number;
    followersCount: number;
    isVerified: boolean;
    specialties: string[];
    socialLinks: {
        website?: string;
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
}

interface Craft {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    averageRating: number;
    stock: number;
}

const ArtisanProfilePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [artisan, setArtisan] = useState<Artisan | null>(null);
    const [crafts, setCrafts] = useState<Craft[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchArtisanProfile();
            fetchArtisanCrafts();
        }
    }, [id]);

    const fetchArtisanProfile = async () => {
        try {
            const response = await fetch(`/api/users/${id}`);
            const data = await response.json();
            setArtisan(data);
        } catch (error) {
            console.error('Error fetching artisan profile:', error);
        }
    };

    const fetchArtisanCrafts = async () => {
        try {
            const response = await fetch(`/api/crafts/artisan/${id}`);
            const data = await response.json();
            setCrafts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching artisan crafts:', error);
            setLoading(false);
        }
    };

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // API call to follow/unfollow
    };

    const handleMessage = () => {
        // Open message dialog
    };

    const craftTemplate = (craft: Craft) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 p-3">
                <Card
                    className="cursor-pointer hover:shadow-3 transition-all"
                    onClick={() => router.push(`/crafts/${craft.id}`)}
                    header={
                        <img
                            src={craft.images[0] || '/demo/images/no-image.jpg'}
                            alt={craft.title}
                            className="w-full h-12rem object-cover border-round-top"
                        />
                    }
                >
                    <div className="flex flex-column h-full">
                        <h4 className="font-bold mb-2 line-clamp-2">{craft.title}</h4>
                        <p className="text-600 text-sm mb-3 line-clamp-2">{craft.description}</p>

                        <div className="flex align-items-center mb-3">
                            <Rating value={craft.averageRating} readOnly cancel={false} />
                            <span className="ml-2 text-sm text-600">({craft.averageRating.toFixed(1)})</span>
                        </div>

                        <div className="mt-auto">
                            <Divider />
                            <div className="flex justify-content-between align-items-center mt-3">
                                <span className="text-xl font-bold text-primary">${craft.price.toFixed(2)}</span>
                                <Button
                                    label="View"
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
                    </div>
                </Card>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton width="100%" height="300px" className="mb-4" />
                <Skeleton width="60%" height="2rem" className="mb-2" />
                <Skeleton width="40%" height="1.5rem" />
            </div>
        );
    }

    if (!artisan) {
        return (
            <div className="text-center py-8">
                <i className="pi pi-user text-6xl text-400 mb-4"></i>
                <h2 className="text-2xl font-bold mb-2">Artisan Not Found</h2>
                <p className="text-600 mb-4">The artisan profile you`re looking for doesn`t exist.</p>
                <Button label="Browse Artisans" onClick={() => router.push('/artisans')} />
            </div>
        );
    }

    return (
        <div className="surface-ground min-h-screen">
            {/* Cover Image */}
            <div className="relative h-20rem">
                <img
                    src={artisan.coverImage || '/demo/images/cover-default.jpg'}
                    alt="Cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            </div>

            {/* Profile Header */}
            <div className="relative px-4 lg:px-8">
                <div className="flex flex-column md:flex-row gap-6 -mt-12">
                    {/* Profile Image */}
                    <div className="flex flex-column items-center md:items-start">
                        <div className="relative">
                            <img
                                src={artisan.avatar || '/demo/images/avatar/avatar.png'}
                                alt={`${artisan.firstName} ${artisan.lastName}`}
                                className="w-12rem h-12rem border-circle border-4 border-white shadow-4"
                            />
                            {artisan.isVerified && (
                                <div className="absolute bottom-3 right-3 bg-primary border-circle p-2">
                                    <i className="pi pi-check text-white text-sm"></i>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-grow-1">
                        <div className="flex flex-column md:flex-row justify-content-between gap-4">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">
                                    {artisan.firstName} {artisan.lastName}
                                </h1>
                                <div className="flex align-items-center gap-3 mb-3">
                                    <div className="flex align-items-center">
                                        <i className="pi pi-map-marker mr-2 text-600"></i>
                                        <span>{artisan.location || 'Location not specified'}</span>
                                    </div>
                                    <div className="flex align-items-center">
                                        <i className="pi pi-calendar mr-2 text-600"></i>
                                        <span>Joined {new Date(artisan.joinedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {artisan.specialties?.map((specialty, index) => (
                                        <Tag key={index} value={specialty} />
                                    ))}
                                </div>

                                {/* Rating */}
                                <div className="flex align-items-center gap-4 mb-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold">{artisan.rating.toFixed(1)}</div>
                                        <Rating value={artisan.rating} readOnly cancel={false} />
                                        <div className="text-600">{artisan.reviewCount} reviews</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-column gap-3">
                                <Button
                                    label={isFollowing ? 'Following' : 'Follow'}
                                    icon={isFollowing ? 'pi pi-check' : 'pi pi-plus'}
                                    outlined={!isFollowing}
                                    onClick={handleFollow}
                                    className="w-full md:w-auto"
                                />
                                <Button
                                    label="Message"
                                    icon="pi pi-envelope"
                                    outlined
                                    onClick={handleMessage}
                                    className="w-full md:w-auto"
                                />
                                <Button
                                    label="Share Profile"
                                    icon="pi pi-share-alt"
                                    text
                                    className="w-full md:w-auto"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid mt-4">
                            <div className="col-6 md:col-3">
                                <div className="text-center p-3 surface-card border-round">
                                    <div className="text-3xl font-bold text-primary">{artisan.craftsCount}</div>
                                    <div className="text-600">Crafts</div>
                                </div>
                            </div>
                            <div className="col-6 md:col-3">
                                <div className="text-center p-3 surface-card border-round">
                                    <div className="text-3xl font-bold text-primary">{artisan.followersCount}</div>
                                    <div className="text-600">Followers</div>
                                </div>
                            </div>
                            <div className="col-6 md:col-3">
                                <div className="text-center p-3 surface-card border-round">
                                    <div className="text-3xl font-bold text-primary">98%</div>
                                    <div className="text-600">Positive Reviews</div>
                                </div>
                            </div>
                            <div className="col-6 md:col-3">
                                <div className="text-center p-3 surface-card border-round">
                                    <div className="text-3xl font-bold text-primary">{artisan.reviewCount}</div>
                                    <div className="text-600">Total Reviews</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 lg:px-8 py-6">
                <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                    <TabPanel header="About">
                        <Card>
                            <div className="prose max-w-none">
                                <h3>About {artisan.firstName}</h3>
                                <p className="text-lg">{artisan.bio || 'No bio available.'}</p>

                                <Divider className="my-6" />

                                <h4>Specialties</h4>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {artisan.specialties?.map((specialty, index) => (
                                        <Tag key={index} value={specialty} severity="info" />
                                    ))}
                                </div>

                                <h4>Social Links</h4>
                                <div className="flex gap-3 mt-3">
                                    {artisan.socialLinks?.website && (
                                        <Button
                                            icon="pi pi-globe"
                                            rounded
                                            outlined
                                            onClick={() => window.open(artisan.socialLinks.website, '_blank')}
                                        />
                                    )}
                                    {artisan.socialLinks?.instagram && (
                                        <Button
                                            icon="pi pi-instagram"
                                            rounded
                                            outlined
                                            onClick={() => window.open(artisan.socialLinks.instagram, '_blank')}
                                        />
                                    )}
                                    {artisan.socialLinks?.facebook && (
                                        <Button
                                            icon="pi pi-facebook"
                                            rounded
                                            outlined
                                            onClick={() => window.open(artisan.socialLinks.facebook, '_blank')}
                                        />
                                    )}
                                    {artisan.socialLinks?.twitter && (
                                        <Button
                                            icon="pi pi-twitter"
                                            rounded
                                            outlined
                                            onClick={() => window.open(artisan.socialLinks.twitter, '_blank')}
                                        />
                                    )}
                                </div>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel header={`Crafts (${artisan.craftsCount})`}>
                        {crafts.length > 0 ? (
                            <DataView
                                value={crafts}
                                layout={layout}
                                itemTemplate={craftTemplate}
                                paginator
                                rows={12}
                            />
                        ) : (
                            <Card>
                                <div className="text-center py-8">
                                    <i className="pi pi-box text-6xl text-400 mb-4"></i>
                                    <h3 className="text-xl font-bold mb-2">No Crafts Available</h3>
                                    <p className="text-600">This artisan hasn`t listed any crafts yet.</p>
                                </div>
                            </Card>
                        )}
                    </TabPanel>

                    <TabPanel header="Reviews">
                        <Card>
                            {/* Reviews would go here */}
                            <div className="text-center py-8">
                                <p className="text-600">Reviews feature coming soon!</p>
                            </div>
                        </Card>
                    </TabPanel>

                    <TabPanel header="Shop Policies">
                        <Card>
                            <div className="prose max-w-none">
                                <h3>Shipping Policies</h3>
                                <ul>
                                    <li>Processing time: 1-3 business days</li>
                                    <li>Shipping within 5-7 business days</li>
                                    <li>International shipping available</li>
                                    <li>Custom orders may require additional time</li>
                                </ul>

                                <h3 className="mt-6">Return & Exchange Policies</h3>
                                <ul>
                                    <li>Accepted within 14 days of delivery</li>
                                    <li>Buyer is responsible for return shipping</li>
                                    <li>Item must be in original condition</li>
                                    <li>Custom orders are non-returnable</li>
                                </ul>
                            </div>
                        </Card>
                    </TabPanel>
                </TabView>
            </div>
        </div>
    );
};

export default ArtisanProfilePage;