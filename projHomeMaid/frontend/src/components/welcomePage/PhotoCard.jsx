import CardImage from '../../assets/HomeImage.jpeg';

function PhotoCard() {
    return (
        <div className="card w-4/5 h-4/5 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
            <figure className="h-full w-full">
                <img
                    src={CardImage}
                    alt="Future Is Here Image"
                    className="object-cover w-full h-full" />
            </figure>
        </div>
    );
}

export default PhotoCard;