import CardImage from '../assets/HomeImage.jpeg';

function PhotoCard() {
    return (
        <div className="flex items-center justify-center h-full bg-white"> {/* Fundo branco aqui */}
            <div className="card bg-white w-4/5 h-4/5 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
                <figure className="h-full w-full">
                    <img
                        src={CardImage}
                        alt="Shoes"
                        className="object-cover w-full h-full" />
                </figure>
            </div>
        </div>
    );
}

export default PhotoCard;
