import CarouselImage1 from '../assets/Carousel1.png';

function PhotoCard() {
    return (
        <div className="card bg-base-100 w-full h-full shadow-xl">
            <figure className="h-full">
                <img
                    src={CarouselImage1}
                    alt="Shoes"
                    className="object-cover w-full h-full" />
            </figure>
        </div>
    );
}

export default PhotoCard;
