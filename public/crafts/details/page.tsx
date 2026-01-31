import { craftsService } from "@/services/crafts.service";
import { Button } from "primereact/button";

export default async function CraftDetail({ params }: { params: { id: string } }) {
    const craft = await craftsService.getById(params.id);
    console.log(craft);

    return (
        <>
            {/* <h1>{craft.title}</h1>
            <p>{craft.description}</p> */}
            <Button label="Add to Cart" />
        </>
    );
}