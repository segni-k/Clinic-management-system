<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(RoleSeeder::class);

        $adminRole = Role::where('slug', 'admin')->first();
        $doctorRole = Role::where('slug', 'doctor')->first();
        $receptionistRole = Role::where('slug', 'receptionist')->first();

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@clinic.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        $doctorUser = User::create([
            'name' => 'Dr. John Smith',
            'email' => 'doctor@clinic.com',
            'password' => Hash::make('password'),
            'role_id' => $doctorRole->id,
        ]);

        $receptionist = User::create([
            'name' => 'Receptionist',
            'email' => 'reception@clinic.com',
            'password' => Hash::make('password'),
            'role_id' => $receptionistRole->id,
        ]);

        Doctor::create([
            'name' => 'Dr. John Smith',
            'specialization' => 'General Practice',
            'phone' => '+251911111111',
            'email' => 'doctor@clinic.com',
            'user_id' => $doctorUser->id,
            'availability' => ['monday' => ['09:00', '10:00', '11:00'], 'tuesday' => ['09:00', '10:00'], 'wednesday' => ['14:00', '15:00']],
        ]);

        Patient::create([
            'first_name' => 'Abebe',
            'last_name' => 'Kebede',
            'phone' => '+251922222222',
            'gender' => 'male',
            'date_of_birth' => '1990-01-15',
            'address' => 'Addis Ababa, Ethiopia',
            'created_by' => $admin->id,
        ]);

        Patient::create([
            'first_name' => 'Tigist',
            'last_name' => 'Hailu',
            'phone' => '+251933333333',
            'gender' => 'female',
            'date_of_birth' => '1985-05-20',
            'address' => 'Addis Ababa, Ethiopia',
            'created_by' => $receptionist->id,
        ]);
    }
}
