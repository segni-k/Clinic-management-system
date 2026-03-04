<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        Role::updateOrCreate(['slug' => 'doctor'], ['name' => 'Doctor']);
        Role::updateOrCreate(['slug' => 'receptionist'], ['name' => 'Receptionist']);
    }
}
