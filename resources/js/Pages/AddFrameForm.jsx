import { useRef, useState } from "react";
import { Layer, Rect, Stage } from "react-konva";
import { router, useForm } from "@inertiajs/react";
import LoadImage2 from "../../components/LoadImage2";
import LoadImage from "../../components/LoadImage";

function AddFrameForm() {
    const [ zoom, setZoom ] = useState(1);

    const [ image, setImage ] = useState({src: false, width: 0, height: 0});

    const [ seePreview, setSeePreview ] = useState(false);

    const stageRef = useRef(null);

    const { data, setData, processing, errors } = useForm({
        'frame': null,
        'name': '',
        'frame_width': 0,
        'frame_height': 0,
        'number_of_photos': 3,
        'row': 3,
        'column': 1,
        'left_margin': 0,
        'right_margin': 0,
        'top_margin': 0,
        'bottom_margin': 0,
        'margin_x_between': 0,
        'margin_y_between': 0,
        'photo_position': [],
        'printable': false,
        'visibility': true
    });

    function handleFile(e) {
        const frameFile = e.target.files[0];

        const reader = new FileReader();

        reader.readAsDataURL(frameFile);

        reader.onload = () => {
            const frameImage = new Image();

            frameImage.src = reader.result;

            frameImage.onload = () => {
                setData((prevData) => {
                    return {
                        ...prevData,
                        frame: frameFile,
                        frame_width: frameImage.naturalWidth,
                        frame_height: frameImage.naturalHeight
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

        actualImageWidth = (data.frame_width - ((data.column - 1) * data.margin_x_between) - data.left_margin - data.right_margin) / data.column;

        actualImageHeight = m * actualImageWidth;

        setImage((prevValue) => {
            return {
                ...prevValue,
                width: actualImageWidth,
                height: actualImageHeight
            };
        });

        setData('photo_position', calculatePhotoPosition(data.number_of_photos + 1, actualImageWidth, actualImageHeight));
        
        setSeePreview(true);
    }

    function calculatePhotoPosition(number_of_photos, image_width, image_height, to_json = false) {
        let photos = number_of_photos;
        const picturePosition = [];

        const row = (data.row * data.column) < (number_of_photos - 1) ? number_of_photos : data.row;

        for (let i = 0; i < row; i++) {
            let x, y;

            y = data.top_margin + (i * data.margin_y_between) + (i * image_height);

            for (let j = 0; j < data.column; j++) {
                x = data.left_margin + (j * data.margin_x_between) + (j * image_width);

                picturePosition.push({
                    x: x,
                    y: y
                });

                if (--photos === 0) {
                    break;
                }
            }

            if (photos === 0) {
                break;
            }
        }

        if (to_json) {
            // setData('photo_position', JSON.stringify(picturePosition));
            return JSON.stringify(picturePosition);
        } else {
            // setData('photo_position', picturePosition);
            return picturePosition;
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        router.post('/add-frame-handler', { ...data, photo_position:  calculatePhotoPosition(data.number_of_photos, image.width, image.height) });
    }

    return (
        <div className="h-screen bg-[#202020] flex portrait:flex-col items-center">
            <div className="landscape:w-[65%] landscape:h-full portrait:w-full portrait:h-[65%] bg-slate-200 py-6 relative overflow-auto scrollbar scrollbar-w-2 scrollbar-thumb-slate-500 hover:scrollbar-thumb-slate-600 scrollbar-thumb-rounded-full">
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
                                {seePreview && Array(data.number_of_photos).fill(1).map((value, index) => {
                                    return (
                                        <LoadImage key={index} url={"/example/5-4.png"} opacity={0.6} x={data.photo_position[index].x} y={data.photo_position[index].y} width={image.width} height={image.height} />
                                    );
                                })}
                            </Layer>
                        </Stage>
                        <div className="fixed landscape:bottom-5 left-5 portrait:top-5 bg-slate-300 py-1.5 px-5 text-2xl rounded-2xl">
                            <span>Zoom:</span>
                            <input type="range" className="m-0 align-middle me-3 ms-3 w-56" min={0.1} max={((data.frame_width < 600) && (data.frame_height < 600)) ? 1.5 : 1} step={0.05} value={zoom} onChange={(e) => setZoom(e.target.value)} />
                            <span>{Math.trunc(zoom * 100)}%</span>
                        </div>
                    </>
                }
            </div>
            <div id="menu" className="landscape:w-[35%] landscape:h-full portrait:w-full portrait:h-[35%] bg-slate-400 relative overflow-auto">
                <h1 className="text-3xl font-bold text-center my-5">New Frame</h1>

                <form className="mx-4" onSubmit={handleSubmit}>
                    <input className="block" type="file" name="frame" id="file" onChange={handleFile} />
                    {errors.frame && <div className="text-red-600">{errors.frame}</div>}

                    <div className="mb-3">
                        <label htmlFor="name">Frame Name:</label>
                        <input disabled={processing} type="text" name="name" id="name" value={data.name} className="form-input" onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <div className="text-red-600">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="f_width">Frame Width:</label>
                        <input type="text" name="frame_width" id="f_width" value={data.frame_width === 0 ? "-" : data.frame_width} className="form-input" readOnly />
                        {errors.frame_width && <div className="text-red-600">{errors.frame_width}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="f_width">Frame Height:</label>
                        <input type="text" name="frame_height" id="f_height" value={data.frame_height === 0 ? "-" : data.frame_height} className="form-input" readOnly />
                        {errors.frame_height && <div className="text-red-600">{errors.frame_height}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Number of Photos:</label>
                        <div className="inline-flex">
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-l"
                                onClick={() => {
                                    const thisValue = data.number_of_photos + 1;

                                    if ((data.column * data.row) < thisValue) {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: thisValue,
                                                row: thisValue,
                                                photo_position: calculatePhotoPosition(thisValue + 1, image.width, image.height)
                                            };
                                        });
                                    } else if (thisValue < 1) {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: 1,
                                                photo_position: calculatePhotoPosition(1 + 1, image.width, image.height)
                                            };
                                        });
                                    } else {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: thisValue,
                                                photo_position: calculatePhotoPosition(thisValue + 1, image.width, image.height)
                                            };
                                        });
                                    }
                                }}
                            >
                                +
                            </button>
                            <span className="bg-white px-3 py-1">{data.number_of_photos}</span>
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-r"
                                onClick={() => {
                                    const thisValue = data.number_of_photos - 1;

                                    if ((data.column * data.row) < thisValue) {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: thisValue,
                                                row: thisValue,
                                                photo_position: calculatePhotoPosition(thisValue + 1, image.width, image.height)
                                            };
                                        });
                                    } else if (thisValue < 1) {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: 1,
                                                photo_position: calculatePhotoPosition(1 + 1, image.width, image.height)
                                            };
                                        });
                                    } else {
                                        setData((prevValue) => {
                                            return {
                                                ...prevValue,
                                                number_of_photos: thisValue,
                                                photo_position: calculatePhotoPosition(thisValue + 1, image.width, image.height)
                                            };
                                        });
                                    }
                                }}
                            >
                                -
                            </button>
                        </div>
                        {errors.number_of_photos && <div className="text-red-600">{errors.number_of_photos}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Row:</label>
                        <div className="inline-flex">
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-l"
                                onClick={() => {
                                    const thisValue = data.row + 1;

                                    if ((data.column * thisValue) >= data.number_of_photos) {
                                        setData('row',  thisValue);
                                    } else {
                                        setData('row', data.row)
                                    }
                                }}
                            >
                                +
                            </button>
                            <span className="bg-white px-3 py-1">{data.row}</span>
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-r"
                                onClick={() => {
                                    const thisValue = data.row - 1;

                                    if ((data.column * thisValue) >= data.number_of_photos) {
                                        setData('row',  thisValue);
                                    } else {
                                        setData('row', data.row)
                                    }
                                }}
                            >
                                -
                            </button>
                        </div>
                        {errors.row && <div className="text-red-600">{errors.row}</div>}
                    </div>

                    <div className="mb-3">
                        <label>Column:</label>
                        <div className="inline-flex">
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-l"
                                onClick={() => {
                                    const thisValue = data.column + 1;

                                    if ((data.row * thisValue) >= data.number_of_photos) {
                                        setData('column',  thisValue);
                                    } else {
                                        setData('column', data.column);
                                    }
                                }}
                            >
                                +
                            </button>
                            <span className="bg-white px-3 py-1">{data.column}</span>
                            <button
                                disabled={processing}
                                type="button"
                                className="bg-gray-500 px-2 text-xl rounded-r"
                                onClick={() => {
                                    const thisValue = data.column - 1;

                                    if ((data.row * thisValue) >= data.number_of_photos) {
                                        setData('column',  thisValue);
                                    } else {
                                        setData('column', data.column);
                                    }
                                }}
                            >
                                -
                            </button>
                        </div>
                        {errors.column && <div className="text-red-600">{errors.column}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="left_margin">Left Margin:</label>
                        <input disabled={processing} type="text" name="left_margin" id="left_margin" value={data.left_margin} className="form-input" onChange={(e) => setData('left_margin',  Number(e.target.value))} />
                        {errors.left_margin && <div className="text-red-600">{errors.left_margin}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="right_margin">Right Margin:</label>
                        <input disabled={processing} type="text" name="right_margin" id="right_margin" value={data.right_margin} className="form-input" onChange={(e) => setData('right_margin',  Number(e.target.value))} />
                        {errors.right_margin && <div className="text-red-600">{errors.right_margin}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="top_margin">Top Margin:</label>
                        <input disabled={processing} type="text" name="top_margin" id="top_margin" value={data.top_margin} className="form-input" onChange={(e) => setData('top_margin', Number(e.target.value))} />
                        {errors.top_margin && <div className="text-red-600">{errors.top_margin}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="bottom_margin">Bottom Margin:</label>
                        <input disabled={processing} type="text" name="bottom_margin" id="bottom_margin" value={data.bottom_margin} className="form-input" onChange={(e) => setData('bottom_margin', Number(e.target.value))} />
                        {errors.bottom_margin && <div className="text-red-600">{errors.bottom_margin}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="margin_x_between">Margin X Between:</label>
                        <input disabled={processing} type="text" name="margin_x_between" id="margin_x_between" value={data.margin_x_between} className="form-input" onChange={(e) => setData('margin_x_between',  Number(e.target.value))} />
                        {errors.margin_x_between && <div className="text-red-600">{errors.margin_x_between}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="margin_y_between">Margin Y Between:</label>
                        <input disabled={processing} type="text" name="margin_y_between" id="margin_y_between" value={data.margin_y_between} className="form-input" onChange={(e) => setData('margin_y_between',  Number(e.target.value))} />
                        {errors.margin_y_between && <div className="text-red-600">{errors.margin_y_between}</div>}
                    </div>

                    <button type="button" onClick={getPreview} disabled={!image.src && processing} className="border-2 border-sky-400 rounded-md text-sky-400 bg-white hover:bg-sky-400 hover:text-white disabled:text-slate-600 disabled:border-slate-600 disabled:bg-gray-400 px-5 py-2">Preview</button>

                    <button type="submit" disabled={!image.src && processing} className="rounded-md text-white bg-sky-500 hover:bg-sky-600 disabled:text-slate-600 disabled:bg-gray-400 px-5 py-2">Submit</button>

                </form>
            </div>
        </div>
    );
}

export default AddFrameForm;
