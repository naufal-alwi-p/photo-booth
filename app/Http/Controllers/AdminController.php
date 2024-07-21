<?php

namespace App\Http\Controllers;

use App\ImageOrientation;
use App\Models\Frame;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
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
    
        $frames = Frame::select('filename', 'name')->get();
    
        return inertia('AdminDashboard', ['frames' => $frames]);
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
            'left_margin' => 'required|numeric',
            'right_margin' => 'required|numeric',
            'top_margin' => 'required|numeric',
            'bottom_margin' => 'required|numeric',
            'margin_between' => 'required|numeric',
            'orientation' => ['required', Rule::enum(ImageOrientation::class)]
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
    
        if ($data['orientation'] === ImageOrientation::Potrait->value) {
            $actualImageWidth = $data['frame_width'] - $data['left_margin'] - $data['right_margin'];
    
            $actualImageHeight = $m * $actualImageWidth;
        } else {
            $actualImageHeight = $data['frame_height'] - $data['top_margin'] - $data['bottom_margin'];
    
            $actualImageWidth = $actualImageHeight / $m;
        }
    
        $data['image_width'] = $actualImageWidth;
        $data['image_height'] = $actualImageHeight;
    
        $new_frame = Frame::create($data);
    
        if ($new_frame) {
            return redirect()->intended('/admin/dashboard');
        } else {
            return redirect()->back()->withErrors(['info' => 'Upload Frame Gagal']);
        }
    }
}
