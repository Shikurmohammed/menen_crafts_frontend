'use client';
import { Craft } from '@/types/craft';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

export default function FeaturedCrafts({ crafts }: { crafts: Craft[] }) {
    const router = useRouter();

    return (
        <div className="grid">
            {crafts.map(craft => (
                <div key={craft.id} className="col-12 md:col-6 lg:col-3">
                    <Card
                        title={craft.title}
                        subTitle={`ETB ${craft.price}`}
                        header={
                            <img
                                src={craft.images?.[0]}
                                className="w-full h-12rem object-cover"
                            />
                        }
                        footer={
                            <Button
                                label="View"
                                icon="pi pi-eye"
                                onClick={() => router.push(`/crafts/${craft.id}`)}
                            />
                        }
                    />
                </div>
            ))}
        </div>
    );
}
