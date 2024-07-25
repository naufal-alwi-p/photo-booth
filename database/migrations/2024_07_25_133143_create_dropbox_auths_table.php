<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dropbox_auths', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->text('access_token');
            $table->text('refresh_token');
            $table->timestamp('expires_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dropbox_auths');
    }
};
