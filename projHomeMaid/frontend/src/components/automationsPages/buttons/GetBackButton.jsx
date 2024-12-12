import { useNavigate } from 'react-router-dom'; // Importando useNavigate

export default function GetBackButton() {
    const navigate = useNavigate(); // Usando o hook useNavigate

    // Função para pegar o houseId e redirecionar para a página homePage/{houseId}
    const goBack = () => {
        const url = window.location.href;
        const urlParts = url.split("/"); // Divide a URL para pegar o deviceId
        const deviceId = urlParts[urlParts.length - 1]; // Pega a última parte da URL

        // Extrai o houseId do deviceId (parte após o último "_")
        const houseId = deviceId.split("_").pop();

        // Navega para a página homePage/{houseId}
        navigate(`/homePage/${houseId}`);
    };

    return (
        <button
            onClick={goBack} // Ao clicar, chama a função goBack para navegar
            className="btn btn-circle"
            style={{
                backgroundColor: "#5A5654", // Cor de fundo do botão
                border: "2px solid #FFFFFF", // Borda branca para contraste
                color: "#FFFFFF", // Cor do ícone (branco)
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7" // Caminho do ícone de seta "<"
                />
            </svg>
        </button>
    );
}
