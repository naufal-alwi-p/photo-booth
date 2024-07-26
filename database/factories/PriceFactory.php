<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Price>
 */
class PriceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->paragraph(),
            'price' => fake()->numberBetween(1000, 35000),
            'printable' => fake()->boolean(),
            'visibility' => fake()->boolean(),
        ];
    }
}
