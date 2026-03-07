<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('zona', function (Blueprint $table) {
            if (!Schema::hasColumn('zona', 'latitud_centro')) {
                $table->decimal('latitud_centro', 10, 8)->nullable();
            }

            if (!Schema::hasColumn('zona', 'longitud_centro')) {
                $table->decimal('longitud_centro', 11, 8)->nullable();
            }

            if (!Schema::hasColumn('zona', 'limites')) {
                $table->jsonb('limites')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('zona', function (Blueprint $table) {
            if (Schema::hasColumn('zona', 'limites')) {
                $table->dropColumn('limites');
            }

            if (Schema::hasColumn('zona', 'longitud_centro')) {
                $table->dropColumn('longitud_centro');
            }

            if (Schema::hasColumn('zona', 'latitud_centro')) {
                $table->dropColumn('latitud_centro');
            }
        });
    }
};