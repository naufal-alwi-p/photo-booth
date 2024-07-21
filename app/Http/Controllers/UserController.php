<?php

namespace App\Http\Controllers;

use App\Models\Frame;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Number;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\CoreApi;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class UserController extends Controller
{
    public function storeImage(Request $request) {
        $images = [];

        foreach ($request->input('img') as $image) {
            $pict = explode(',', $image)[1];

            $filename = Str::random(40) . '.png';

            array_push($images, $filename);

            Storage::put("public/temp/$filename", base64_decode($pict));
        }

        return inertia('SelectorImage', [
            'images' => $images,
        ]);
    }

    public function editor(Request $request) {

        $data = $request->validate([
            'selectedImage' => 'required|array'
        ]);

        $frames = Frame::all();

        return inertia('Editor', [
            'images' => $data['selectedImage'],
            'frames' => $frames
        ]);
    }

    public function EditorHandling(Request $request) {
        // $pict = explode(',', $request->input('image'))[1];

        // $filename = Str::random(40);

        // if (Storage::put("public/result/$filename.png", base64_decode($pict))) {
            // return inertia('SelectOption', ['file' => $filename]);

            // $file_path = Storage::path("/public/result/$filename.png");

            // $image = new \Imagick($file_path);

            // $image->setImageFormat("pdf");

            // $image->writeImage(Storage::path("/public/result/$filename.pdf"));

            return inertia('SelectOption', [
                'image' => "example.png",
                "csrf" => csrf_token(),
                "price" => [
                    [
                        "type" => "download",
                        "price" => 25000,
                        "price_str" => explode(',', Number::currency(25000, 'IDR', 'id'))[0]
                    ],
                    [
                        "type" => "print",
                        "price" => 35000,
                        "price_str" => explode(',', Number::currency(35000, 'IDR', 'id'))[0]
                    ]
                ]
            ]);
        // } else {
        //     abort(404);
        // }
    }

    public function getQris(Request $request) {
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');

        $params = [
            'transaction_details' => [
                'order_id' => rand(),
                'gross_amount' => $request->json('grossAmount'),
            ],
            // 'payment_type' => 'qris',
            // 'qris' => [
            //     "acquirer" => "gopay"
            // ]
            'payment_type' => 'gopay',
            'gopay' => [
                "enable_callback" => false
            ]
        ];

        $response = CoreApi::charge($params);

        return response()->json([
            "response" => $response
        ]);
    }

    public function checkStatusQris(Request $request) {
        $client = new Client();

        $response = $client->request("GET", $request->json("url"), [
            "headers" => [
                "Accept" => "application/json",
                "Content-Type" => "application/json",
                "Authorization" => 'Basic ' . base64_encode(env('MIDTRANS_SERVER_KEY') . ':')
            ],
        ]);

        return response()->json([
            'response' => $response->getBody()->getContents()
        ]);
    }

    public function cancelPayment(Request $request) {
        $client = new Client();

        $response = $client->request('POST', $request->json("url"), [
            "headers" => [
                "Accept" => "application/json",
                "Content-Type" => "application/json",
                "Authorization" => 'Basic ' . base64_encode(env('MIDTRANS_SERVER_KEY') . ':')
            ],
        ]);

        return response()->json([
            'response' => $response->getBody()->getContents()
        ]);
    }

    public function statusPayment(Request $request) {
        return inertia('StatusPayment', $request->all());
    }

    public function getOutput(Request $request) {
        $qr_code = QrCode::size(350)->margin(1)->generate('https://google.com')->toHtml();
        $array = explode("\n", $qr_code);
        array_shift($array);
        $qr_code = implode("", $array);

        return inertia('GetOutput', [
            'qr_code' => $qr_code
        ]);
    }

    public function thankYou() {
        return inertia('ThankYou');
    }
}