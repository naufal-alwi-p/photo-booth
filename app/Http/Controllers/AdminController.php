<?php

namespace App\Http\Controllers;

use App\ImageOrientation;
use App\Models\DropboxAuth;
use App\Models\Frame;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function adminLoginPage() {
        if (Auth::check()) {
            return redirect('/admin/dashboard');
        }
    
        if (User::count() === 0) {
            return redirect('/admin/registration');
        }
    
        return inertia('AdminLogin');
    }

    public function adminLoginHandler(Request $request) {
        if (Auth::check()) {
            abort(404);
        }
    
        $data = $request->validate([
            'email' => 'required|email:rfc,dns,spoof,filter',
            'password' => ['required', Password::min(8)],
        ]);
    
        if (Auth::attempt($data)) {
            $request->session()->regenerate();
    
            return redirect()->intended('/admin/dashboard');
        }
    
        return redirect()->back()->withErrors(['info' => 'Gagal Login'])->onlyInput('email');
    }

    public function adminRegisterPage() {
        if (User::count() !== 0) {
            abort(404);
        }
    
        return inertia('AdminRegis');
    }

    public function adminRegisterHandling(Request $request) {
        if (User::count() !== 0) {
            abort(404);
        }
    
        $data = $request->validate([
            'name' => 'required|ascii',
            'email' => 'required|email:rfc,dns,spoof,filter',
            'password' => ['required', 'confirmed', Password::min(8)]
        ]);
    
        $new_admin = User::create($data);
    
        if ($new_admin) {
            return redirect()->intended('/admin');
        } else {
            return redirect()->back()->withErrors(['info' => 'Gagal Registrasi'])->onlyInput(['name', 'email']);
        }
    }

    public function AdminDashboardPage() {
        if (!Auth::check()) {
            abort(404);
        }

        $login_dropbox = "";

        if (Auth::user()->dropbox_auth === null) {
            $login_dropbox = "https://www.dropbox.com/oauth2/authorize?client_id=" . Config::get('app.dropbox_app_key') . "&token_access_type=offline&response_type=code&redirect_uri=" . urlencode('https://photo-booth.test/handle-dropbox-auth');
        } else {
            if (Carbon::now()->greaterThanOrEqualTo(Auth::user()->dropbox_auth->expires_date)) {
                $login_dropbox = self::refreshAccessToken() ? '' : ("https://www.dropbox.com/oauth2/authorize?client_id=" . Config::get('app.dropbox_app_key') . "&token_access_type=offline&response_type=code&redirect_uri=" . urlencode('https://photo-booth.test/handle-dropbox-auth'));
            }
        }

        $frames = Frame::select('id', 'filename', 'frame_width', 'frame_height', 'name', 'visibility')->get();
    
        return inertia('AdminDashboard', ['frames' => $frames, 'csrf' => csrf_token(), 'login_dropbox' => $login_dropbox]);
    }

    public function handleDropboxAuth(Request $request) {
        if (!Auth::check()) {
            abort(404);
        }

        $data = $request->validate([
            'code' => 'required|string',
        ]);

        $client = new Client();

        $response = null;

        try {
            $response = $client->request('POST', 'https://api.dropboxapi.com/oauth2/token', [
                'form_params' => [
                    'code' => $data['code'],
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => 'https://photo-booth.test/handle-dropbox-auth',
                    'client_id' => Config::get('app.dropbox_app_key'),
                    'client_secret' => Config::get('app.dropbox_secret_key')
                ],
            ]);
        } catch (\Throwable $th) {
            return redirect('/admin/dashboard')->withErrors(['info' => 'Gagal Login Dropbox']);
        }

        $result = json_decode($response->getBody()->getContents(), true);

        $dropbox_auth = [
            'user_id' => Auth::user()->id,
            'access_token' => Crypt::encrypt($result['access_token']),
            'refresh_token' => Crypt::encrypt($result['refresh_token']),
            'expires_date' => Carbon::now()->addSeconds($result['expires_in']),
        ];

        $new_dropbox_auth = DropboxAuth::create($dropbox_auth);

        if ($new_dropbox_auth) {
            return redirect('/admin/dashboard');
        } else {
            return redirect('/admin/dashboard')->withErrors(['info'=> 'Gagal Login Dropbox']);
        }
    }

    public static function refreshAccessToken() {
        if (User::count() === 0) {
            return false;
        }

        $user = User::first();

        $dropbox = $user?->dropbox_auth;

        if ($dropbox === null) {
            return false;
        }

        $refresh_token = $dropbox->refresh_token;

        $client = new Client();

        $response = null;

        try {
            $response = $client->request('POST', 'https://api.dropboxapi.com/oauth2/token', [
                'form_params' => [
                    'grant_type' => 'refresh_token',
                    'refresh_token' => Crypt::decrypt($refresh_token),
                    'client_id' => Config::get('app.dropbox_app_key'),
                    'client_secret' => Config::get('app.dropbox_secret_key')
                ],
            ]);
        } catch (\Throwable $th) {
            abort(500);
        }

        $result = json_decode($response->getBody()->getContents(), true);

        $dropbox_auth = [
            'access_token' => Crypt::encrypt($result['access_token']),
            'expires_date' => Carbon::now()->addSeconds($result['expires_in']),
        ];

        $dropbox->access_token = $dropbox_auth['access_token'];
        $dropbox->expires_date = $dropbox_auth['expires_date'];

        if ($dropbox->save()) {
            Config::set('filesystems.disks.dropbox.authorization_token', $result['access_token']);

            return true;
        } else {
            return false;
        }
    }

    public function logoutDropbox() {
        if (!Auth::check()) {
            abort(404);
        }

        $dropbox_account = Auth::user()->dropbox_auth;

        if ($dropbox_account->delete()) {
            $client = new Client();

            try {
                $client->request('POST', 'https://api.dropboxapi.com/2/auth/token/revoke', [
                    'headers' => [
                        'Authorization' => 'Bearer ' . Crypt::decrypt(Auth::user()->dropbox_auth->access_token),
                    ],
                ]);
            } catch (\Throwable $th) {
                return redirect()->back()->withErrors(['info' => 'Gagal Logout']);
            }

            return redirect('/admin/dashboard');
        } else {
            return redirect()->back()->withErrors(['info' => 'Gagal Logout']);
        }
    }

    public function changeFrameVisibility(Request $request) {
        if (!Auth::check()) {
            abort(404);
        }

        $data = $request->validate([
            'id' => 'required|exists:frames,id',
            'visibility' => 'required|boolean'
        ]);

        $frame = Frame::find($data['id']);

        $frame->visibility = $data['visibility'];

        if ($frame->save()) {
            return redirect('/admin/dashboard');
        } else {
            return redirect()->back()->withErrors(['info' => 'Failed to Change Visibility']);
        }
    }

    public function deleteFrame(Request $request) {
        if (!Auth::check()) {
            abort(404);
        }

        $data = $request->validate([
            'id' => 'required|exists:frames,id'
        ]);

        $frame = Frame::find($data['id']);

        $filename = $frame->filename;

        if ($frame->delete()) {
            if (Storage::delete("/public/frames/$filename")) {
                return redirect('admin/dashboard');
            } else {
                return redirect()->back()->withErrors(['info'=> 'Failed to Delete File Frame']);
            }
        } else {
            return redirect()->back()->withErrors(["info"=> "Failed to Delete Frame"]);
        }
    }

    public function AdminAddFramePage() {
        if (!Auth::check()) {
            abort(404);
        }
        
        return inertia('AddFrameForm');
    }

    public function AdminAddFrameHandler(Request $request) {
        if (!Auth::check()) {
            abort(404);
        }
    
        $data = $request->validate([
            'frame' => 'required|file|image',
            'name' => 'required|ascii',
            'frame_width' => 'required|numeric',
            'frame_height' => 'required|numeric',
            'number_of_photos' => 'required|numeric|min:1',
            'row' => 'required|numeric|min:1',
            'column' => 'required|numeric|min:1',
            'left_margin' => 'required|numeric|min:0',
            'right_margin' => 'required|numeric|min:0',
            'top_margin' => 'required|numeric|min:0',
            'bottom_margin' => 'required|numeric|min:0',
            'margin_x_between' => 'required|numeric|min:0',
            'margin_y_between' => 'required|numeric|min:0',
            'photo_position' => ['required', 'array'],
            'photo_position.*.x' => ['required', 'numeric', 'min:0'],
            'photo_position.*.y' => ['required', 'numeric', 'min:0'],
            'printable' => 'required|boolean',
            'visibility' => 'required|boolean'
        ]);

        $data['photo_position'] = array_map(function ($value) {
            return [
                'x' => (float) $value['x'],
                'y' => (float) $value['y']
            ];
        }, $data['photo_position']);
    
        $filepath = $request->file('frame')->store('/public/frames');
        $file_array_name = explode('/', $filepath);
    
        $filename = array_pop($file_array_name);
    
        $data['filename'] = $filename;
    
        $imageWidth = 1000;
        $imageHeight = 800;
    
        $m = $imageHeight / $imageWidth;
    
        $actualImageWidth = 0;
        $actualImageHeight = 0;

        $actualImageWidth = ($data['frame_width'] - ($data['column'] - 1) * $data['margin_x_between'] - $data['left_margin'] - $data['right_margin']) / $data['column'];

        $actualImageHeight = $m * $actualImageWidth;
    
        $data['image_width'] = $actualImageWidth;
        $data['image_height'] = $actualImageHeight;
    
        $new_frame = Frame::create($data);
    
        if ($new_frame) {
            return redirect()->intended('/admin/dashboard');
        } else {
            return redirect()->back()->withErrors(['info' => 'Upload Frame Gagal']);
        }
    }

    public function adminEditFramePage(Frame $frame) {
        if (!Auth::check()) {
            abort(404);
        }

        return inertia('EditFrameForm',
            ['frame' => $frame]
        );
    }

    public function adminUpdateFrameHandler(Request $request) {
        if (!Auth::check()) {
            abort(404);
        }

        // dd($request->all());

        $data = $request->validate([
            'id' => 'required|exists:frames,id',
            'frame' => 'sometimes|required|file|image',
            'name' => 'required|ascii',
            'frame_width' => 'required|numeric',
            'frame_height' => 'required|numeric',
            'number_of_photos' => 'required|numeric|min:1',
            'row' => 'required|numeric|min:1',
            'column' => 'required|numeric|min:1',
            'left_margin' => 'required|numeric|min:0',
            'right_margin' => 'required|numeric|min:0',
            'top_margin' => 'required|numeric|min:0',
            'bottom_margin' => 'required|numeric|min:0',
            'margin_x_between' => 'required|numeric|min:0',
            'margin_y_between' => 'required|numeric|min:0',
            'photo_position' => ['required', 'array'],
            'photo_position.*.x' => ['required', 'numeric', 'min:0'],
            'photo_position.*.y' => ['required', 'numeric', 'min:0'],
            'printable' => 'required|boolean',
            'visibility' => 'required|boolean'
        ]);

        $data['photo_position'] = array_map(function ($value) {
            return [
                'x' => (float) $value['x'],
                'y' => (float) $value['y']
            ];
        }, $data['photo_position']);

        if ($request->has('frame')) {
            $filepath = $request->file('frame')->store('/public/frames');
            $file_array_name = explode('/', $filepath);
        
            $filename = array_pop($file_array_name);
        
            $data['filename'] = $filename;
        }

        $imageWidth = 1000;
        $imageHeight = 800;
    
        $m = $imageHeight / $imageWidth;
    
        $actualImageWidth = 0;
        $actualImageHeight = 0;

        $actualImageWidth = ($data['frame_width'] - ($data['column'] - 1) * $data['margin_x_between'] - $data['left_margin'] - $data['right_margin']) / $data['column'];

        $actualImageHeight = $m * $actualImageWidth;
    
        $data['image_width'] = $actualImageWidth;
        $data['image_height'] = $actualImageHeight;

        $frame = Frame::find($data['id']);

        if ($request->has('frame')) {
            $frame->filename = $data['filename'];
        }

        $frame->name = $data['name'];
        $frame->frame_width = $data['frame_width'];
        $frame->frame_height = $data['frame_height'];
        $frame->number_of_photos = $data['number_of_photos'];
        $frame->row = $data['row'];
        $frame->column = $data['column'];
        $frame->left_margin = $data['left_margin'];
        $frame->right_margin = $data['right_margin'];
        $frame->top_margin = $data['top_margin'];
        $frame->bottom_margin = $data['bottom_margin'];
        $frame->margin_x_between = $data['margin_x_between'];
        $frame->margin_y_between = $data['margin_y_between'];
        $frame->photo_position = $data['photo_position'];
        $frame->printable = $data['printable'];
        $frame->visibility = $data['visibility'];
        $frame->image_width = $data['image_width'];
        $frame->image_height = $data['image_height'];

        if ($frame->save()) {
            return redirect()->intended('/admin/dashboard');
        } else {
            return redirect()->back()->withErrors(['info' => 'Update Frame Gagal']);
        }
    }
}
