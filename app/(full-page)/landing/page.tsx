'use client';
import React, { useContext, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { Carousel } from 'primereact/carousel';
import { Tag } from 'primereact/tag';
import { Rating } from 'primereact/rating';
import { Card } from 'primereact/card';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { NodeRef } from '@/types';
import { classNames } from 'primereact/utils';

// Sample craft data
const featuredCrafts = [
    {
        id: 1,
        name: 'Handmade Wooden Bowl',
        artisan: 'John Artisan',
        price: 49.99,
        rating: 4.8,
        image: '/demo/images/landing/craft1.jpg',
        category: 'Woodwork',
        description: 'Beautifully crafted from reclaimed oak wood'
    },
    {
        id: 2,
        name: 'Ceramic Mug Set',
        artisan: 'Sarah Potter',
        price: 75.00,
        rating: 4.9,
        image: '/demo/images/landing/craft2.jpg',
        category: 'Pottery',
        description: 'Set of 4 unique hand-thrown mugs'
    },
    {
        id: 3,
        name: 'Woven Wool Blanket',
        artisan: 'Maya Weaver',
        price: 120.00,
        rating: 4.7,
        image: '/demo/images/landing/craft3.jpg',
        category: 'Textiles',
        description: 'Cozy blanket using traditional weaving techniques'
    },
    {
        id: 4,
        name: 'Silver Pendant Necklace',
        artisan: 'Alex Goldsmith',
        price: 89.99,
        rating: 5.0,
        image: '/demo/images/landing/craft4.jpg',
        category: 'Jewelry',
        description: 'Handcrafted silver with semi-precious stone'
    }
];

const categories = [
    { name: 'Woodwork', icon: 'pi pi-box', count: 156 },
    { name: 'Pottery', icon: 'pi pi-star', count: 89 },
    { name: 'Textiles', icon: 'pi pi-sun', count: 203 },
    { name: 'Jewelry', icon: 'pi pi-heart', count: 142 },
    { name: 'Home Decor', icon: 'pi pi-home', count: 178 },
    { name: 'Leatherwork', icon: 'pi pi-tag', count: 67 }
];

const testimonials = [
    {
        name: 'Emma Johnson',
        role: 'Customer',
        content: 'The quality of crafts on Menen is exceptional! I\'ve purchased several pieces and each one has been more beautiful than expected.',
        image: '/demo/images/avatar/avatar1.png'
    },
    {
        name: 'Michael Chen',
        role: 'Artisan',
        content: 'As a craftsman, Menen has given me a platform to reach customers worldwide. The support and community are amazing!',
        image: '/demo/images/avatar/avatar2.png'
    },
    {
        name: 'Sophia Williams',
        role: 'Interior Designer',
        content: 'I source unique pieces for my clients from Menen. The craftsmanship and attention to detail are consistently outstanding.',
        image: '/demo/images/avatar/avatar3.png'
    }
];
const currentYear = new Date().getFullYear();

const LandingPage = () => {
    const [isHidden, setIsHidden] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);
    const router = useRouter();

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };

    const craftTemplate = (craft: any) => {
        return (
            <div className="p-3">
                <Card
                    className="shadow-2 border-1 surface-border"
                    header={<img alt={craft.name} src={craft.image} className="w-full h-15rem object-cover" />}
                >
                    <div className="flex flex-column gap-2">
                        <div className="flex justify-content-between align-items-center">
                            <span className="font-bold text-lg">{craft.name}</span>
                            <Tag value={craft.category} severity="info" />
                        </div>
                        <span className="text-sm text-600">{craft.artisan}</span>
                        <div className="flex align-items-center gap-2">
                            <Rating value={craft.rating} readOnly cancel={false} />
                            <span className="text-sm">({craft.rating})</span>
                        </div>
                        <p className="text-sm text-600 mt-2">{craft.description}</p>
                        <div className="flex justify-content-between align-items-center mt-3">
                            <span className="text-xl font-bold text-primary">${craft.price}</span>
                            <Button
                                label="View Details"
                                icon="pi pi-eye"
                                size="small"
                                outlined
                                onClick={() => router.push(`/crafts/${craft.id}`)}
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    return (
        <div className="surface-0">
            {/* Navigation */}
            <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static border-bottom-1 surface-border">
                <Link href="/" className="flex align-items-center">
                    <img
                        src={`/layout/images/${layoutConfig.colorScheme === 'light' ? 'logo-dark' : 'logo-white'}.svg`}
                        alt="Menen Crafts Logo"
                        height="50"
                        className="mr-0 lg:mr-2"
                    />
                    <span className="text-900 font-bold text-2xl line-height-3 mr-8">MENEN CRAFTS</span>
                </Link>
                <StyleClass nodeRef={menuRef as NodeRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick>
                    <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                </StyleClass>
                <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                    <ul className="list-none p-0 m-0 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Home</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#marketplace" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Marketplace</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#artisans" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Artisans</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#categories" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Categories</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#about" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>About</span>
                                <Ripple />
                            </a>
                        </li>
                    </ul>
                    <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Button
                            label="Login"
                            text
                            rounded
                            className="border-none font-light line-height-2 text-blue-500"
                            onClick={() => router.push('/auth/login')}
                        />
                        <Button
                            label="Join as Artisan"
                            rounded
                            className="border-none ml-5 font-light line-height-2 bg-primary text-white"
                            onClick={() => router.push('/auth/register')}
                        />
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div
                id="home"
                className="flex flex-column pt-8 px-4 lg:px-8 overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    clipPath: 'ellipse(150% 100% at 50% 0%)'
                }}
            >
                <div className="mx-4 md:mx-8 mt-0 md:mt-4 text-center lg:text-left">
                    <h1 className="text-6xl font-bold text-white line-height-2">
                        <span className="block">Discover Handmade</span>
                        <span className="block text-yellow-300">Masterpieces</span>
                    </h1>
                    <p className="font-normal text-2xl line-height-3 md:mt-3 text-white" style={{ opacity: 0.9 }}>
                        Shop unique, handcrafted items directly from talented artisans worldwide.
                        Every piece tells a story.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-5 justify-content-center lg:justify-content-start">
                        <Button
                            type="button"
                            label="Browse Marketplace"
                            size="large"
                            rounded
                            className="text-xl border-none bg-white text-primary font-bold px-5"
                            onClick={() => router.push('/marketplace')}
                        />
                        <Button
                            type="button"
                            label="Sell Your Crafts"
                            size="large"
                            outlined
                            className="text-xl border-2 border-white text-white font-bold px-5"
                            onClick={() => router.push('/artisan/register')}
                        />
                    </div>
                </div>
                <div className="flex justify-content-center md:justify-content-end mt-8">
                    <img src="/demo/images/landing/crafts-hero.png" alt="Crafts Hero" className="w-9 md:w-auto" />
                </div>
            </div>

            {/* Featured Crafts */}
            <div id="marketplace" className="py-8 px-4 lg:px-8 mt-0 bg-surface-50">
                <div className="text-center mb-6">
                    <h2 className="text-900 font-bold text-4xl mb-3">Featured Handmade Crafts</h2>
                    <p className="text-600 text-xl">Discover our curated collection of exceptional handmade items</p>
                </div>

                <Carousel
                    value={featuredCrafts}
                    numVisible={3}
                    numScroll={1}
                    itemTemplate={craftTemplate}
                    responsiveOptions={[
                        { breakpoint: '1024px', numVisible: 3, numScroll: 1 },
                        { breakpoint: '768px', numVisible: 2, numScroll: 1 },
                        { breakpoint: '560px', numVisible: 1, numScroll: 1 }
                    ]}
                    className="custom-carousel"
                    autoplayInterval={5000}
                />

                <div className="text-center mt-6">
                    <Button
                        label="View All Crafts"
                        icon="pi pi-arrow-right"
                        className="p-button-outlined"
                        onClick={() => router.push('/crafts')}
                    />
                </div>
            </div>

            {/* Categories */}
            <div id="categories" className="py-8 px-4 lg:px-8 bg-surface-0">
                <div className="text-center mb-6">
                    <h2 className="text-900 font-bold text-4xl mb-3">Explore Categories</h2>
                    <p className="text-600 text-xl">Find crafts that match your style and interests</p>
                </div>

                <div className="grid">
                    {categories.map((category, index) => (
                        <div key={index} className="col-12 md:col-6 lg:col-4 p-3">
                            <div
                                className="p-4 border-round-xl surface-card shadow-1 hover:shadow-3 transition-all transition-duration-300 cursor-pointer"
                                onClick={() => router.push(`/categories/${category.name.toLowerCase()}`)}
                            >
                                <div className="flex align-items-center gap-3">
                                    <div
                                        className="flex align-items-center justify-content-center bg-primary-100"
                                        style={{ width: '3rem', height: '3rem', borderRadius: '10px' }}
                                    >
                                        <i className={`${category.icon} text-2xl text-primary`}></i>
                                    </div>
                                    <div className="flex flex-column">
                                        <span className="font-bold text-lg">{category.name}</span>
                                        <span className="text-600">{category.count} items</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Why Choose Us */}
            <div className="py-8 px-4 lg:px-8 bg-surface-50">
                <div className="text-center mb-6">
                    <h2 className="text-900 font-bold text-4xl mb-3">Why Choose Menen Crafts</h2>
                    <p className="text-600 text-xl">We`re more than just a marketplace</p>
                </div>

                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-3 p-3">
                        <div className="p-4 text-center">
                            <div className="bg-blue-100 p-4 border-round-xl inline-block mb-3">
                                <i className="pi pi-shield text-5xl text-blue-600"></i>
                            </div>
                            <h4 className="font-bold text-xl mb-2">Authentic Handmade</h4>
                            <p className="text-600">Every item is verified to be genuinely handmade by our artisans.</p>
                        </div>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3 p-3">
                        <div className="p-4 text-center">
                            <div className="bg-green-100 p-4 border-round-xl inline-block mb-3">
                                <i className="pi pi-star text-5xl text-green-600"></i>
                            </div>
                            <h4 className="font-bold text-xl mb-2">Quality Guarantee</h4>
                            <p className="text-600">We stand behind the quality of every craft sold on our platform.</p>
                        </div>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3 p-3">
                        <div className="p-4 text-center">
                            <div className="bg-purple-100 p-4 border-round-xl inline-block mb-3">
                                <i className="pi pi-heart text-5xl text-purple-600"></i>
                            </div>
                            <h4 className="font-bold text-xl mb-2">Support Artisans</h4>
                            <p className="text-600">85% of sales go directly to the artisans who make the crafts.</p>
                        </div>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3 p-3">
                        <div className="p-4 text-center">
                            <div className="bg-orange-100 p-4 border-round-xl inline-block mb-3">
                                <i className="pi pi-truck text-5xl text-orange-600"></i>
                            </div>
                            <h4 className="font-bold text-xl mb-2">Worldwide Shipping</h4>
                            <p className="text-600">We ship to over 100 countries with careful packaging.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div id="artisans" className="py-8 px-4 lg:px-8 bg-surface-0">
                <div className="text-center mb-6">
                    <h2 className="text-900 font-bold text-4xl mb-3">What Our Community Says</h2>
                    <p className="text-600 text-xl">Join thousands of satisfied customers and artisans</p>
                </div>

                <div className="grid">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="col-12 md:col-4 p-3">
                            <div className="p-5 surface-card border-round-xl shadow-1 h-full">
                                <div className="flex align-items-center gap-3 mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-3rem h-3rem border-circle"
                                    />
                                    <div>
                                        <span className="font-bold block">{testimonial.name}</span>
                                        <span className="text-600 text-sm">{testimonial.role}</span>
                                    </div>
                                </div>
                                <p className="text-600 italic line-height-3">{testimonial.content}</p>
                                <div className="flex mt-3">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="pi pi-star-fill text-yellow-500"></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-8 px-4 lg:px-8 bg-primary">
                <div className="text-center">
                    <h2 className="text-white font-bold text-4xl mb-3">Ready to Start Your Craft Journey?</h2>
                    <p className="text-white text-xl mb-5" style={{ opacity: 0.9 }}>
                        Whether you want to buy unique handmade items or sell your crafts, we`re here to help.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-content-center">
                        <Button
                            label="Browse Crafts"
                            size="large"
                            outlined
                            className="border-2 border-white text-white font-bold px-5"
                            onClick={() => router.push('/crafts')}
                        />
                        <Button
                            label="Become an Artisan"
                            size="large"
                            className="bg-white text-primary font-bold px-5"
                            onClick={() => router.push('/artisan/register')}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-6 px-4 mx-0 bg-surface-900">
                <div className="grid justify-content-between">
                    <div className="col-12 md:col-3 mb-4 md:mb-0">
                        <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start mb-3">
                            <img
                                src={`/layout/images/logo-white.svg`}
                                alt="Menen Crafts"
                                width="50"
                                height="50"
                                className="mr-2"
                            />
                            <span className="font-bold text-2xl text-white">MENEN CRAFTS</span>
                        </Link>
                        <p className="text-white text-sm mt-3" style={{ opacity: 0.8 }}>
                            Connecting artisans with customers who appreciate handmade quality since 2024.
                        </p>
                    </div>

                    <div className="col-12 md:col-9">
                        <div className="grid text-center md:text-left">
                            <div className="col-12 md:col-3">
                                <h4 className="font-medium text-xl line-height-3 mb-3 text-white">Marketplace</h4>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">All Crafts</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Featured Items</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">New Arrivals</a>
                                <a className="line-height-3 text-lg block cursor-pointer text-300 hover:text-white">Best Sellers</a>
                            </div>

                            <div className="col-12 md:col-3">
                                <h4 className="font-medium text-xl line-height-3 mb-3 text-white">For Artisans</h4>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Sell on Menen</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Artist Resources</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Community</a>
                                <a className="line-height-3 text-lg block cursor-pointer text-300 hover:text-white">Success Stories</a>
                            </div>

                            <div className="col-12 md:col-3">
                                <h4 className="font-medium text-xl line-height-3 mb-3 text-white">Support</h4>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Help Center</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Shipping Info</a>
                                <a className="line-height-3 text-lg block cursor-pointer mb-2 text-300 hover:text-white">Returns</a>
                                <a className="line-height-3 text-lg block cursor-pointer text-300 hover:text-white">Contact Us</a>
                            </div>

                            <div className="col-12 md:col-3">
                                <h4 className="font-medium text-xl line-height-3 mb-3 text-white">Connect</h4>
                                <div className="flex gap-3">
                                    <a className="p-2 border-circle bg-white bg-opacity-10 hover:bg-opacity-20">
                                        <i className="pi pi-facebook text-white"></i>
                                    </a>
                                    <a className="p-2 border-circle bg-white bg-opacity-10 hover:bg-opacity-20">
                                        <i className="pi pi-instagram text-white"></i>
                                    </a>
                                    <a className="p-2 border-circle bg-white bg-opacity-10 hover:bg-opacity-20">
                                        <i className="pi pi-twitter text-white"></i>
                                    </a>
                                    <a className="p-2 border-circle bg-white bg-opacity-10 hover:bg-opacity-20">
                                        <i className="pi pi-pinterest text-white"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Divider className="my-4 bg-white bg-opacity-20" />

                <div className="flex flex-column md:flex-row justify-content-between align-items-center">
                    <span className="text-white text-sm">© {currentYear} Menen Crafts. All rights reserved.</span>
                    <div className="flex gap-4 mt-2 md:mt-0">
                        <a className="text-white text-sm hover:text-primary-300">Privacy Policy</a>
                        <a className="text-white text-sm hover:text-primary-300">Terms of Service</a>
                        <a className="text-white text-sm hover:text-primary-300">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;