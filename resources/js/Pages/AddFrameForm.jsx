import { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { useForm } from "@inertiajs/react";
import LoadImage2 from "../../components/LoadImage2";
import LoadImage from "../../components/LoadImage";

function AddFrameForm() {
    const [ zoom, setZoom ] = useState(1);

    const [ image, setImage ] = useState({src: false, width: 0, height: 0});

    const [ seePreview, setSeePreview ] = useState(false);

    const stageRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        'frame': null,
        'name': '',
        'frame_width': 0,
        'frame_height': 0,
        'left_margin': 0,
        'right_margin': 0,
        'top_margin': 0,
        'bottom_margin': 0,
        'margin_between': 0,
        'orientation': ''
    });

    function handleFile(e) {
        const frameFile = e.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(frameFile);

        reader.onload = () => {
            const frameImage = new Image();

            frameImage.src = reader.result;

            frameImage.onload = () => {
                let orientation;

                if (frameImage.naturalWidth > frameImage.naturalHeight) {
                    orientation = 'landscape'
                } else {
                    orientation = 'potrait'
                }

                setData((prevData) => {
                    return {
                        ...prevData,
                        frame: frameFile,
                        frame_width: frameImage.naturalWidth,
                        frame_height: frameImage.naturalHeight,
                        right_margin: orientation === "lanscape" ? 0 : prevData.right_margin,
                        bottom_margin: orientation === "potrait" ? 0 : prevData.bottom_margin,
                        orientation
                    }
                });
                setImage((prevValue) => ({...prevValue, src: reader.result}));
                setSeePreview(false);
            }
        }
    }

    function getPreview() {
        const imageWidth = 1000;
        const imageHeight = 800;

        const m = imageHeight / imageWidth;

        let actualImageWidth;
        let actualImageHeight;

        if (data.orientation === "potrait") {
            actualImageWidth = data.frame_width - data.left_margin - data.right_margin;
    
            actualImageHeight = m * actualImageWidth;
    
            setImage((prevValue) => {
                return {
                    ...prevValue,
                    width: actualImageWidth,
                    height: actualImageHeight
                };
            });
        } else {
            actualImageHeight = data.frame_height - data.top_margin - data.bottom_margin;

            actualImageWidth = actualImageHeight / m;

            setImage((prevValue) => {
                return {
                    ...prevValue,
                    width: actualImageWidth,
                    height: actualImageHeight
                };
            });
        }

        setSeePreview(true);
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/add-frame-handler');
    }

    return (
        <div className="h-screen bg-[#202020] flex items-center">
            <div className="w-[65%] h-full bg-slate-200 py-6 relative overflow-x-auto overflow-y-auto">
                {image.src &&
                    <>
                        <Stage
                            ref={stageRef}
                            width={data.frame_width}
                            height={data.frame_height}
                            className={`bg-white w-fit h-fit mx-auto shadow-lg`}
                            style={{ transform: `scale(${zoom})` }}
                        >
                            <Layer>
                                <Rect
                                    x={0}
                                    y={0}
                                    width={data.frame_width}
                                    height={data.frame_height}
                                    fill="white"
                                    id="background"
                                />
                                <LoadImage2 src={image.src} x={0} y={0} />
                                {seePreview && Array(3).fill(1).map((value, index) => {
                                    if (data.orientation === "potrait") {
                                        return (
                                            <LoadImage key={index} url={"/storage/example/5-4.png"} opacity={0.6} x={data.left_margin} y={data.top_margin + index * data.margin_between + index * image.height} width={image.width} height={image.height} />
                                        );
                                    } else {
                                        return (
                                            <LoadImage key={index} url={"/storage/example/5-4.png"} opacity={0.6} x={data.left_margin + index * data.margin_between + index * image.width} y={data.top_margin} width={image.width} height={image.height} />
                                        );
                                    }
                                })}
                            </Layer>
                        </Stage>
                        <div className="fixed bottom-5 left-5 bg-slate-300 py-1.5 px-5 rounded-2xl">
                            <span>Zoom:</span>
                            <input type="range" className="m-0 align-middle me-3 ms-3" min={0.1} max={1} step={0.05} value={zoom} onChange={(e) => setZoom(e.target.value)} />
                            <span>{zoom * 100}%</span>
                        </div>
                    </>
                }
            </div>
            <div id="menu" className="w-[35%] h-full bg-slate-400 relative">
                <h1 className="text-3xl font-bold text-center my-5">New Frame</h1>

                <form className="mx-4" onSubmit={handleSubmit}>
                    <input className="block" type="file" name="frame" id="file" onChange={handleFile} />

                    <div className="mb-3">
                        <label htmlFor="name">Frame Name:</label>
                        <input type="text" name="name" id="name" value={data.name} className="form-input" onChange={(e) => setData('name', e.target.value)} />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="f_width">Frame Width:</label>
                        <input type="text" name="frame_width" id="f_width" value={data.frame_width === 0 ? "-" : data.frame_width} className="form-input" readOnly />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="f_width">Frame Height:</label>
                        <input type="text" name="frame_height" id="f_height" value={data.frame_height === 0 ? "-" : data.frame_height} className="form-input" readOnly />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="left_margin">Left Margin:</label>
                        <input type="text" name="left_margin" id="left_margin" value={data.left_margin} className="form-input" onChange={(e) => setData('left_margin',  Number(e.target.value))} />
                    </div>

                    {data.orientation === "potrait" && <div className="mb-3">
                        <label htmlFor="right_margin">Right Margin:</label>
                        <input type="text" name="right_margin" id="right_margin" value={data.right_margin} className="form-input" onChange={(e) => setData('right_margin',  Number(e.target.value))} />
                    </div>}

                    <div className="mb-3">
                        <label htmlFor="top_margin">Top Margin:</label>
                        <input type="text" name="top_margin" id="top_margin" value={data.top_margin} className="form-input" onChange={(e) => setData('top_margin', Number(e.target.value))} />
                    </div>

                    {data.orientation === "landscape" && <div className="mb-3">
                        <label htmlFor="bottom_margin">Bottom Margin:</label>
                        <input type="text" name="bottom_margin" id="bottom_margin" value={data.bottom_margin} className="form-input" onChange={(e) => setData('bottom_margin', Number(e.target.value))} />
                    </div>}

                    <div className="mb-3">
                        <label htmlFor="margin_between">Margin Between:</label>
                        <input type="text" name="margin_between" id="margin_between" value={data.margin_between} className="form-input" onChange={(e) => setData('margin_between',  Number(e.target.value))} />
                    </div>

                    <p>Orientation: {data.orientation}</p>

                    <button type="button" onClick={getPreview} disabled={!image.src} className="border-2 border-sky-400 rounded-md text-sky-400 bg-white hover:bg-sky-400 hover:text-white disabled:text-slate-600 disabled:border-slate-600 disabled:bg-gray-400 px-5 py-2">Preview</button>

                    <button type="submit" disabled={!image.src} className="rounded-md text-white bg-sky-500 hover:bg-sky-600 disabled:text-slate-600 disabled:bg-gray-400 px-5 py-2">Submit</button>

                </form>
            </div>
        </div>
    );
}

export default AddFrameForm;
