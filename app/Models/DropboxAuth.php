<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DropboxAuth extends Model
{
    use HasFactory;

    protected $table = 'dropbox_auths';

    protected $fillable = [
        'user_id',
        'access_token',
        'refresh_token',
        'expires_date',
    ];

    public $timestamps = false;

    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'expires_date' => 'datetime',
        ];
    }

    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
