<?php

namespace Database\Seeders;

use App\Models\Price;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        Price::factory()->create([
            'name' => 'Download the Picture',
            'price' => 20000,
            'printable' => false,
            'visibility' => true,
        ]);

        Price::factory()->create([
            'name' => 'Print the Picture',
            'price' => 30000,
            'printable' => true,
            'visibility' => false,
        ]);
    }
}
