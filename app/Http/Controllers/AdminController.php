<?php

namespace App\Http\Controllers;

use App\ImageOrientation;
use App\Models\Frame;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

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
    
        $frames = Frame::select('id', 'filename', 'frame_width', 'frame_height', 'name', 'visibility')->get();
    
        return inertia('AdminDashboard', ['frames' => $frames, 'csrf' => csrf_token()]);
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
            'photo_position' => ['required', 'json'],
            'printable' => 'required|boolean',
            'visibility' => 'required|boolean'
        ]);
    
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
            'photo_position' => ['required', 'json'],
            'printable' => 'required|boolean',
            'visibility' => 'required|boolean'
        ]);

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
