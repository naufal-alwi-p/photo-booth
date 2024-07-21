import { Image } from "react-konva";
import useImage from "use-image";

function LoadImage({ url, ...props }) {
    const [ image ] = useImage(url);

    return (
        <Image image={image} {...props} />
    );
}

export default LoadImage;
