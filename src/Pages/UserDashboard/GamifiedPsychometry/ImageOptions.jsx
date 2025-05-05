import { useEffect, useState } from "react";

export const ImageOptions = ({ images, onSelect, select }) => {

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (!select) {
            setSelected(null);
        }
    }, [select])

    function handleOnSelect(index, weightPoint) {
        setSelected(index);
        onSelect(weightPoint);
    }

    return (
        <div className="w-full md:pt-10 flex flex-row flex-wrap justify-center items-start md:gap-8 gap-4">
            {
                images.map((image, index) => (
                    <div key={index} className={` w-36 md:w-96 aspect-video  rounded-md hover transition-all duration-500 hover:scale-110 relative ${selected === index ? 'border-4 border-green-500' : 'border border-gray-300'}`}>

                        <img
                            className={`w-full h-full object-cover rounded-sm drop-shadow-md ${selected === index ? 'border-8 border-green-500' : ''
                                }`}
                            src={image.signedImageUrl}
                            alt={`Option ${index}`}
                            onClick={() => handleOnSelect(index, image.weightPoint)}
                        />
                    </div>
                ))
            }
        </div>
    )
}