/* eslint-disable react/jsx-no-undef */
import { craftsService } from '@/services/crafts.service';
import FeaturedCrafts from './FeaturedCrafts';
import { Craft } from '@/types/craft';
import { Card } from 'primereact/card';
import { useState } from 'react';
export default async function LandingPage() {
    //const crafts = await craftsService.getFeatured();
    const [crafts, setCrafts] = useState<Craft[]>([]);
    const [loadingCrafts, setLoadingCrafts] = useState(true);
    return (
        <>
            {/* <Hero />
            <FeaturedCrafts crafts={crafts} />
            <WhyChooseUs />
            <CallToAction /> */}
        </>
    );
}
